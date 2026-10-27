import fs from 'node:fs';
import path from 'node:path';
import { pages, baseUrl } from '../src/data.mjs';
import { config } from '../src/config.mjs';
import { imagery, heroConcepts } from '../src/imagery.mjs';
import { createHash } from 'node:crypto';
const root=path.resolve('dist'), issues=[], titles=new Set(), descriptions=new Set();
const urls=new Set(pages.map(p=>p.path));
const htmlByPath=new Map(pages.map(p=>[p.path,fs.existsSync(path.join(root,p.path,'index.html'))?fs.readFileSync(path.join(root,p.path,'index.html'),'utf8'):null]));
const fail=(p,message)=>issues.push(`${p}: ${message}`);
const attr=(tag,name)=>tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
for(const p of pages){
  const html=htmlByPath.get(p.path);if(!html){fail(p.path,'Missing generated page');continue;}
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description=attr(html.match(/<meta name="description"[^>]*>/)?.[0]||'','content');
  if(!title||titles.has(title))fail(p.path,'Missing or duplicate title');titles.add(title);
  if(!description||descriptions.has(description))fail(p.path,'Missing or duplicate description');descriptions.add(description);
  const headings=[...html.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)].map(m=>+m[1]);
  if(headings.filter(h=>h===1).length!==1)fail(p.path,'Expected exactly one H1');
  for(let i=1;i<headings.length;i++)if(headings[i]>headings[i-1]+1)fail(p.path,`Heading level jumps from H${headings[i-1]} to H${headings[i]}`);
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if(canonical!==baseUrl+p.path)fail(p.path,'Canonical differs from configured URL');
  const robots=html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  if(!robots?.startsWith(!config.production||p.kind==='legal'?'noindex':'index'))fail(p.path,'Unexpected indexability');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)fail(p.path,'Duplicate HTML IDs');
  for(const match of html.matchAll(/\b(?:href|src)="([^" ]+)"/g)){
    const raw=match[1].replaceAll('&amp;','&');
    if(!raw.startsWith('/')&&!raw.startsWith('#'))continue;
    const target=new URL(raw,baseUrl+p.path),pathname=decodeURIComponent(target.pathname);
    if(pathname.startsWith('/assets/')){
      if(!fs.existsSync(path.join(root,pathname)))fail(p.path,`Missing asset ${pathname}`);
    }else if(!urls.has(pathname))fail(p.path,`Broken internal URL ${pathname}`);
    if(target.hash&&urls.has(pathname)){
      const targetHtml=htmlByPath.get(pathname)||'';
      if(!targetHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`))fail(p.path,`Missing anchor ${raw}`);
    }
  }
  try{
    const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const types=data['@graph'].map(n=>n['@type']);
    for(const type of ['Organization','WebSite','WebPage','Person',...(p.path==='/'?[]:['BreadcrumbList']),...(p.kind==='guide'?['Article']:[]),...(p.kind==='service'?['Service']:[])])if(!types.includes(type))fail(p.path,`Missing schema ${type}`);
    if(p.kind==='guide'){
      const article=data['@graph'].find(n=>n['@type']==='Article');
      if(!article.datePublished||!article.dateModified||!article.author?.['@id'])fail(p.path,'Incomplete article metadata');
      if(html.includes('data-enquiry-form='))fail(p.path,'Guide should use a contextual CTA, not a full enquiry form');
    }
  }catch(e){fail(p.path,'Invalid structured data: '+e.message);}
  for(const match of html.matchAll(/<img\b[^>]*>/g)){
    const tag=match[0],src=attr(tag,'src');
    if(attr(tag,'alt')===undefined)fail(p.path,'Image missing alt '+src);
    if(!(Number(attr(tag,'width'))>0&&Number(attr(tag,'height'))>0))fail(p.path,'Image missing dimensions '+src);
    if(!['eager','lazy'].includes(attr(tag,'loading')))fail(p.path,'Image loading not explicit '+src);
    if(tag.includes('class="site-image"')&&!attr(tag,'srcset'))fail(p.path,'Photograph missing responsive sources '+src);
  }
  if(!html.includes('property="og:image"')||!html.includes('name="twitter:image"'))fail(p.path,'Missing social image metadata');
  if(html.includes('data-mailto'))fail(p.path,'Legacy mailto form remains');
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const expected=pages.filter(p=>p.kind!=='legal').map(p=>baseUrl+p.path);
if(JSON.stringify(sitemapUrls)!==JSON.stringify(expected))fail('sitemap','URLs differ from canonical, non-legal pages');
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
if(!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`)||!robots.includes('Allow: /'))fail('robots','Unexpected crawl policy');
const redirects=fs.readFileSync(path.join(root,'_redirects'),'utf8').trim().split('\n');
for(const rule of redirects){const [from,to,status]=rule.split(/\s+/);if(!from.startsWith('/')||!urls.has(to)||status!=='301')fail('redirects','Invalid rule '+rule);}
const css=fs.readFileSync(path.join(root,'assets/site.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?(\/[^)'"]+)['"]?\)/g))if(!fs.existsSync(path.join(root,match[1])))fail('stylesheet','Missing local resource '+match[1]);
const seenPhotos=new Set(), usedPhotos=[];
for(const [route,html] of htmlByPath){
  for(const match of (html||'').matchAll(/data-photo-key="([^"]+)" data-photo-id="(\d+)"/g)){
    const [,key,id]=match;usedPhotos.push(key);
    if(seenPhotos.has(id))fail(route,'Photograph reused: '+id);
    seenPhotos.add(id);
    if(String(imagery[key]?.sourceId)!==id)fail(route,'Unknown photo assignment '+key);
  }
}
if(usedPhotos.length!==Object.keys(imagery).length||new Set(usedPhotos).size!==usedPhotos.length)fail('imagery','Every photograph must have exactly one placement');
const sourceHashes=new Set();
for(const [key,photo] of Object.entries(imagery)){
  if(!usedPhotos.includes(key))fail('imagery','Unused assignment '+key);
  if(sourceHashes.has(photo.originalSha256))fail('imagery','Duplicate original photograph '+key);
  sourceHashes.add(photo.originalSha256);
  if(!photo.alt||!photo.source||!photo.photographer||!photo.licenseChecked)fail('imagery','Incomplete source record '+key);
  for(const variant of photo.variants){
    const file=path.join(root,variant.src);
    if(!fs.existsSync(file))fail('imagery','Missing responsive variant '+variant.src);
    else if(createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==variant.sha256)fail('imagery','Asset differs from reviewed file '+variant.src);
  }
}
const usedConcepts=[];
for(const [route,html] of htmlByPath)for(const match of (html||'').matchAll(/data-concept-id="([^"]+)" src="([^"]+)"/g)){
  const [,key,src]=match;
  if(usedConcepts.includes(key))fail(route,'Concept graphic reused '+key);
  usedConcepts.push(key);
  if(heroConcepts[key]?.src!==src||!fs.existsSync(path.join(root,src)))fail(route,'Missing or incorrect uploaded concept '+key);
}
if(usedConcepts.length!==Object.keys(heroConcepts).length)fail('hero concepts','Every uploaded hero assignment must be used once');
const png=fs.readFileSync(path.join(root,'assets/elderindex-social.png'));
if(png.readUInt32BE(16)!==1200||png.readUInt32BE(20)!==630)fail('social image','Expected 1200 × 630 PNG');
console.log(`${pages.length} pages checked; ${issues.length} issues. Checked metadata, headings, schema, links, assets, sitemap, robots and ${redirects.length} redirect rules; ${seenPhotos.size} unique photographs and ${usedConcepts.length} uploaded hero graphics.`);
if(issues.length){issues.forEach(x=>console.error(x));process.exit(1);}
