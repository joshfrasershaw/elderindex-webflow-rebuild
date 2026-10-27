import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync}from'node:child_process';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
for(const file of ['AGENTS.md','docs/ops/decision-rights.md','docs/launch/release-gates.md','docs/ops/change-control.md','docs/launch/go-live-report.md'])assert.ok(fs.existsSync(file),'Missing '+file);
const report=fs.readFileSync('docs/launch/go-live-report.md','utf8');
for(let i=0;i<=10;i++)assert.match(report,new RegExp('\\| G'+String(i).padStart(2,'0')+'[^|]*\\| (PASS|FAIL|BLOCKED-EXTERNAL|NOT-RUN|WAIVED) \\|'),'Missing gate G'+i);
assert.match(report,/release SHA/i);assert.match(report,/rollback/i);
const workflow=fs.readFileSync('.github/workflows/quality.yml','utf8');assert.doesNotMatch(workflow,/secrets\.|wrangler deploy|git push|pull_request_target/,'Quality CI must not publish or use credentials');
const files=git('ls-files').split('\n');
for(const f of files){
 assert.ok(!/(^|\/)(node_modules|dist)\//.test(f),'Generated/dependency file tracked '+f);
 assert.ok(!/(^|\/)\.env($|\.)/.test(f),'Environment file tracked '+f);
 if(!/\.(m?js|json|html|css|ya?ml|md)$/.test(f)||!fs.existsSync(f))continue;
 const text=fs.readFileSync(f,'utf8');
 assert.doesNotMatch(text,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}/,'Credential pattern in '+f);
}
const base=process.env.CHANGE_BASE_SHA;
if(base&&/^[0-9a-f]{40}$/.test(base)&&!/^0+$/.test(base)){
 const changes=git('diff','--name-only',base,'HEAD').split('\n');
 if(changes.some(f=>/^(src\/|public\/|scripts\/|package|wrangler)/.test(f)))assert.ok(changes.some(f=>/^docs\/changes\/.+\.md$/.test(f)),'Material change needs a docs/changes record');
}
console.log('Policy structure, non-deploying CI, tracked-file hygiene and credential-pattern checks passed. Human approvals remain external.');
