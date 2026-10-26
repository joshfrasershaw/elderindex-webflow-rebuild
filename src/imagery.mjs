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
