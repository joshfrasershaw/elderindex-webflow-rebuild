import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {load} from 'cheerio';
import {initialData,originalHtml,renderPreview,validateData,templates} from '../lib/model.mjs';
import {DraftStore} from '../lib/storage.mjs';
test('the imported existing page retains headings, text, links and SEO defaults',()=>{
  const before=load(originalHtml),after=load(renderPreview(structuredClone(initialData)));
  const text=$=>$('main').text().replace(/\s+/g,' ').trim();assert.equal(text(after),text(before));
  for(const selector of ['h1','h2','h3'])assert.deepEqual(after(selector).map((_,e)=>after(e).text()).get(),before(selector).map((_,e)=>before(e).text()).get());
  const links=$=>$('a').map((_,e)=>[$(e).attr('href')+'|'+$(e).text()]).get();assert.deepEqual(links(after).filter(x=>!x.startsWith('/edit/')),links(before));
  for(const selector of ['title','meta[name="description"]','link[rel="canonical"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]']){
    assert.equal(after(selector).attr('content')||after(selector).attr('href')||after(selector).text(),before(selector).attr('content')||before(selector).attr('href')||before(selector).text());
  }
  assert.deepEqual(JSON.parse(after('script[type="application/ld+json"]').text()),JSON.parse(before('script[type="application/ld+json"]').text()));
  assert.equal(initialData.content.length,7);assert.equal(after('meta[name="robots"]').attr('content'),'noindex, nofollow');
});
test('text edits are escaped and rich text keeps safe links while removing scripts',()=>{
  const data=structuredClone(initialData),hero=data.content[0],heading=templates.Hero.bindings.find(b=>b.kind==='heading').key,copy=templates.Hero.bindings.find(b=>b.kind==='rich').key;
  hero.props[heading]='A changed heading <script>alert(1)</script>';hero.props[copy]='<p>Useful <a href="/services/website-management/">website care</a><script>alert(1)</script><img src=x onerror=alert(1)></p>';
  validateData(data);const result=load(renderPreview(data));assert.equal(result('h1').text(),hero.props[heading]);assert.equal(result('main script').length,0);assert.equal(result('main [onerror]').length,0);assert.equal(result('main a[href="/services/website-management/"]').length>0,true);
});
test('validation rejects unsafe destinations, arbitrary styling, duplicate heroes and changed public paths',()=>{
  const data=structuredClone(initialData),link=templates.Hero.bindings.find(b=>b.kind==='link').key;
  data.content[0].props[link+'Href']='javascript:alert(1)';assert.throws(()=>validateData(data),/destination/);
  data.content[0].props[link+'Href']='/talk-to-us/';data.content[0].props.background='red;position:fixed';assert.throws(()=>validateData(data),/approved/);
  data.content[0].props.background='original';data.content.push({...structuredClone(data.content[0]),props:{...data.content[0].props,id:'another'}});assert.throws(()=>validateData(data),/original hero/);
  data.content.pop();data.root.props.path='/changed/';assert.throws(()=>validateData(data),/protected/);
});
test('drafts persist across instances, reject stale writes and restore as a new version',async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),'elderindex-cms-store-'));
  try{const store=new DraftStore(dir),one=await store.save(structuredClone(initialData),0);assert.equal(one.revision,1);await assert.rejects(()=>store.save(structuredClone(initialData),0),/another tab/);
    const fresh=new DraftStore(dir);assert.equal((await fresh.read()).revision,1);const changed=structuredClone(initialData);changed.root.props.title='A draft title';await fresh.save(changed,1);const restored=await fresh.restore(1,2);assert.equal(restored.revision,3);assert.equal(restored.data.root.props.title,initialData.root.props.title);assert.equal((await fresh.history()).length,3);
  }finally{await rm(dir,{recursive:true,force:true});}
});
