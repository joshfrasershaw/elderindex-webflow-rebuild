import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import{spawnSync}from'node:child_process';
import {createApexRedirect} from '../src/apex-redirect.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const handler=createApexRedirect(read('src/legacy-redirects.json'));
const map=read('docs/launch/legacy-url-map.json');
test('every inventoried apex URL reaches its canonical www destination directly over HTTP/HTTPS with queries',()=>{
 for(const row of map)for(const protocol of ['http:','https:'])for(const query of ['', '?utm_source=cutover-test&name=a%20b']){
  const r=handler.fetch(new Request(protocol+'//elderindex.co.uk'+row.old_path+query));
  assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://www.elderindex.co.uk'+row.destination_path+query,row.old_path);
 }
});
test('canonical paths and assets preserve path/query without accepting an arbitrary target host',()=>{
 for(const path of ['/services/website-design/','/assets/site.css','/not-found','//untrusted.invalid/path']){
  const r=handler.fetch(new Request('https://elderindex.co.uk'+path+'?next=https://untrusted.invalid'));
  const target=new URL(r.headers.get('location'));assert.equal(target.origin,'https://www.elderindex.co.uk');assert.equal(target.pathname,path);assert.equal(target.search,'?next=https://untrusted.invalid');
 }
});
test('an accidental www binding refuses requests instead of self-redirecting; other hosts and POST are rejected',()=>{
 for(const host of ['www.elderindex.co.uk','untrusted.invalid']){const r=handler.fetch(new Request('https://'+host+'/'));assert.equal(r.status,421);assert.equal(r.headers.get('location'),null);}
 assert.equal(handler.fetch(new Request('https://elderindex.co.uk/',{method:'POST',body:'test'})).status,405);
 assert.equal(handler.fetch(new Request('https://elderindex.co.uk/',{method:'HEAD'})).status,301);
});
test('production and apex targets are separate from staging, unbound and without public preview URLs',()=>{
 const stage=read('wrangler.jsonc'),prod=read('wrangler.production.jsonc'),apex=read('wrangler.apex-redirect.jsonc');
 assert.equal(new Set([stage.name,prod.name,apex.name]).size,3);
 assert.equal(stage.assets.directory,'./dist');assert.equal(prod.assets.directory,'./dist-production');
 for(const config of [prod,apex]){assert.equal(config.workers_dev,false);assert.equal(config.preview_urls,false);assert.equal(config.routes,undefined);assert.equal(config.route,undefined);}
});
test('build output guard refuses arbitrary paths and staging builds in the production directory',()=>{
 for(const [directory,env]of [['../unsafe','production'],['dist-production','staging']]){
  const r=spawnSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BUILD_OUTPUT_DIR:directory,SITE_ENV:env},encoding:'utf8'});
  assert.notEqual(r.status,0);assert.match(r.stderr,/Unsupported build output directory|Production directory requires/);
 }
});
