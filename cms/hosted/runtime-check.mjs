// Local Cloudflare runtime smoke test. No deployment or account login occurs.
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {strict as assert} from 'node:assert';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const here=path.dirname(fileURLToPath(import.meta.url)),bundle=path.join(here,'.generated/runtime-bundle'),cms=path.dirname(here);
execFileSync(process.execPath,[path.join(cms,'node_modules/wrangler/bin/wrangler.js'),'deploy','--config',path.join(here,'wrangler.jsonc'),'--dry-run','--outdir',bundle],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
const mf=new Miniflare(convertV4MiniflareOptions({workers:[{name:'cms',modules:true,modulesRoot:bundle,rootPath:bundle,scriptPath:path.join(bundle,'worker.js'),compatibilityDate:'2026-10-26',compatibilityFlags:['nodejs_compat'],durableObjects:{CMS_STATE:{className:'CmsState',useSQLite:true}},bindings:{PUBLIC_ORIGIN:'https://cms.elderindex.co.uk'}}]}));
try{
 const denied=await mf.dispatchFetch('https://cms.elderindex.co.uk/assets/test.js');assert.equal(denied.status,403);
 const ns=await mf.getDurableObjectNamespace('CMS_STATE','cms'),object=ns.get(ns.idFromName('elderindex'));
 const before=await(await object.fetch('https://cms.elderindex.co.uk/api/pages/website-design')).json();assert.equal(before.revision,0);
 const saved=await object.fetch('https://cms.elderindex.co.uk/api/pages/website-design',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:before.data,revision:0})});assert.equal(saved.status,200);
 const after=await(await object.fetch('https://cms.elderindex.co.uk/api/pages/website-design')).json();assert.equal(after.revision,1);
 const preview=await object.fetch('https://cms.elderindex.co.uk/preview/saved');assert.equal(preview.status,200);assert.match(await preview.text(),/noindex, nofollow/);
 console.log('Cloudflare runtime passed: unauthenticated assets denied; SQLite-backed draft saved/reloaded; HTML preview rendered.');
}finally{await mf.dispose();}
