import test from 'node:test';
import assert from 'node:assert/strict';
import {authenticate} from '../hosted/auth.mjs';
const env={PUBLIC_ORIGIN:'https://cms.elderindex.co.uk',ACCESS_ISSUER:'https://blue-hill-f7a1.cloudflareaccess.com',ACCESS_AUD:'test-audience',ALLOWED_EMAILS:'josh@elderindex.co.uk'},now=Date.now();
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']),jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'test-key'};
const b64=value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value)).toString('base64url');
async function token(extra={},header={}){const h=b64({alg:'RS256',kid:'test-key',...header}),p=b64({iss:env.ACCESS_ISSUER,aud:['test-audience'],sub:'owner',email:'josh@elderindex.co.uk',iat:Math.floor(now/1000)-10,exp:Math.floor(now/1000)+600,...extra});return h+'.'+p+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(h+'.'+p))).toString('base64url');}
const request=t=>new Request(env.PUBLIC_ORIGIN+'/api/bootstrap',{headers:{'Cf-Access-Jwt-Assertion':t}}),options={now,fetcher:async()=>Response.json({keys:[jwk]})};
test('hosted auth verifies the signature, account, application and token-bound nonce',async()=>{const t=await token(),identity=await authenticate(request(t),env,options);assert.equal(identity.email,'josh@elderindex.co.uk');assert.match(identity.csrf,/^[a-f0-9]{64}$/);assert.equal((await authenticate(request(t),env,options)).csrf,identity.csrf);});
test('hosted auth fails closed for absent configuration, forged tokens, other accounts and expired sessions',async()=>{
 for(const extra of [{aud:['another-app']},{iss:'https://other.cloudflareaccess.com'},{email:'other@example.com'},{exp:Math.floor(now/1000)-1},{iat:Math.floor(now/1000)+300},{nbf:'not-a-number'}])await assert.rejects(authenticate(request(await token(extra)),env,options));
 await assert.rejects(authenticate(request(await token({}, {alg:'none'})),env,options));const t=await token();await assert.rejects(authenticate(request(t.slice(0,-8)+'AAAAAAAA'),env,options));await assert.rejects(authenticate(request(t),{...env,ACCESS_AUD:''},options));await assert.rejects(authenticate(new Request(env.PUBLIC_ORIGIN),env,options));
});
