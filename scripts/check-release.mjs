import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {validateProvenance} from './lib/release-provenance.mjs';
import {pages,baseUrl} from '../src/data.mjs';
import {config} from '../src/config.mjs';
const args=process.argv.slice(2);
const draft=args.includes('--draft');if(draft)args.splice(args.indexOf('--draft'),1);
const distIndex=args.indexOf('--dist');let dist='dist';if(distIndex>=0){dist=args[distIndex+1];if(!dist||dist.startsWith('--'))throw Error('--dist requires a directory');args.splice(distIndex,2);}
if(args.length>1)throw Error('Usage: check-release.mjs [--draft] [--dist directory] [manifest.json]');
const read=p=>fs.readFileSync(path.join(dist,p),'utf8');
const header=read('_headers');
const release=JSON.parse(read('release.json'));
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const provenance=validateProvenance(release,{checkoutSha:git('rev-parse','HEAD'),workingTreeDirty:Boolean(git('status','--porcelain','--untracked-files=no')),expectedSha:process.env.EXPECTED_RELEASE_SHA||git('rev-parse','HEAD'),mode:draft?'draft':'strict'});
const ciIdentity={event:process.env.GITHUB_EVENT_NAME||'local',checkedOutSha:provenance.checkoutSha,expectedWorkflowSha:provenance.expectedSha,pullRequestHeadSha:process.env.PR_HEAD_SHA||null};
assert.equal(release.environment,config.production?'production':'staging');
assert.equal(release.canonicalOrigin,baseUrl);
assert.equal(header.includes('X-Robots-Tag: noindex'),!config.production,'Global indexability header');
const routes=pages.map(p=>{
 const html=read(path.join(p.path,'index.html'));
 assert.doesNotMatch(html,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}/,p.path+' credential pattern');
 assert.doesNotMatch(html,/<script[^>]+src="https?:\/\//,p.path+' unapproved remote script');
 const robots=html.match(/<meta name="robots" content="([^"]+)"/)[1];
 assert.equal(robots,config.production&&p.kind!=='legal'?'index, follow':'noindex, follow',p.path);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 const ids=graph.map(x=>x['@id']);assert.equal(ids.length,new Set(ids).size,p.path+' entity IDs');
 const walk=n=>{if(!n||typeof n!=='object')return;if(n['@id']&&Object.keys(n).length===1)assert.ok(ids.includes(n['@id']),p.path+' unresolved entity '+n['@id']);for(const v of Object.values(n))if(typeof v==='object')Array.isArray(v)?v.forEach(walk):walk(v);};graph.forEach(walk);
 return {path:p.path,kind:p.kind,canonical:baseUrl+p.path,robots,title:p.title,h1:p.headline||'template heading'};
});
const rules=read('_redirects').trim().split('\n').map(x=>x.split(/\s+/));
assert.equal(new Set(rules.map(r=>r[0])).size,rules.length,'Duplicate redirect source');
for(const [from,to,status]of rules){assert.equal(status,'301');assert.ok(!from.startsWith('/assets/'));assert.ok(!rules.some(r=>r[0]===to),'Redirect chain '+from);assert.ok(pages.some(p=>p.path===to),'Unknown target '+to);}
assert.ok(!/\/\*\s+\//.test(read('_redirects')),'No blanket homepage redirect');
const sitemap=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.deepEqual(sitemap,pages.filter(p=>p.kind!=='legal').map(p=>baseUrl+p.path));
for(const file of ['404.html','robots.txt','sitemap.xml','assets/site.js','assets/site.css'])assert.ok(read(file).length);
assert.ok(!fs.existsSync(path.join(dist,'cms'))&&!fs.existsSync(path.join(dist,'api')),'Private CMS must not enter public output');
const manifest={...release,provenance,ciIdentity,analyticsConfigured:Boolean(config.measurementId),pageCount:routes.length,routes,redirectRules:rules};
const output=args[0];if(output){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(manifest,null,2)+'\n');}
console.log(`${manifest.environment}: ${draft?'DRAFT checks passed (not release verified)':'strict release invariants passed'}; ${routes.length} pages, ${rules.length} redirects; analytics ${manifest.analyticsConfigured?'configured':'OFF'}.`);
