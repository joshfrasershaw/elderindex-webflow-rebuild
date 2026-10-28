import {redirectRules} from '../src/redirect-rules.mjs';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import { config } from '../src/config.mjs';
import {execFileSync} from 'node:child_process';
import {pages,baseUrl} from '../src/data.mjs';import {render,renderNotFound} from '../src/template.mjs';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const output=process.env.BUILD_OUTPUT_DIR||'dist';if(!['dist','dist-production'].includes(output))throw Error('Unsupported build output directory');if(output==='dist-production'&&!config.production)throw Error('Production directory requires production configuration');const dist=path.join(dir,output);fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
for(const p of pages){const dst=path.join(dist,p.path,'index.html');fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,render(p));}
fs.copyFileSync(path.join(dir,'src','styles.css'),path.join(dist,'assets','site.css'));
fs.copyFileSync(path.join(dir,'src','client.js'),path.join(dist,'assets','site.js'));
fs.cpSync(path.join(dir,'public'),dist,{recursive:true});
const legacy=JSON.parse(fs.readFileSync(path.join(dir,'src/legacy-redirects.json'),'utf8'));
fs.writeFileSync(path.join(dist,'_redirects'),redirectRules(legacy).map(r=>r.join(' ')).join('\n')+'\n');
fs.writeFileSync(path.join(dist,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n${config.production?'':'  X-Robots-Tag: noindex, follow\n'}\n/assets/*\n  Cache-Control: public, max-age=86400\n`);
fs.writeFileSync(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /${config.production?'':'\n# Staging pages are marked noindex in HTML and response headers.'}\nSitemap: ${baseUrl}/sitemap.xml\n`);
let sourceSha='UNVERIFIED',trackedChanges=true;
try{sourceSha=execFileSync('git',['rev-parse','HEAD'],{cwd:dir,encoding:'utf8'}).trim();trackedChanges=Boolean(execFileSync('git',['status','--porcelain','--untracked-files=no'],{cwd:dir,encoding:'utf8'}).trim());}catch{}
fs.writeFileSync(path.join(dist,'release.json'),JSON.stringify({sourceSha,trackedChanges,environment:config.production?'production':'staging',canonicalOrigin:baseUrl,pageCount:pages.length},null,2)+'\n');
const sitemap=pages.filter(x=>x.kind!=='legal').map(p=>`  <url><loc>${baseUrl+p.path}</loc></url>`).join('\n');
fs.writeFileSync(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);
fs.writeFileSync(path.join(dist,'404.html'),renderNotFound());
console.log(`Built ${pages.length} pages into ${dist}`);
