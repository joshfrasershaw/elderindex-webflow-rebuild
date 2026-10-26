// Cloudflare Access JWT validation. Never trust the email header by itself.
const keyCache=new Map();
const decode=part=>Uint8Array.from(atob(part.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const parse=part=>JSON.parse(new TextDecoder().decode(decode(part)));
export async function authenticate(request,env,{fetcher=fetch,now=Date.now()}={}){
 const origin=env.PUBLIC_ORIGIN,issuer=env.ACCESS_ISSUER,audience=env.ACCESS_AUD;
 if(!origin||!/^https:\/\/[^/]+$/.test(origin)||!issuer||!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer)||!audience)throw new Error('Access configuration incomplete');
 const allowed=String(env.ALLOWED_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);if(!allowed.length)throw new Error('No authorised accounts configured');
 if(new URL(request.url).origin!==origin)throw new Error('Unexpected CMS hostname');
 const raw=request.headers.get('Cf-Access-Jwt-Assertion');if(!raw||raw.length>20000)throw new Error('Access login required');
 const pieces=raw.split('.');if(pieces.length!==3)throw new Error('Invalid Access token');const header=parse(pieces[0]),claims=parse(pieces[1]),seconds=now/1000;
 if(header.alg!=='RS256'||typeof header.kid!=='string')throw new Error('Invalid Access signing algorithm');
 if(claims.iss!==issuer||!(Array.isArray(claims.aud)?claims.aud:[claims.aud]).includes(audience)||!Number.isFinite(claims.exp)||claims.exp<=seconds||!Number.isFinite(claims.iat)||claims.iat>seconds+30||claims.nbf!==undefined&&(!Number.isFinite(claims.nbf)||claims.nbf>seconds+30)||typeof claims.sub!=='string'||!claims.sub||!allowed.includes(String(claims.email||'').toLowerCase()))throw new Error('Access account or application not authorised');
 let cached=keyCache.get(issuer);if(!cached||cached.expires<now||!cached.keys.some(k=>k.kid===header.kid)){
  const response=await fetcher(issuer+'/cdn-cgi/access/certs',{redirect:'error',signal:AbortSignal.timeout(5000)});if(!response.ok)throw new Error('Cannot verify Access signing keys');const data=await response.json();if(!Array.isArray(data.keys)||data.keys.length>20)throw new Error('Invalid Access signing keys');cached={keys:data.keys,expires:now+300000};keyCache.set(issuer,cached);
 }
 const jwk=cached.keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)throw new Error('Unknown Access signing key');const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(pieces[2]),new TextEncoder().encode(pieces[0]+'.'+pieces[1])))throw new Error('Invalid Access signature');
 // Token-bound nonce: the signed session token is inaccessible to other origins.
 const csrf=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 return {email:claims.email.toLowerCase(),csrf};
}
export function secure(response){const r=new Response(response.body,response);r.headers.set('Cache-Control','private, no-store');r.headers.set('X-Robots-Tag','noindex, nofollow');r.headers.set('X-Content-Type-Options','nosniff');r.headers.set('X-Frame-Options','SAMEORIGIN');r.headers.set('Referrer-Policy','same-origin');return r;}
