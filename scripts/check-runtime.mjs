// Local Cloudflare Static Assets emulation only. Never deploys or sends enquiries.
import {spawn} from 'node:child_process';import fs from 'node:fs';import assert from 'node:assert/strict';
import {pages}from'../src/data.mjs';import{config}from'../src/config.mjs';
const origin='http://127.0.0.1:4197';const started=new Date().toISOString();let logs='';
const child=spawn('node_modules/.bin/wrangler',['dev','--local','--ip','127.0.0.1','--port','4197','--persist-to','/tmp/elderindex-release-workerd'],{env:{...process.env,WRANGLER_SEND_METRICS:'false',XDG_CONFIG_HOME:'/tmp/elderindex-wrangler-config'},stdio:['ignore','pipe','pipe']});
child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
const results=[];
async function check(route,status){const r=await fetch(origin+route,{redirect:'manual'});assert.equal(r.status,status,route+' HTTP status');results.push({path:route,status:r.status,location:r.headers.get('location'),robotsHeader:r.headers.get('x-robots-tag')});return r;}
try{
 let ready=false;for(let n=0;n<200;n++){if(child.exitCode!==null)throw Error(logs);try{await fetch(origin);ready=true;break;}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'Local Cloudflare runtime startup: '+logs);
 for(const p of pages){const r=await check(p.path,200);assert.equal(r.headers.get('x-robots-tag'),config.production?null:'noindex, follow');const h=await r.text();assert.ok(h.includes(`content="${config.production&&p.kind!=='legal'?'index':'noindex'}, follow"`));}
 const rules=fs.readFileSync('dist/_redirects','utf8').trim().split('\n').map(l=>l.split(/\s+/));
 for(const[from,to]of rules){
  for(const search of ['', '?utm_source=release-check']){
   const r=await check(from+search,301);assert.ok(r.headers.get('location'),'Missing Location '+from);
   const destination=new URL(r.headers.get('location'),origin);
   assert.equal(destination.origin,origin,'Unexpected redirect host '+from);assert.equal(destination.pathname,to);
   assert.equal(destination.search,search,'Query changed '+from);assert.equal(destination.hash,'');
   const final=await check(destination.pathname+destination.search,200);assert.equal(final.headers.get('location'),null,'Redirect chain/loop '+from);
  }
 }
 // Canonical forms of old slashless URLs must remain 200, never self-redirect.
 for(const p of ['/about/','/services/','/services/home-care/','/talk-to-us/','/privacy/','/terms/']){
  const r=await check(p,200);assert.equal(r.headers.get('location'),null,'Canonical self-redirect '+p);
 }
 for(const route of ['/robots.txt','/sitemap.xml','/assets/site.css','/assets/site.js'])await check(route,200);
 for(const route of ['/this-release-path-does-not-exist','/cms/','/api/bootstrap'])await check(route,404);
 // Cloudflare first normalises percent-encoding (307), then applies the explicit legacy 301.
 // This is a platform-normalisation probe, not an additional historic URL mapping.
 const query='?utm_source=encoded-release-check';
 const encoded=await check('/%77ebsite-design'+query,307);
 const decoded=new URL(encoded.headers.get('location'),origin);
 assert.equal(decoded.origin,origin);assert.equal(decoded.pathname,'/website-design');assert.equal(decoded.search,query);
 const alias=await check(decoded.pathname+decoded.search,301);
 const canonical=new URL(alias.headers.get('location'),origin);
 assert.equal(canonical.origin,origin);assert.equal(canonical.pathname,'/services/website-design/');assert.equal(canonical.search,query);
 const end=await check(canonical.pathname+canonical.search,200);assert.equal(end.headers.get('location'),null);
 await check('/WEBSITE-DESIGN',404); // No unsupported case-insensitive migration invented.
 const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify({checkedAtUtc:started,scope:'LOCAL Cloudflare workerd, not deployed HTTP',environment:config.production?'production':'staging',results},null,2)+'\n');
 console.log(`Cloudflare local runtime: ${results.length} HTTP checks passed (${config.production?'production':'staging'}), including redirects with queries, assets, indexability and 404s.`);
}finally{child.kill('SIGTERM');}
