// Local Cloudflare runtime smoke test. No deployment or account login occurs.
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {strict as assert} from 'node:assert';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {browserAsset,browserSmoke} from './browser-smoke.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),bundle=path.join(here,'.generated/runtime-bundle'),cms=path.dirname(here);
execFileSync(process.execPath,[path.join(cms,'node_modules/wrangler/bin/wrangler.js'),'deploy','--config',path.join(here,'wrangler.jsonc'),'--dry-run','--outdir',bundle],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
// Fresh test-only signing keys and issuer; never valid against production Access.
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'runtime-fixture-key'},issuer='https://test-cms-runtime.cloudflareaccess.com',now=Math.floor(Date.now()/1000);
const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const unsigned=encode({alg:'RS256',kid:jwk.kid})+'.'+encode({iss:issuer,aud:['runtime-fixture-audience'],sub:'runtime-owner',email:'josh@elderindex.co.uk',iat:now-10,exp:now+600});
const jwt=unsigned+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(unsigned))).toString('base64url');
const mf=new Miniflare(convertV4MiniflareOptions({workers:[{name:'cms',modules:true,modulesRoot:bundle,rootPath:bundle,scriptPath:path.join(bundle,'worker.js'),compatibilityDate:'2026-10-26',compatibilityFlags:['nodejs_compat'],durableObjects:{CMS_STATE:{className:'CmsState',useSQLite:true}},bindings:{PUBLIC_ORIGIN:'https://cms.elderindex.co.uk',ACCESS_ISSUER:issuer,ACCESS_AUD:'runtime-fixture-audience',ALLOWED_EMAILS:'josh@elderindex.co.uk'},serviceBindings:{ASSETS:browserAsset},outboundService:async request=>request.url===issuer+'/cdn-cgi/access/certs'?Response.json({keys:[jwk]}):new Response('Test network route unavailable',{status:404})}]}));
try{
 const denied=await mf.dispatchFetch('https://cms.elderindex.co.uk/assets/test.js');assert.equal(denied.status,403);assert.equal((await denied.json()).code,'ACCESS_TOKEN_MISSING');
 for(const headers of [{'Cf-Access-Jwt-Assertion':jwt},{Cookie:'CF_Authorization='+jwt}]){const authenticated=await mf.dispatchFetch('https://cms.elderindex.co.uk/api/bootstrap',{headers});assert.equal(authenticated.status,200);const boot=await authenticated.json();assert.equal(boot.email,'josh@elderindex.co.uk');assert.equal(boot.pages.length,22);assert.equal(boot.pages.filter(p=>p.editable).length,1);assert.ok(boot.templates.Hero);}
 const forbidden=await mf.dispatchFetch('https://cms.elderindex.co.uk/api/previews',{method:'POST',headers:{Cookie:'CF_Authorization='+jwt},body:'{}'});assert.equal(forbidden.status,403);

 const ns=await mf.getDurableObjectNamespace('CMS_STATE','cms'),object=ns.get(ns.idFromName('elderindex'));
 const before=await(await object.fetch('https://cms.elderindex.co.uk/api/pages/website-design')).json();assert.equal(before.revision,0);
 const saved=await object.fetch('https://cms.elderindex.co.uk/api/pages/website-design',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:before.data,revision:0})});assert.equal(saved.status,200);
 const after=await(await object.fetch('https://cms.elderindex.co.uk/api/pages/website-design')).json();assert.equal(after.revision,1);
 const preview=await object.fetch('https://cms.elderindex.co.uk/preview/saved');assert.equal(preview.status,200);assert.match(await preview.text(),/noindex, nofollow/);
 if(process.argv.includes('--browser'))await browserSmoke(mf,jwt);
 console.log('Cloudflare runtime passed: missing auth denied; signed assertion and cookie verified; CSRF enforced; SQLite draft saved/reloaded; HTML preview rendered.');
}finally{await mf.dispose();}
