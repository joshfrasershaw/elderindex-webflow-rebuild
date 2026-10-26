import {authenticate,secure,accessDiagnostic} from './auth.mjs';
import snapshot from './.generated/snapshot.json' with {type:'json'};
import {validateData,renderPreview} from './.generated/model.mjs';
import {zipSync} from 'fflate';
const json=(value,status=200)=>Response.json(value,{status});
const failure=(message,status=400)=>Object.assign(new Error(message),{status});
async function bytes(request,max){const reader=request.body?.getReader();if(!reader)return new Uint8Array();const chunks=[];let length=0;while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>max){await reader.cancel();throw failure('The request is too large.',413);}chunks.push(value);}const out=new Uint8Array(length);let offset=0;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.length;}return out;}
const input=async req=>JSON.parse(new TextDecoder().decode(await bytes(req,2000000)));
export function webpDimensions(b){
 if(b.length<30||new TextDecoder().decode(b.slice(0,4))!=='RIFF'||new TextDecoder().decode(b.slice(8,12))!=='WEBP'||new DataView(b.buffer,b.byteOffset).getUint32(4,true)+8!==b.length)throw failure('Choose a valid WebP image.');
 const kind=new TextDecoder().decode(b.slice(12,16));let width,height;
 if(kind==='VP8X'){if(b[20]&2)throw failure('Animated images are not supported.');width=1+b[24]+(b[25]<<8)+(b[26]<<16);height=1+b[27]+(b[28]<<8)+(b[29]<<16);}
 else if(kind==='VP8 '&&b[23]===0x9d&&b[24]===0x01&&b[25]===0x2a){width=(b[26]|b[27]<<8)&0x3fff;height=(b[28]|b[29]<<8)&0x3fff;}
 else if(kind==='VP8L'&&b[20]===0x2f){const n=new DataView(b.buffer,b.byteOffset).getUint32(21,true);width=(n&0x3fff)+1;height=((n>>>14)&0x3fff)+1;}
 if(!width||!height||width>1440||height>1440)throw failure('Upload a static image no larger than 1440 pixels on either edge.');return {width,height};
}
export default {async fetch(request,env){
 try{
  let identity;try{identity=await authenticate(request,env);}catch(error){const diagnostic=accessDiagnostic(error);console.warn('CMS Access rejected:',diagnostic.code);return secure(json(diagnostic,403));}
  const url=new URL(request.url);
  if(!['GET','HEAD'].includes(request.method)&&(request.headers.get('Origin')!==env.PUBLIC_ORIGIN||request.headers.get('X-CMS-CSRF')!==identity.csrf))return secure(json({error:'Reload the editor before saving; this request could not be verified.'},403));
  if(url.pathname==='/api/bootstrap'&&request.method==='GET')return secure(json({...snapshot,originalHtml:undefined,initialData:undefined,media:undefined,csrf:identity.csrf,mode:'hosted',pageId:'website-design',email:identity.email}));
  if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/preview/')||url.pathname.startsWith('/cms-media/')){
   const headers=new Headers(request.headers);headers.delete('Cf-Access-Jwt-Assertion');headers.delete('Cookie');headers.set('X-CMS-Editor',identity.email);
   const response=await env.CMS_STATE.get(env.CMS_STATE.idFromName('elderindex')).fetch(new Request(request,{headers}));return secure(response);
  }
  if(!['GET','HEAD'].includes(request.method))return secure(json({error:'Method not allowed'},405));
  // The Worker executes first for every asset, including JS, images and fallback URLs.
  let asset=await env.ASSETS.fetch(request);
  if(asset.status===404&&['/','/media','/settings','/edit/website-design'].includes(url.pathname))asset=await env.ASSETS.fetch(new Request(new URL('/index.html',url),request));
  return secure(asset);
 }catch(error){console.error('CMS hosted request failed',error.message);return secure(json({error:'The editor is temporarily unavailable. Your previous saved draft is retained.'},503));}
}};
export class CmsState{
 constructor(ctx,env){this.storage=ctx.storage;}
 seed(){return {schemaVersion:1,pageId:'website-design',baseHash:snapshot.baseHash,revision:0,savedAt:null,data:structuredClone(snapshot.initialData)};}
 async read(){const r=await this.storage.get('draft')||this.seed();if(r.baseHash!==snapshot.baseHash)throw failure('Website source changed. Download a backup before adapting this draft.',409);return r;}
 async save(data,revision){validateData(data);return this.storage.transaction(async tx=>{const current=await tx.get('draft')||this.seed();if(current.baseHash!==snapshot.baseHash)throw failure('Website source changed; adapt the draft before saving.',409);if(current.revision!==revision)throw failure('Another tab saved this draft. Reload before saving.',409);const r={...current,data,revision:revision+1,savedAt:new Date().toISOString()};await tx.put({'draft':r,['history:'+String(r.revision).padStart(10,'0')]:r});if(r.revision>30)await tx.delete('history:'+String(r.revision-30).padStart(10,'0'));return r;});}
 async media(){return await this.storage.get('media')||[];}
 async mediaBytes(asset){const out=new Uint8Array(asset.size);let offset=0;for(let n=0;n<asset.chunks;n++){const chunk=new Uint8Array(await this.storage.get('file:'+asset.id+':'+n));out.set(chunk,offset);offset+=chunk.length;}return out;}
 async fetch(request){
  try{
   const url=new URL(request.url),p=url.pathname,m=request.method;
   if(p==='/api/pages/website-design'&&m==='GET')return json(await this.read());
   if(p==='/api/pages/website-design'&&m==='PUT'){const d=await input(request);return json(await this.save(d.data,d.revision));}
   if(p==='/api/history'&&m==='GET'){const h=await this.storage.list({prefix:'history:',reverse:true,limit:30});return json([...h.values()].map(r=>({revision:r.revision,savedAt:r.savedAt})));}
   if(p==='/api/restore'&&m==='POST'){const d=await input(request);if(!Number.isInteger(d.version)||d.version<1)throw failure('Invalid version');const old=await this.storage.get('history:'+String(d.version).padStart(10,'0'));if(!old||old.baseHash!==snapshot.baseHash)throw failure('That version is unavailable.',404);return json(await this.save(old.data,d.revision));}
   if(p==='/api/previews'&&m==='POST'){const d=await input(request);validateData(d.data);const id=crypto.randomUUID();await this.storage.transaction(async tx=>{const all=await tx.list({prefix:'preview:'});for(const [key,item]of all)if(item.expires<Date.now())await tx.delete(key);if(all.size>=20)await tx.delete(all.keys().next().value);await tx.put('preview:'+id,{data:d.data,expires:Date.now()+3600000});});return json({url:'/preview/'+id},201);}
   if(p.startsWith('/preview/')&&m==='GET'){const id=p.slice(9);const r=id==='saved'?await this.read():await this.storage.get('preview:'+id);if(!r||r.expires&&r.expires<Date.now())throw failure('Preview expired. Open a new preview from the editor.',404);return new Response(renderPreview(r.data),{headers:{'Content-Type':'text/html; charset=utf-8'}});}
   if(p==='/api/media'&&m==='GET')return json([...await this.media(),...snapshot.media]);
   if(p==='/api/media'&&m==='POST'){
    if(request.headers.get('content-type')!=='image/webp')throw failure('The hosted editor accepts browser-processed WebP images.');const data=await bytes(request,2000000),dimensions=webpDimensions(data),id=crypto.randomUUID();
    const asset={id,name:'Uploaded image',src:'/cms-media/'+id+'.webp',alt:'',existing:false,uploadedAt:new Date().toISOString(),size:data.length,chunks:Math.ceil(data.length/64000),variants:[{src:'/cms-media/'+id+'.webp',...dimensions}]};
    await this.storage.transaction(async tx=>{const media=await tx.get('media')||[];if(media.length>=100||media.reduce((n,a)=>n+a.size,0)+data.length>20000000)throw failure('Hosted prototype media limit reached (100 images / 20 MB). Download a backup before adding more.',413);for(let n=0;n<asset.chunks;n++)await tx.put('file:'+id+':'+n,data.slice(n*64000,(n+1)*64000));await tx.put('media',[asset,...media]);});return json(asset,201);
   }
   if(p.startsWith('/cms-media/')&&m==='GET'){const asset=(await this.media()).find(a=>a.src===p);if(!asset)throw failure('Image not found',404);return new Response(await this.mediaBytes(asset),{headers:{'Content-Type':'image/webp'}});}
   if(p==='/api/backup'&&m==='GET'){
    const record=await this.storage.get('draft')||this.seed(),media=await this.media(),files={'website-design/draft.json':new TextEncoder().encode(JSON.stringify(record,null,2)),'media/index.json':new TextEncoder().encode(JSON.stringify(media,null,2))};for(const a of media)files['media/'+a.id+'.webp']=await this.mediaBytes(a);return new Response(zipSync(files,{level:0}),{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="elderindex-hosted-backup.zip"'}});
   }
   if(p==='/api/publish')return json({error:'Publishing is not connected. Saving a hosted draft does not update the public website.'},501);
   return json({error:'Not found'},404);
  }catch(e){return json({error:e.status?e.message:'The request could not be processed. No public content was changed.'},e.status||400);}
 }
}
