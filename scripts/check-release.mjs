import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pages,baseUrl} from '../src/data.mjs';
import {config} from '../src/config.mjs';
const read=p=>fs.readFileSync(path.join('dist',p),'utf8');
const header=read('_headers');
const release=JSON.parse(read('release.json'));
assert.match(release.sourceSha,/^[a-f0-9]{40}$/,'Build must identify a Git source revision');
assert.equal(release.environment,config.production?'production':'staging');
assert.equal(release.canonicalOrigin,baseUrl);
assert.equal(header.includes('X-Robots-Tag: noindex'),!config.production,'Global indexability header');
const routes=pages.map(p=>{
 const html=read(path.join(p.path,'index.html'));
 const robots=html.match(/<meta name="robots" content="([^"]+)"/)[1];
 assert.equal(robots,config.production&&p.kind!=='legal'?'index, follow':'noindex, follow',p.path);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 const ids=graph.map(x=>x['@id']);assert.equal(ids.length,new Set(ids).size,p.path+' entity IDs');
 const walk=n=>{if(!n||typeof n!=='object')return;if(n['@id']&&Object.keys(n).length===1)assert.ok(ids.includes(n['@id']),p.path+' unresolved entity '+n['@id']);for(const v of Object.values(n))if(typeof v==='object')Array.isArray(v)?v.forEach(walk):walk(v);};graph.forEach(walk);
 return {path:p.path,kind:p.kind,canonical:baseUrl+p.path,robots,title:p.title,h1:p.headline||'template heading'};
});
const rules=read('_redirects').trim().split('\n').map(x=>x.split(/\s+/));
assert.equal(new Set(rules.map(r=>r[0])).size,rules.length,'Duplicate redirect source');
for(const [from,to,status]of rules){assert.equal(status,'301');assert.ok(!from.startsWith('/assets/'));assert.ok(!rules.some(r=>r[0]===to),'Redirect chain '+from);assert.ok(pages.some(p=>p.path===to),'Unknown target '+to);}
assert.ok(!/\/\*\s+\//.test(read('_redirects')),'No blanket homepage redirect');
const sitemap=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.deepEqual(sitemap,pages.filter(p=>p.kind!=='legal').map(p=>baseUrl+p.path));
for(const file of ['404.html','robots.txt','sitemap.xml','assets/site.js','assets/site.css'])assert.ok(read(file).length);
assert.ok(!fs.existsSync('dist/cms')&&!fs.existsSync('dist/api'),'Private CMS must not enter public output');
const manifest={...release,analyticsConfigured:Boolean(config.measurementId),pageCount:routes.length,routes,redirectRules:rules};
const output=process.argv[2];if(output){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(manifest,null,2)+'\n');}
console.log(`${manifest.environment}: release invariants passed; ${routes.length} pages, ${rules.length} redirects; analytics ${manifest.analyticsConfigured?'configured':'OFF'}.`);
