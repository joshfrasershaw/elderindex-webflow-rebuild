import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {build} from 'vite';
import {templates,initialData,originalHtml,shell,pageList,extraCss,themes,fonts,textColors} from '../lib/model.mjs';
import {imagery,heroConcepts} from '../../src/imagery.mjs';
import {pages} from '../../src/data.mjs';
import {render} from '../../src/template.mjs';
const cms=fileURLToPath(new URL('../',import.meta.url)),generated=path.join(cms,'hosted/.generated');
await fs.mkdir(generated,{recursive:true});
const baseHash=createHash('sha256').update(originalHtml).digest('hex');
const media=[...Object.values(imagery).map(p=>({src:p.variants.find(v=>v.width===960)?.src||p.variants[0].src,alt:p.alt,variants:p.variants,name:p.alt,existing:true})),...Object.values(heroConcepts).map(p=>({src:p.src,alt:p.alt,name:p.alt,existing:true})),{src:'/assets/3128.png',alt:'Illustrative Hawthorn Hall website displayed on a laptop and phone.',name:'Hawthorn Hall concept',existing:true}];
const snapshot={templates,initialData,originalHtml,shell,pageList,extraCss,themes,fonts,textColors,baseHash,media};
await fs.writeFile(path.join(generated,'snapshot.json'),JSON.stringify(snapshot));
// Freeze the imported page at build time; the Worker never reads the Node filesystem.
let source=await fs.readFile(path.join(cms,'lib/model.mjs'),'utf8');source=source.replace("from 'cheerio'","from 'cheerio/slim'").replace(/import \{ pages \}[^\n]+\n/,'').replace(/import \{ render \}[^\n]+\n/,'');
const start=source.indexOf('const page=pages.find('),end=source.indexOf('export const bindingFor=');if(start<0||end<start)throw new Error('CMS source adapter changed; review hosted build');
source=source.slice(0,start)+"export const {templates,initialData,originalHtml,shell,pageList}=snapshot;\n"+source.slice(end);
source="import snapshot from './snapshot.json' with {type:'json'};\n"+source;
await fs.writeFile(path.join(generated,'model.mjs'),source);
await build({root:cms,configFile:path.join(cms,'vite.config.mjs')});
const assets=path.join(cms,'build/assets');await fs.cp(path.join(cms,'../public/assets'),assets,{recursive:true});await fs.copyFile(path.join(cms,'../src/styles.css'),path.join(assets,'site.css'));await fs.copyFile(path.join(cms,'../src/client.js'),path.join(assets,'site.js'));
for(const p of pages){let html=render(p).replace(/(<script id="site-config" type="application\/json">)[\s\S]*?(<\/script>)/,'$1{"measurementId":""}$2');html=html.replace('</head>','<meta name="robots" content="noindex, nofollow"><script>document.addEventListener("submit",e=>{e.preventDefault();e.stopImmediatePropagation()},true);document.addEventListener("click",e=>{const a=e.target.closest("a");if(a&&a.getAttribute("href")?.startsWith("/")){e.preventDefault();location.href="/public"+a.getAttribute("href")}},true)</script></head>');const dest=path.join(cms,'build/public',p.path,'index.html');await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,html);}
console.log('Hosted CMS assets and frozen server adapter prepared. Public dist/ was not modified.');
