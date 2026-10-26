// Verify every Access JWT; forwarded identity headers alone are never trusted.
const keyCache=new Map();
class AccessError extends Error{constructor(code,message){super(message);this.code=code;}}
const deny=(code,message)=>{throw new AccessError(code,message);};
export function accessDiagnostic(error){return error instanceof AccessError?{code:error.code,error:error.message}:{code:'ACCESS_CHECK_FAILED',error:'The Access session could not be verified. Sign in again; if this persists, share this diagnostic code.'};}
const decode=part=>{const normalized=part.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(normalized.padEnd(Math.ceil(normalized.length/4)*4,'=')),c=>c.charCodeAt(0));};
const parse=part=>JSON.parse(new TextDecoder().decode(decode(part)));
function sessionToken(request){
 const assertion=request.headers.get('Cf-Access-Jwt-Assertion');if(assertion)return assertion.trim();
 // Access also issues this HttpOnly cookie. Treat it as untrusted until its
 // signature, issuer, audience, expiry and owner identity all verify below.
 for(const item of (request.headers.get('Cookie')||'').split(';')){const equal=item.indexOf('=');if(equal!==-1&&item.slice(0,equal).trim()==='CF_Authorization'){try{return decodeURIComponent(item.slice(equal+1).trim());}catch{deny('ACCESS_TOKEN_INVALID','The Access session is malformed. Sign in again.');}}}
 return null;
}
export async function authenticate(request,env,{fetcher=fetch,now=Date.now()}={}){
 const origin=env.PUBLIC_ORIGIN,issuer=env.ACCESS_ISSUER,audience=env.ACCESS_AUD;
 if(!origin||!/^https:\/\/[^/]+$/.test(origin)||!issuer||!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer)||!audience)deny('ACCESS_CONFIG_MISSING','The CMS Access configuration is incomplete.');
 const allowed=String(env.ALLOWED_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);if(!allowed.length)deny('ACCESS_CONFIG_MISSING','The CMS authorised accounts are not configured.');
 if(new URL(request.url).origin!==origin)deny('ACCESS_HOST_MISMATCH','Open the configured CMS address to sign in.');
 const raw=sessionToken(request);if(!raw)deny('ACCESS_TOKEN_MISSING','No Access session reached the CMS. Open the CMS address and sign in through Cloudflare Access.');
 if(raw.length>20000)deny('ACCESS_TOKEN_INVALID','The Access session is malformed. Sign in again.');
 const pieces=raw.split('.');if(pieces.length!==3||pieces.some(p=>!p||!/^[A-Za-z0-9_-]+$/.test(p)))deny('ACCESS_TOKEN_INVALID','The Access session is malformed. Sign in again.');
 let header,claims;try{header=parse(pieces[0]);claims=parse(pieces[1]);}catch{deny('ACCESS_TOKEN_INVALID','The Access session is malformed. Sign in again.');}
 if(!header||header.alg!=='RS256'||typeof header.kid!=='string')deny('ACCESS_ALGORITHM_INVALID','The Access session uses an unsupported signing method.');
 if(!claims||claims.iss!==issuer)deny('ACCESS_ISSUER_MISMATCH','The Access login team does not match the CMS configuration.');
 if(!(Array.isArray(claims.aud)?claims.aud:[claims.aud]).includes(audience))deny('ACCESS_AUDIENCE_MISMATCH','The Access application identifier does not match the CMS configuration.');
 const seconds=now/1000;
 if(!Number.isFinite(claims.exp)||claims.exp<=seconds)deny('ACCESS_SESSION_EXPIRED','The Access session has expired. Sign in again.');
 if(!Number.isFinite(claims.iat)||claims.iat>seconds+30||claims.nbf!==undefined&&(!Number.isFinite(claims.nbf)||claims.nbf>seconds+30))deny('ACCESS_SESSION_TIME_INVALID','The Access session is not yet valid. Sign in again.');
 if(typeof claims.sub!=='string'||!claims.sub)deny('ACCESS_IDENTITY_MISSING','An individual user login is required.');
 let cached=keyCache.get(issuer);if(!cached||cached.expires<now||!cached.keys.some(k=>k.kid===header.kid)){
  let data;try{const response=await fetcher(issuer+'/cdn-cgi/access/certs',{redirect:'manual',signal:AbortSignal.timeout(5000)});if(!response.ok)throw new Error('Keys unavailable');data=await response.json();}catch{deny('ACCESS_KEYS_UNAVAILABLE','The CMS could not retrieve Cloudflare Access signing keys. Try again shortly.');}
  if(!Array.isArray(data?.keys)||data.keys.length>20)deny('ACCESS_KEYS_INVALID','Cloudflare Access signing keys could not be verified.');cached={keys:data.keys,expires:now+300000};keyCache.set(issuer,cached);
 }
 const jwk=cached.keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)deny('ACCESS_KEY_NOT_FOUND','The Access signing key was not found. Sign in again.');
 let verified=false;try{const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);verified=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(pieces[2]),new TextEncoder().encode(pieces[0]+'.'+pieces[1]));}catch{deny('ACCESS_SIGNATURE_INVALID','The Access session signature could not be verified.');}
 if(!verified)deny('ACCESS_SIGNATURE_INVALID','The Access session signature could not be verified.');
 if(typeof claims.email!=='string'||!allowed.includes(claims.email.toLowerCase()))deny('ACCESS_EMAIL_NOT_ALLOWED','Sign in with one of the two email addresses approved for this CMS.');
 const csrf=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 return {email:claims.email.toLowerCase(),csrf};
}
export function secure(response){const r=new Response(response.body,response);r.headers.set('Cache-Control','private, no-store');r.headers.set('X-Robots-Tag','noindex, nofollow');r.headers.set('X-Content-Type-Options','nosniff');r.headers.set('X-Frame-Options','SAMEORIGIN');r.headers.set('Referrer-Policy','same-origin');return r;}
