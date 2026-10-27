// Local Cloudflare Static Assets emulation only. Never deploys or sends enquiries.
import {spawn} from 'node:child_process';import fs from 'node:fs';import assert from 'node:assert/strict';
import {pages}from'../src/data.mjs';import{config}from'../src/config.mjs';
const origin='http://127.0.0.1:4197';const started=new Date().toISOString();let logs='';
const child=spawn('node_modules/.bin/wrangler',['dev','--local','--ip','127.0.0.1','--port','4197','--persist-to','/tmp/elderindex-release-workerd'],{env:{...process.env,WRANGLER_SEND_METRICS:'false'},stdio:['ignore','pipe','pipe']});
child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
const results=[];
async function check(route,status){const r=await fetch(origin+route,{redirect:'manual'});assert.equal(r.status,status,route+' HTTP status');results.push({path:route,status:r.status,location:r.headers.get('location'),robotsHeader:r.headers.get('x-robots-tag')});return r;}
try{
 let ready=false;for(let n=0;n<200;n++){if(child.exitCode!==null)throw Error(logs);try{await fetch(origin);ready=true;break;}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'Local Cloudflare runtime startup: '+logs);
 for(const p of pages){const r=await check(p.path,200);assert.equal(r.headers.get('x-robots-tag'),config.production?null:'noindex, follow');const h=await r.text();assert.ok(h.includes(`content="${config.production&&p.kind!=='legal'?'index':'noindex'}, follow"`));}
 const rules=fs.readFileSync('dist/_redirects','utf8').trim().split('\n').map(l=>l.split(/\s+/));
 for(const[from,to]of rules){const r=await check(from,301);assert.equal(new URL(r.headers.get('location'),origin).pathname,to);const q=await check(from+'?utm_source=release-check',301);assert.equal(new URL(q.headers.get('location'),origin).pathname,to);assert.equal(new URL(q.headers.get('location'),origin).search,'?utm_source=release-check');}
 for(const route of ['/robots.txt','/sitemap.xml','/assets/site.css','/assets/site.js'])await check(route,200);
 for(const route of ['/this-release-path-does-not-exist','/cms/','/api/bootstrap'])await check(route,404);
 const encoded=await fetch(origin+'/%77ebsite-design',{redirect:'manual'});results.push({path:'/%77ebsite-design',status:encoded.status,location:encoded.headers.get('location')});
 await check('/WEBSITE-DESIGN',404); // No unsupported case-insensitive migration invented.
 const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify({checkedAtUtc:started,scope:'LOCAL Cloudflare workerd, not deployed HTTP',environment:config.production?'production':'staging',results},null,2)+'\n');
 console.log(`Cloudflare local runtime: ${results.length} HTTP checks passed (${config.production?'production':'staging'}), including redirects with queries, assets, indexability and 404s.`);
}finally{child.kill('SIGTERM');}
