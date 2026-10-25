import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import { config } from '../src/config.mjs';
import {pages,baseUrl} from '../src/data.mjs';import {render} from '../src/template.mjs';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const dist=path.join(dir,'dist');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
for(const p of pages){const dst=path.join(dist,p.path,'index.html');fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,render(p));}
fs.copyFileSync(path.join(dir,'src','styles.css'),path.join(dist,'assets','site.css'));
fs.copyFileSync(path.join(dir,'src','client.js'),path.join(dist,'assets','site.js'));
fs.cpSync(path.join(dir,'public'),dist,{recursive:true});
const redirects=[['/website-design','/services/website-design/'],['/website-management','/services/website-management/'],['/search-visibility','/services/search-visibility/'],['/care-directory-management','/services/care-directory-management/'],['/care-home-seo','/services/care-home-seo/'],['/home-care','/services/home-care/'],['/choosing-a-care-website','/guides/choosing-a-care-website/'],['/home-care-local-seo','/guides/home-care-local-seo/'],['/care-directory-comparison','/guides/care-directory-comparison/'],['/carehome-co-uk-profile','/guides/carehome-co-uk-profile/'],['/google-business-profile-care','/guides/google-business-profile-care/']];
fs.writeFileSync(path.join(dist,'_redirects'),redirects.flatMap(([from,to])=>[`${from} ${to} 301`,`${from}/ ${to} 301`]).join('\n')+'\n');
fs.writeFileSync(path.join(dist,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n${config.production?'':'  X-Robots-Tag: noindex, follow\n'}\n/assets/*\n  Cache-Control: public, max-age=86400\n`);
fs.writeFileSync(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /${config.production?'':'\n# Staging pages are marked noindex in HTML and response headers.'}\nSitemap: ${baseUrl}/sitemap.xml\n`);
const sitemap=pages.filter(x=>x.kind!=='legal').map(p=>`  <url><loc>${baseUrl+p.path}</loc></url>`).join('\n');
fs.writeFileSync(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);
fs.writeFileSync(path.join(dist,'404.html'),`<!doctype html><html lang="en-GB"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | ElderIndex</title><meta name="robots" content="noindex, follow"><link rel="stylesheet" href="/assets/site.css"></head><body><main style="max-width:700px;margin:14vh auto;text-align:center;padding:25px"><p class="eyebrow">404 — PAGE NOT FOUND</p><h1>That page isn't here.</h1><p>Find useful digital support for your care business on the ElderIndex homepage.</p><a href="/" class="pill pill-gold">Back to ElderIndex ↗</a></main></body></html>`);
console.log(`Built ${pages.length} pages into ${dist}`);
