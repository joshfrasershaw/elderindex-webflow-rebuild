// Exercise the real checker on isolated artefact copies; never mutate dist/ or source.
import {test} from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import{execFileSync,spawnSync}from'node:child_process';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'elderindex-release-negative-'));
try {
 fs.cpSync('dist',root,{recursive:true});const file=path.join(root,'release.json');const original=fs.readFileSync(file,'utf8');
 const run=(patch,args=[])=>{fs.writeFileSync(file,JSON.stringify({...JSON.parse(original),...patch}));return spawnSync(process.execPath,['scripts/check-release.mjs','--dist',root,...args],{encoding:'utf8',env:{...process.env,EXPECTED_RELEASE_SHA:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()}});};
 test('real CLI accepts a clean artefact at the exact revision',()=>{const r=run({});assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/strict release invariants passed/);});
 test('real CLI rejects incorrect SHA',()=>{const r=run({sourceSha:'0'.repeat(40)});assert.notEqual(r.status,0);assert.match(r.stderr,/Build source SHA differs/);});
 test('real CLI rejects dirty build',()=>{const r=run({trackedChanges:true});assert.notEqual(r.status,0);assert.match(r.stderr,/Build was made with dirty/);});
 test.after(()=>fs.rmSync(root,{recursive:true,force:true}));
} catch(e){fs.rmSync(root,{recursive:true,force:true});throw e;}
