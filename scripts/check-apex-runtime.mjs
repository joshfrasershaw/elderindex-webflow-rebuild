// Compile and exercise the prepared apex Worker locally; never deploy or bind a host.
import fs from 'node:fs';import assert from 'node:assert/strict';import http from 'node:http';import{spawn}from'node:child_process';import{pages}from'../src/data.mjs';
const started=new Date().toISOString(),results=[];let logs='';
const child=spawn('node_modules/.bin/wrangler',['dev','--config','wrangler.apex-redirect.jsonc','--local','--ip','127.0.0.1','--port','4196'],{env:{...process.env,XDG_CONFIG_HOME:'/tmp/elderindex-wrangler-config',WRANGLER_SEND_METRICS:'false'},stdio:['ignore','pipe','pipe']});child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
const request=(path,host='elderindex.co.uk',method='GET')=>new Promise((resolve,reject)=>{const r=http.request({hostname:'127.0.0.1',port:4196,path,method,headers:{Host:host}},res=>{res.resume();res.on('end',()=>resolve({status:res.statusCode,location:res.headers.location||null}));});r.on('error',reject);r.end();});
try{
 let ready=false;for(let i=0;i<200;i++){if(child.exitCode!==null)throw Error(logs);try{await request('/');ready=true;break;}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,logs);
 const rules=fs.readFileSync('dist-production/_redirects','utf8').trim().split('\n').map(l=>l.split(/\s+/));
 for(const [from,to] of rules)for(const query of ['', '?utm_source=apex-runtime&value=a%20b']){const r=await request(from+query);assert.equal(r.status,301);assert.equal(r.location,'https://www.elderindex.co.uk'+to+query);results.push({path:from+query,...r});}
 for(const p of pages){const r=await request(p.path);assert.equal(r.status,301);assert.equal(r.location,'https://www.elderindex.co.uk'+p.path);results.push({path:p.path,...r});}
 for(const host of ['www.elderindex.co.uk','untrusted.invalid']){const r=await request('/',host);assert.equal(r.status,421);assert.equal(r.location,null);results.push({host,...r});}
 const post=await request('/','elderindex.co.uk','POST');assert.equal(post.status,405);results.push({method:'POST',...post});
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify({checkedAtUtc:started,scope:'LOCAL Cloudflare apex Worker, not deployed; real HTTP Host handling',results},null,2)+'\n');
 console.log(`Local apex Worker: ${results.length} HTTP checks passed; hostname/query safeguards and direct canonical destinations.`);
}finally{child.kill('SIGTERM');}
