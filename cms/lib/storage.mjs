import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {originalHtml,validateData} from './model.mjs';
export const baseHash=createHash('sha256').update(originalHtml).digest('hex');
export class DraftStore{
  constructor(directory){this.directory=directory;this.queue=Promise.resolve();}
  async read(){
    try{const record=JSON.parse(await fs.readFile(path.join(this.directory,'draft.json'),'utf8'));if(record.baseHash!==baseHash)throw new Error('The website source changed. Export this draft before adapting it to the updated page.');validateData(record.data);return record;}
    catch(e){if(e.code!=='ENOENT')throw e;const seed=JSON.parse(await fs.readFile(new URL('../content/website-design.json',import.meta.url),'utf8'));if(seed.baseHash!==baseHash)throw new Error('The initial CMS snapshot needs adapting to the updated source page. Ask a developer to review and reimport it.');validateData(seed.data);return {schemaVersion:1,pageId:'website-design',baseHash,revision:0,savedAt:null,data:structuredClone(seed.data)};}
  }
  save(data,revision){
    const operation=this.queue.then(async()=>{
      validateData(data);const current=await this.read();
      if(revision!==current.revision){const e=new Error('This draft changed in another tab. Reload before saving so you do not overwrite those edits.');e.status=409;throw e;}
      await fs.mkdir(path.join(this.directory,'history'),{recursive:true});
      const record={schemaVersion:1,pageId:'website-design',baseHash,revision:current.revision+1,savedAt:new Date().toISOString(),data};
      // Write recoverable history first, then atomically replace the current draft.
      await fs.writeFile(path.join(this.directory,'history',record.revision+'.json'),JSON.stringify(record,null,2));
      const temporary=path.join(this.directory,'draft-'+randomUUID()+'.tmp');await fs.writeFile(temporary,JSON.stringify(record,null,2));await fs.rename(temporary,path.join(this.directory,'draft.json'));return record;
    });this.queue=operation.catch(()=>{});return operation;
  }
  async history(){try{const files=await fs.readdir(path.join(this.directory,'history'));return Promise.all(files.filter(n=>/^\d+\.json$/.test(n)).sort((a,b)=>parseInt(b)-parseInt(a)).slice(0,30).map(async file=>{const r=JSON.parse(await fs.readFile(path.join(this.directory,'history',file),'utf8'));return {revision:r.revision,savedAt:r.savedAt};}));}catch(e){if(e.code==='ENOENT')return[];throw e;}}
  async restore(version,revision){if(!Number.isInteger(version)||version<1)throw new Error('Invalid version');const old=JSON.parse(await fs.readFile(path.join(this.directory,'history',version+'.json'),'utf8'));if(old.baseHash!==baseHash)throw new Error('That version belongs to a different website source');return this.save(old.data,revision);}
}
