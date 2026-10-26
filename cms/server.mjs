import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,randomUUID} from 'node:crypto';
import sharp from 'sharp';
import {zipSync} from 'fflate';
import {createServer as createViteServer} from 'vite';
import react from '@vitejs/plugin-react';
import {imagery,heroConcepts} from '../src/imagery.mjs';
import {pages} from '../src/data.mjs';
import {render} from '../src/template.mjs';
import {templates,shell,pageList,PAGE_ID,validateData,renderPreview,extraCss,themes,fonts,textColors} from './lib/model.mjs';
import {DraftStore,baseHash} from './lib/storage.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.dirname(here);
const port=Number(process.env.CMS_PORT||4321);if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid CMS_PORT');
const local=process.env.CMS_DATA_DIR?path.resolve(process.env.CMS_DATA_DIR):path.join(here,'.local');
const store=new DraftStore(path.join(local,'website-design')),token=randomBytes(32).toString('hex'),previews=new Map();
const allowedHosts=new Set(['127.0.0.1:'+port,'localhost:'+port]);
const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
async function body(req,max=2000000){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>max){const e=new Error('That file is too large. Use an image under 8 MB.');e.status=413;throw e;}chunks.push(chunk);}return Buffer.concat(chunks);}
async function readJson(req){try{return JSON.parse((await body(req)).toString());}catch(e){if(e.status)throw e;throw new Error('Could not read the request data');}}
const mediaFolder=path.join(local,'media');
async function uploaded(){try{return JSON.parse(await fs.readFile(path.join(mediaFolder,'index.json'),'utf8'));}catch(e){if(e.code==='ENOENT')return[];throw e;}}
const library=()=>[...Object.values(imagery).map(p=>({src:p.variants.find(v=>v.width===960)?.src||p.variants[0].src,alt:p.alt,variants:p.variants,name:p.alt,existing:true})),...Object.entries(heroConcepts).map(([key,p])=>({src:p.src,alt:p.alt,name:key==='homepage'?'Riverside House concept':'The Oaklands concept',existing:true})),{src:'/assets/3128.png',alt:'Illustrative Hawthorn Hall website displayed on a laptop and phone.',name:'Hawthorn Hall concept',existing:true}];
let uploadQueue=Promise.resolve();
async function upload(req){
  if(!['image/png','image/jpeg','image/webp'].includes(req.headers['content-type']))throw new Error('Choose a PNG, JPEG or WebP image. SVG and other active formats are not accepted.');
  const data=await body(req,8*1024*1024);const image=sharp(data,{limitInputPixels:30000000,animated:false}).rotate();const meta=await image.metadata();
  if(!['jpeg','png','webp'].includes(meta.format))throw new Error('The file is not a supported image');
  const id=randomUUID(),variants=[];await fs.mkdir(mediaFolder,{recursive:true});
  const current=await uploaded();if(current.length>=100)throw new Error('The prototype media limit is 100 uploads. Back up unused files before adding more.');
  const width=meta.autoOrient?.width||meta.width;
  for(const size of [...new Set([Math.min(480,width),Math.min(960,width),Math.min(1440,width)])]){
    const file=id+'-'+size+'.webp';const result=await image.clone().resize({width:size,withoutEnlargement:true}).webp({quality:85}).toFile(path.join(mediaFolder,file));variants.push({src:'/cms-media/'+file,width:result.width,height:result.height});
  }
  const record={id,name:'Uploaded image '+(current.length+1),src:(variants.find(v=>v.width===960)||variants.at(-1)).src,alt:'',variants,uploadedAt:new Date().toISOString(),existing:false};
  const temporary=path.join(mediaFolder,'index-'+id+'.tmp');await fs.writeFile(temporary,JSON.stringify([...current,record],null,2));await fs.rename(temporary,path.join(mediaFolder,'index.json'));return record;
}
const mime={'.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.md':'text/plain','.txt':'text/plain'};
async function file(res,base,relative){
  const target=path.resolve(base,relative);if(!target.startsWith(path.resolve(base)+path.sep))throw new Error('Invalid asset path');
  try{const bytes=await fs.readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(bytes);}catch(e){if(e.code==='ENOENT'){res.writeHead(404);res.end('Asset not found');}else throw e;}
}
async function api(req,res,url){
  if(!url.pathname.startsWith('/api/'))return false;
  if(req.method!=='GET'){
    const origin=req.headers.origin;
    if(!origin||!allowedHosts.has(new URL(origin).host)||!['http:'].includes(new URL(origin).protocol)||req.headers['x-cms-csrf']!==token){json(res,403,{error:'The local request could not be verified. Reload the editor.'});return true;}
  }
  if(url.pathname==='/api/bootstrap'&&req.method==='GET'){json(res,200,{csrf:token,pages:pageList,templates,shell,extraCss,themes,fonts,textColors,baseHash,mode:'local-only',pageId:PAGE_ID});return true;}
  if(url.pathname==='/api/pages/website-design'&&req.method==='GET'){json(res,200,await store.read());return true;}
  if(url.pathname==='/api/pages/website-design'&&req.method==='PUT'){const input=await readJson(req);json(res,200,await store.save(input.data,input.revision));return true;}
  if(url.pathname==='/api/history'&&req.method==='GET'){json(res,200,await store.history());return true;}
  if(url.pathname==='/api/restore'&&req.method==='POST'){const input=await readJson(req);json(res,200,await store.restore(input.version,input.revision));return true;}
  if(url.pathname==='/api/previews'&&req.method==='POST'){
    const input=await readJson(req);validateData(input.data);const id=randomUUID();previews.set(id,{data:input.data,expires:Date.now()+3600000});for(const[key,v]of previews)if(v.expires<Date.now())previews.delete(key);if(previews.size>40)previews.delete(previews.keys().next().value);json(res,201,{url:'/preview/'+id});return true;
  }
  if(url.pathname==='/api/media'&&req.method==='GET'){json(res,200,[...await uploaded(),...library()]);return true;}
  if(url.pathname==='/api/media'&&req.method==='POST'){const operation=uploadQueue.then(()=>upload(req));uploadQueue=operation.catch(()=>{});json(res,201,await operation);return true;}
  if(url.pathname==='/api/backup'&&req.method==='GET'){
    const files={'website-design/draft.json':Buffer.from(JSON.stringify(await store.read(),null,2))};
    try{for(const name of await fs.readdir(mediaFolder))if(/^[\w-]+\.webp$/.test(name)||name==='index.json')files['media/'+name]=new Uint8Array(await fs.readFile(path.join(mediaFolder,name)));}catch(e){if(e.code!=='ENOENT')throw e;}
    const zip=zipSync(files,{level:0});res.writeHead(200,{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="elderindex-cms-backup.zip"','Cache-Control':'no-store'});res.end(zip);return true;
  }
  if(url.pathname==='/api/publish'){json(res,501,{error:'Publishing is not connected in this local prototype. Saving a draft does not update GitHub or the public website.'});return true;}
  json(res,404,{error:'This prototype supports editing the Website Design page only.'});return true;
}
let vite;
const server=http.createServer(async(req,res)=>{
  try{
    if(!allowedHosts.has(req.headers.host)){res.writeHead(403);res.end('This editor accepts local connections only.');return;}
    const url=new URL(req.url,'http://'+req.headers.host);res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','SAMEORIGIN');
    if(await api(req,res,url))return;
    if(url.pathname.startsWith('/assets/')){
      if(url.pathname==='/assets/site.css')return file(res,path.join(repo,'src'),'styles.css');
      if(url.pathname==='/assets/site.js')return file(res,path.join(repo,'src'),'client.js');
      return file(res,path.join(repo,'public/assets'),decodeURIComponent(url.pathname.slice(8)));
    }
    if(url.pathname.startsWith('/cms-media/'))return file(res,mediaFolder,decodeURIComponent(url.pathname.slice(11)));
    if(url.pathname.startsWith('/preview/')){
      const id=url.pathname.slice(9);let data;
      if(id==='saved')data=(await store.read()).data;else{const draft=previews.get(id);if(!draft||draft.expires<Date.now()){res.writeHead(404);res.end('That preview expired. Create a new preview from the editor.');return;}data=draft.data;}
      res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});res.end(renderPreview(data));return;
    }
    if(url.pathname.startsWith('/public')){
      const route=url.pathname.slice(7)||'/';const page=pages.find(p=>p.path===route);if(!page){res.writeHead(404);res.end('Page not found');return;}
      const html=render(page);res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});res.end(html.replace('</head>','<script>document.addEventListener("submit",e=>{e.preventDefault();e.stopImmediatePropagation()},true);document.addEventListener("click",e=>{const a=e.target.closest("a");if(a&&a.getAttribute("href")?.startsWith("/")){e.preventDefault();location.href="/public"+a.getAttribute("href")}},true)</script></head>'));return;
    }
    vite.middlewares(req,res);
  }catch(e){console.error('CMS request failed:',e.message);if(!res.headersSent)json(res,e.status||400,{error:e.message});else res.end();}
});
vite=await createViteServer({configFile:false,root:here,plugins:[react()],appType:'spa',server:{middlewareMode:true,hmr:{server},allowedHosts:['localhost','127.0.0.1']},build:{outDir:'build'}});
server.listen(port,'127.0.0.1',()=>console.log('ElderIndex local CMS: http://127.0.0.1:'+port+' — local drafts only; no login or public publishing.'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,async()=>{await vite.close();server.close(()=>process.exit(0));});
