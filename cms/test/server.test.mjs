import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {unzipSync} from 'fflate';
import sharp from 'sharp';
const directory=await mkdtemp(path.join(os.tmpdir(),'elderindex-cms-api-')),base='http://127.0.0.1:4323';let child,token,record,logs='';
async function start(){child=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,CMS_PORT:'4323',CMS_DATA_DIR:directory},stdio:['ignore','pipe','pipe']});child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);for(let i=0;i<100;i++){try{const r=await fetch(base+'/api/bootstrap');if(r.ok){token=(await r.json()).csrf;record=await(await fetch(base+'/api/pages/website-design')).json();return;}}catch{}await new Promise(r=>setTimeout(r,100));}throw new Error('CMS did not start: '+logs);}
before(start);
after(async()=>{child?.kill('SIGTERM');if(child?.exitCode===null)await new Promise(resolve=>{child.once('exit',resolve);setTimeout(()=>{child.kill('SIGKILL');resolve();},3000).unref();});await rm(directory,{recursive:true,force:true});});
const write=(url,method,data)=>fetch(base+url,{method,headers:{Origin:base,'X-CMS-CSRF':token,'Content-Type':'application/json'},body:JSON.stringify(data)});
test('unsafe hosts and cross-site writes are rejected',async()=>{
  assert.equal(await new Promise((resolve,reject)=>{http.get(base+'/api/bootstrap',{headers:{Host:'untrusted.example'}},res=>{res.resume();resolve(res.statusCode)}).on('error',reject)}),403);
  assert.equal((await fetch(base+'/api/pages/website-design',{method:'PUT',headers:{Origin:'https://untrusted.example','X-CMS-CSRF':token},body:'{}'})).status,403);
  assert.equal((await fetch(base+'/api/pages/website-design',{method:'PUT',headers:{Origin:base},body:'{}'})).status,403);
});
test('saving is durable and stale revisions are rejected',async()=>{
  const r=await write('/api/pages/website-design','PUT',{data:record.data,revision:0});assert.equal(r.status,200);const saved=await r.json();assert.equal(saved.revision,1);assert.equal(JSON.parse(await readFile(path.join(directory,'website-design/draft.json'))).revision,1);
  assert.equal((await write('/api/pages/website-design','PUT',{data:record.data,revision:0})).status,409);
});
test('preview does not save, publish is unavailable and the source page is not changed',async()=>{
  const original=await readFile(new URL('../../src/data.mjs',import.meta.url));const r=await write('/api/previews','POST',{data:record.data});assert.equal(r.status,201);const preview=await r.json();const page=await fetch(base+preview.url);const html=await page.text();assert.match(html,/Unpublished local preview/);assert.match(html,/noindex, nofollow/);assert.match(html,/Preview only: no enquiry was sent/);assert.equal((await(await fetch(base+'/api/pages/website-design')).json()).revision,1);
  assert.equal((await write('/api/publish','POST',{})).status,501);assert.deepEqual(await readFile(new URL('../../src/data.mjs',import.meta.url)),original);
});
test('media accepts real raster images, rejects active formats and creates responsive files',async()=>{
  const input=await sharp({create:{width:1100,height:700,channels:3,background:'#452b52'}}).png().toBuffer();
  const uploaded=await fetch(base+'/api/media',{method:'POST',headers:{Origin:base,'X-CMS-CSRF':token,'Content-Type':'image/png'},body:input});assert.equal(uploaded.status,201);const asset=await uploaded.json();assert.equal(asset.variants.length,3);assert.equal(asset.variants.at(-1).width,1100);assert.equal((await fetch(base+asset.src)).status,200);
  assert.equal((await fetch(base+'/api/media',{method:'POST',headers:{Origin:base,'X-CMS-CSRF':token,'Content-Type':'image/svg+xml'},body:'<svg onload="alert(1)"/>'})).status,400);
});
test('backup contains portable content and local media, without request tokens',async()=>{
  const r=await fetch(base+'/api/backup');assert.equal(r.status,200);const files=unzipSync(new Uint8Array(await r.arrayBuffer()));assert.ok(files['website-design/draft.json']);assert.ok(files['media/index.json']);assert.ok(Object.keys(files).some(x=>x.endsWith('.webp')));assert.equal(Buffer.from(files['website-design/draft.json']).toString().includes(token),false);
});

test('saved draft and uploaded library survive a complete server restart',async()=>{
 const before=await(await fetch(base+'/api/pages/website-design')).json();child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve));await start();const restored=await(await fetch(base+'/api/pages/website-design')).json();assert.deepEqual(restored,before);const media=await(await fetch(base+'/api/media')).json();assert.equal(media.filter(asset=>!asset.existing).length,1);
});
