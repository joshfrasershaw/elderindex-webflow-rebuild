import fs from 'node:fs';
export const imagery=JSON.parse(fs.readFileSync(new URL('./imagery.json',import.meta.url),'utf8'));
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function image(page,slot,{sizes='(max-width: 600px) 100vw, 50vw',eager=false,decorative=false,priority=false}={}){
  const key=page+'::'+slot,photo=imagery[key];
  if(!photo?.variants?.length)throw new Error('Missing prepared photograph: '+key);
  const fallback=photo.variants.find(v=>v.width===960)||photo.variants.at(-1);
  return `<img class="site-image" data-photo-key="${escape(key)}" data-photo-id="${photo.sourceId}" src="${fallback.src}" srcset="${photo.variants.map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="${escape(sizes)}" width="${fallback.width}" height="${fallback.height}" alt="${decorative?'':escape(photo.alt)}" loading="${eager?'eager':'lazy'}" decoding="async"${priority?' fetchpriority="high"':''} style="object-position:${photo.position}">`;
}
export const photo=(page,slot,className,options={})=>`<div class="image-frame ${className}">${image(page,slot,options)}</div>`;

// Original graphics supplied by the owner via GitHub. Preserve the source files.
export const heroConcepts={
  homepage:{src:'/assets/3129.png',width:512,height:341,alt:'Illustrative Riverside House care-home website displayed on a laptop and phone.'},
  'website-design':{src:'/assets/3127.jpg',width:512,height:342,alt:'Illustrative The Oaklands care-home website displayed on a laptop and phone.'}
};
export function conceptImage(key){
  const asset=heroConcepts[key];
  if(!asset)throw new Error('Unknown hero concept '+key);
  return `<img class="uploaded-concept${asset.src.endsWith('.jpg')?' uploaded-concept-jpeg':''}" data-concept-id="${key}" src="${asset.src}" width="${asset.width}" height="${asset.height}" alt="${escape(asset.alt)}" loading="eager" decoding="async" fetchpriority="high">`;
}
