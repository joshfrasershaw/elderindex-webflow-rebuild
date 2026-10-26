// Test-only bridge between a real browser, compiled UI and the local Worker.
// No production login token is used or exposed to the browser.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const build=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../build');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
export async function browserAsset(request){
 const pathname=decodeURIComponent(new URL(request.url).pathname),file=path.resolve(build,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
 if(!file.startsWith(build+path.sep))return new Response('Invalid asset path',{status:400});
 try{return new Response(await fs.readFile(file),{headers:{'Content-Type':types[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}
}
export async function browserSmoke(mf,jwt){
 const {chromium}=await import('playwright');const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(await fs.access('/usr/bin/chromium').then(()=>true,()=>false)?'/usr/bin/chromium':undefined)});
 let localOrigin;
 const server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(typeof v==='string'&&k!=='host')headers.set(k,v);headers.set('Cf-Access-Jwt-Assertion',jwt);if(headers.get('Origin')===localOrigin)headers.set('Origin','https://cms.elderindex.co.uk');const result=await mf.dispatchFetch('https://cms.elderindex.co.uk'+req.url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch(e){res.writeHead(500,{'Content-Type':'text/plain'});res.end('Local test bridge failed: '+e.message);}});
 const page=await browser.newPage({viewport:{width:1700,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));localOrigin='http://127.0.0.1:'+server.address().port;
  await page.goto(localOrigin);await page.getByRole('heading',{name:'Your website, in your hands.',exact:true}).waitFor({timeout:10000});assert.equal(await page.locator('.page-row').count(),22);assert.equal(await page.getByText('PRIVATE CMS',{exact:true}).count(),1);
  await page.getByRole('link',{name:'Edit page',exact:true}).click();const frame=page.frameLocator('iframe');await frame.locator('h1').waitFor();assert.equal(await frame.locator('h1').textContent(),'Website design for care homes and home care agencies.');
  await frame.locator('h1').click();await page.locator('input[name="heading1"]:visible').fill('Hosted browser smoke test');await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.getByRole('status').filter({hasText:'Draft saved'}).waitFor();await page.reload();await frame.locator('h1').getByText('Hosted browser smoke test',{exact:true}).waitFor();assert.deepEqual(errors,[]);
  console.log('Hosted browser passed: compiled dashboard renders 22 pages; real Worker API drives the editor; save/reload persists through SQLite.');
 }catch(e){await page.screenshot({path:'/tmp/elderindex-hosted-browser-failure.png'}).catch(()=>{});console.error('Hosted browser errors:',errors);throw e;}
 finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
