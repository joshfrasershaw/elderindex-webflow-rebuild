import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{CmsState,webpDimensions} from './worker.mjs';
import snapshot from './.generated/snapshot.json' with {type:'json'};
import sharp from 'sharp';
class Storage{
 constructor(){this.map=new Map();this.queue=Promise.resolve();}
 async get(k){return structuredClone(this.map.get(k));}
 async put(k,v){if(typeof k==='object'){for(const [a,b]of Object.entries(k))this.map.set(a,structuredClone(b));}else this.map.set(k,structuredClone(v));}
 async delete(k){return this.map.delete(k);}
 async list({prefix='',reverse=false,limit=1000}={}){let entries=[...this.map].filter(([k])=>k.startsWith(prefix)).sort(([a],[b])=>a.localeCompare(b));if(reverse)entries.reverse();return new Map(entries.slice(0,limit));}
 transaction(fn){const r=this.queue.then(()=>fn(this));this.queue=r.catch(()=>{});return r;}
}
const storage=new Storage();let state=new CmsState({storage});const req=(route,method='GET',data)=>new Request('https://cms.elderindex.co.uk'+route,{method,...(data?{headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})});
test('hosted drafts persist between object instances and concurrent saves reject stale revisions',async()=>{const initial=await(await state.fetch(req('/api/pages/website-design'))).json();assert.equal(initial.revision,0);const data=structuredClone(initial.data);data.content[0].props.heading1='A private cloud draft';const results=await Promise.all([state.fetch(req('/api/pages/website-design','PUT',{data,revision:0})),state.fetch(req('/api/pages/website-design','PUT',{data,revision:0}))]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);state=new CmsState({storage});assert.equal((await(await state.fetch(req('/api/pages/website-design'))).json()).data.content[0].props.heading1,'A private cloud draft');});
test('hosted previews never save or publish and are always noindex',async()=>{const r=await state.fetch(req('/api/previews','POST',{data:snapshot.initialData}));assert.equal(r.status,201);const url=(await r.json()).url,html=await(await state.fetch(req(url))).text();assert.match(html,/noindex, nofollow/);assert.equal((await(await state.fetch(req('/api/pages/website-design'))).json()).revision,1);assert.equal((await state.fetch(req('/api/publish','POST',{}))).status,501);});
test('hosted images persist as chunks, reject malformed uploads and export with the draft',async()=>{const data=await sharp({create:{width:1200,height:800,channels:3,background:'#452b52'}}).webp().toBuffer();assert.deepEqual(webpDimensions(data),{width:1200,height:800});const r=await state.fetch(new Request('https://cms.elderindex.co.uk/api/media',{method:'POST',headers:{'Content-Type':'image/webp'},body:data}));assert.equal(r.status,201);const asset=await r.json();state=new CmsState({storage});assert.deepEqual(new Uint8Array(await(await state.fetch(req(asset.src))).arrayBuffer()),new Uint8Array(data));assert.throws(()=>webpDimensions(new TextEncoder().encode('<svg onload="alert(1)"/>')));assert.equal((await state.fetch(req('/api/backup'))).headers.get('Content-Type'),'application/zip');});
test('the public Worker refuses missing Access auth even for static assets',async()=>{let assetsRead=false;const r=await worker.fetch(new Request('https://cms.elderindex.co.uk/assets/test.js'),{ASSETS:{fetch:()=>{assetsRead=true;return new Response('unsafe')}},PUBLIC_ORIGIN:'https://cms.elderindex.co.uk'});assert.equal(r.status,403);assert.equal(assetsRead,false);assert.equal(r.headers.get('Cache-Control'),'private, no-store');});
