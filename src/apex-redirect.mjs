import {redirectRules} from './redirect-rules.mjs';
// Prepared only: no domain binding or route is created by this source file.
export function createApexRedirect(legacy){
 const targets=new Map(redirectRules(legacy).map(([from,to])=>[from,to]));
 return {
  fetch(request){
   const url=new URL(request.url);
   // Refuse an accidental www binding instead of creating a redirect loop.
   if(url.hostname!=='elderindex.co.uk')return new Response('Unexpected hostname',{status:421});
   if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
   const destination=new URL('https://www.elderindex.co.uk');
   destination.pathname=targets.get(url.pathname)||url.pathname;
   destination.search=url.search;
   return new Response(null,{status:301,headers:{Location:destination.href,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  }
 };
}
