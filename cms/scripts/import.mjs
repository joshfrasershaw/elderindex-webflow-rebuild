import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {initialData,originalHtml,validateData} from '../lib/model.mjs';
validateData(initialData);
await writeFile(new URL('../content/website-design.json',import.meta.url),JSON.stringify({schemaVersion:1,pageId:'website-design',baseHash:createHash('sha256').update(originalHtml).digest('hex'),data:initialData},null,2)+'\n');
console.log('Updated initial page snapshot only. Existing saved drafts were not modified. Review the JSON diff.');
