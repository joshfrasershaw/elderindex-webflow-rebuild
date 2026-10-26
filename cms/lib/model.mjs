import { load } from 'cheerio';
import { pages } from '../../src/data.mjs';
import { render } from '../../src/template.mjs';
import sanitizeHtml from 'sanitize-html';
import { parseDocument } from 'htmlparser2';

export const PAGE_ID='website-design';
export const PAGE_PATH='/services/website-design/';
export const themes={original:null,cream:'#fcf9f2',ivory:'#fffdfa',plum:'#321e3c',sage:'#eaf2e5',lilac:'#eee5f2'};
export const fonts={original:null,serif:'"DM Serif Display", Georgia, serif',sans:'"DM Sans", Arial, sans-serif'};
export const textColors={auto:null,plum:'#321e3c',muted:'#655a68',green:'#284b38',ivory:'#fffdfa',gold:'#f0c978'};
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeLink(value){
  if(typeof value!=='string'||value.length>2000||/[\x00-\x20\\]/.test(value))return false;
  return /^\/(?!\/)/.test(value)||/^#[A-Za-z0-9_-]+$/.test(value)||/^(https?:\/\/|mailto:|tel:)/i.test(value)&&!/^https?:\/\/[^/]*@/i.test(value);
}
export function safeImage(value){return typeof value==='string'&&/^\/(assets\/[A-Za-z0-9_./-]+|cms-media\/[A-Za-z0-9-]+\.webp)$/.test(value)&&!value.includes('..');}
export const cleanRich=value=>sanitizeHtml(String(value),{allowedTags:['p','strong','em','b','i','u','br','a','ul','ol','li'],allowedAttributes:{a:['href','title','rel']},allowedSchemes:['https','http','mailto','tel'],allowProtocolRelative:false,transformTags:{a:(tag,attrs)=>({tagName:tag,attribs:safeLink(attrs.href)?attrs:{}})}});
const styleDefaults={background:'original',textColor:'auto',headingFont:'original',bodyFont:'original',alignment:'original',layout:'original'};
function nodeTree(node){
  if(node.type==='text')return {text:node.data};
  if(node.type!=='tag')return null;
  return {tag:node.name,attrs:{...node.attribs},binding:node.attribs['data-cms-bind'],children:(node.children||[]).map(nodeTree).filter(Boolean)};
}
export function compileTemplate(type,label,html,{dark=false,layout=false}={}){
  const $=load(html,null,false),bindings=[],props={...styleDefaults};let index=0;
  // Protect form mechanics, regulatory notes and design-concept artwork from accidental structural edits.
  $('h1,h2,h3,p,summary,a,img').each((_,element)=>{
    const el=$(element),tag=element.tagName;
    if(el.closest('.section-ornament,form').length&&!el.is('form h2'))return;
    if(el.closest('.service-device-figure,.hero-concept-art').length&&tag!=='img')return;
    if(tag==='a'&&el.closest('p,li').length)return; // Rich text owns inline links.
    if(tag==='p'&&el.closest('li').length)return;
    if(['h1','h2','h3','summary'].includes(tag)){
      const key='heading'+(++index),plain=el.html().replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,'').trim();
      props[key]=plain;bindings.push({key,kind:'heading',tag,initial:plain,label:(tag==='h1'?'Main heading':tag==='summary'?'Question':'Heading')+': '+el.text().slice(0,44),inline:el.children().length===0});el.attr('data-cms-bind',key);
    }else if(tag==='p'){
      const key='copy'+(++index),value=$.html(el);props[key]=value;bindings.push({key,kind:'rich',initial:value,label:'Text: '+el.text().slice(0,48)});el.attr('data-cms-bind',key);
    }else if(tag==='a'){
      const key='button'+(++index);props[key+'Text']=el.clone().children('[aria-hidden]').remove().end().text().trim();props[key+'Href']=el.attr('href');bindings.push({key,kind:'link',initial:el.text(),label:'Button: '+props[key+'Text']});el.attr('data-cms-bind',key);
    }else if(tag==='img'){
      const key='image'+(++index);props[key]={src:el.attr('src'),alt:el.attr('alt')||''};bindings.push({key,kind:'image',initial:props[key],label:'Image'});el.attr('data-cms-bind',key);
    }
  });
  const tree=nodeTree(parseDocument($.html()).children.find(x=>x.type==='tag'));
  function removeMarkers(n){if(n.attrs)delete n.attrs['data-cms-bind'];n.children?.forEach(removeMarkers);}removeMarkers(tree);
  return {type,label,html,tree,bindings,defaults:props,dark,layout};
}
const page=pages.find(p=>p.path===PAGE_PATH);
export const originalHtml=render(page);
const $=load(originalHtml);
const names=[['Hero','Website design hero',{dark:true}],['Benefits','Care-provider benefits',{}],['ServiceContent','Service details and links',{}],['PhotoStory','Photo and care experience',{layout:true}],['CallToAction','Enquiry call to action',{dark:true}],['FAQs','Questions and answers',{}],['Contact','Contact and enquiry information',{}]];
export const templates={};
export const importedContent=$('main>section').toArray().map((el,i)=>{const [type,label,options]=names[i];const spec=compileTemplate(type,label,$.html(el),options);templates[type]=spec;return {type,props:{id:type+'-existing',...spec.defaults}};});
const newSections={
  Content:['Content section','<section class="section"><div class="wrap cms-reading"><h2>A useful heading</h2><p>Add helpful information about your services here.</p></div></section>',{}],
  TextImage:['Text and image','<section class="photo-interlude"><div class="wrap interlude-grid"><div class="image-frame interlude-photo"><img class="site-image" src="/assets/photos/18429308-960.webp" alt="Older adults and care staff talking around a table." width="960" height="640"></div><div class="interlude-copy"><h2>A useful introduction</h2><p>Explain the service and what someone should do next.</p><a class="text-link" href="/talk-to-us/">Talk to us</a></div></div></section>',{layout:true}],
  FeatureGrid:['Feature grid','<section class="outcomes"><div class="wrap"><h2>What matters to your visitors</h2><div class="outcomes-grid"><div class="outcome"><h3>Clarity</h3><p>Explain the care available.</p></div><div class="outcome"><h3>Confidence</h3><p>Use accurate, approved information.</p></div><div class="outcome"><h3>Contact</h3><p>Make the next step easy.</p></div><div class="outcome"><h3>Care</h3><p>Keep information current.</p></div></div></div></section>',{}],
  Gallery:['Image gallery','<section class="section"><div class="wrap"><h2>A closer look</h2><div class="cms-gallery"><img src="/assets/photos/8584020-960.webp" alt="A comfortable sitting room." width="960" height="640"><img src="/assets/photos/37441096-960.webp" alt="A cottage garden." width="960" height="640"></div></div></section>',{}]
};
for(const[type,[label,html,options]]of Object.entries(newSections))templates[type]=compileTemplate(type,label,html,options);
export const initialData={root:{props:{title:page.title,description:page.description,path:PAGE_PATH,canonical:$('link[rel="canonical"]').attr('href'),indexing:'noindex',ogTitle:page.title,ogDescription:page.description,ogImage:$('meta[property="og:image"]').attr('content')}},content:importedContent};
export const shell={header:$.html($('body>header')),breadcrumbs:$.html($('body>.breadcrumbs')),footer:$.html($('body>footer'))};
export const pageList=pages.map(p=>({id:p.path===PAGE_PATH?PAGE_ID:null,path:p.path,title:p.headline||p.title,editable:p.path===PAGE_PATH}));
export const bindingFor=(spec,key)=>spec.bindings.find(b=>b.key===key);
export function sectionAttributes(spec,props){
  const attrs={...spec.tree.attrs};
  const dark=props.background==='plum'||props.background==='original'&&spec.dark;
  const auto=dark?'#fffdfa':'#392a42';
  const color=props.textColor==='auto'?auto:textColors[props.textColor];
  const classes=['cms-section'];let style=attrs.style||'';
  if(props.background!=='original'){style+=';background:'+themes[props.background];classes.push('cms-custom-background','cms-custom-text');}
  if(props.textColor!=='auto')classes.push('cms-custom-text');
  style+=';--cms-color:'+color;
  if(props.headingFont!=='original'){style+=';--cms-heading-font:'+fonts[props.headingFont];classes.push('cms-custom-heading');}
  if(props.bodyFont!=='original'){style+=';--cms-body-font:'+fonts[props.bodyFont];classes.push('cms-custom-body');}
  if(props.alignment!=='original'){style+=';--cms-align:'+props.alignment;classes.push('cms-custom-alignment');}
  if(props.layout!=='original')classes.push('cms-'+props.layout);
  return {...attrs,class:(attrs.class||'')+' '+classes.join(' '),style};
}
const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
export function renderSection(block){
  const spec=templates[block.type],props=block.props;
  if(!spec)throw new Error('Unknown section');
  function renderNode(n,root=false){
    if(n.text!==undefined)return escape(n.text);
    const b=bindingFor(spec,n.binding);let attrs=root?sectionAttributes(spec,props):{...n.attrs};let content;
    if(b?.kind==='rich')return props[b.key]===b.initial?outerOriginal(n):cleanRich(props[b.key]);
    if(b?.kind==='heading'&&props[b.key]!==b.initial)content=String(props[b.key]).split('\n').map(escape).join('<br>');
    if(b?.kind==='link'){attrs.href=props[b.key+'Href'];content=escape(props[b.key+'Text'])+(n.children.some(c=>c.attrs?.['aria-hidden'])?' <span aria-hidden="true">↗</span>':'');}
    if(b?.kind==='image'&&JSON.stringify(props[b.key])!==JSON.stringify(b.initial)){attrs.src=props[b.key].src;attrs.alt=props[b.key].alt;if(props[b.key].src!==b.initial.src){delete attrs.srcset;delete attrs.sizes;delete attrs['data-photo-id'];delete attrs['data-photo-key'];attrs.class=(attrs.class||'').replace('uploaded-concept-jpeg','');if(props[b.key].variants)attrs.srcset=props[b.key].variants.map(v=>v.src+' '+v.width+'w').join(', ');}}
    const attributes=Object.entries(attrs).map(([k,v])=>' '+k+'="'+escape(v)+'"').join('');
    return '<'+n.tag+attributes+'>'+ (voids.has(n.tag)?'':(content??n.children.map(c=>renderNode(c)).join(''))+'</'+n.tag+'>');
  }
  function outerOriginal(n){const clone={...n,binding:undefined};return renderNode(clone);}
  return renderNode(spec.tree,true);
}
export const extraCss=`.cms-custom-text :is(h1,h2,h3,p,li,summary){color:var(--cms-color)!important}.cms-custom-text a:not(.pill){color:var(--cms-color)!important}.cms-custom-heading :is(h1,h2,h3){font-family:var(--cms-heading-font)!important}.cms-custom-body :is(p,li){font-family:var(--cms-body-font)!important}.cms-custom-alignment :is(h1,h2,h3,p){text-align:var(--cms-align)}.cms-image-right .interlude-grid>.image-frame{order:2}.cms-image-left .interlude-grid>.image-frame{order:0}.cms-reading{max-width:850px}.cms-gallery{display:grid;grid-template-columns:1fr 1fr;gap:24px}.cms-gallery img{width:100%;height:300px;object-fit:cover}@media(max-width:600px){.cms-gallery{grid-template-columns:1fr}.cms-image-right .interlude-grid>.image-frame{order:0}}`;
export function renderPreview(data){
  const doc=load(originalHtml),root=data.root.props;
  doc('title').text(root.title);doc('meta[name="description"]').attr('content',root.description);doc('link[rel="canonical"]').attr('href',root.canonical);
  for(const[key,value]of Object.entries({'og:title':root.ogTitle,'og:description':root.ogDescription,'og:image':root.ogImage}))doc('meta[property="'+key+'"]').attr('content',value);
  doc('meta[name="robots"]').attr('content','noindex, nofollow');doc('main').html(data.content.map(renderSection).join(''));
  doc('#site-config').text('{"measurementId":""}');
  doc('meta[name="twitter:title"]').attr('content',root.ogTitle);doc('meta[name="twitter:description"]').attr('content',root.ogDescription);doc('meta[name="twitter:image"]').attr('content',root.ogImage);
  const schema=JSON.parse(doc('script[type="application/ld+json"]').text());
  const hero=data.content.find(b=>b.type==='Hero');const headingKey=templates.Hero.bindings.find(b=>b.kind==='heading').key;
  for(const entity of schema['@graph']||[])if(['WebPage','Service'].includes(entity['@type'])){if(root.description!==initialData.root.props.description)entity.description=root.description;if(hero.props[headingKey]!==templates.Hero.defaults[headingKey])entity.name=hero.props[headingKey];}
  doc('script[type="application/ld+json"]').text(JSON.stringify(schema).replace(/</g,'\\u003c'));

  doc('head').append('<style>'+extraCss+'</style>');
  doc('body').prepend('<div class="cms-preview-notice" style="background:#f0c978;color:#321e3c;padding:10px;text-align:center;font:14px Arial">Unpublished local preview — enquiries are disabled. <a href="/edit/website-design">Return to editor</a></div><script>document.addEventListener("submit",function(e){e.preventDefault();e.stopImmediatePropagation();const s=e.target.querySelector("[role=status]");if(s)s.textContent="Preview only: no enquiry was sent."},true);document.addEventListener("click",function(e){const a=e.target.closest("a");if(a&&a.getAttribute("href")?.startsWith("/")&&!a.getAttribute("href").startsWith("/edit/")){e.preventDefault();location.href="/public"+a.getAttribute("href")}},true)</script>');
  return doc.html();
}
export function validateData(data){
  if(!data||!data.root?.props||!Array.isArray(data.content)||data.content.length>40)throw new Error('Invalid page data');
  const root=data.root.props;
  for(const k of ['title','description','canonical','ogTitle','ogDescription','ogImage'])if(typeof root[k]!=='string'||root[k].length>3000)throw new Error('Invalid page setting '+k);
  if(root.path!==PAGE_PATH)throw new Error('The existing page address is protected in this prototype');
  const canonical=new URL(root.canonical);if(canonical.protocol!=='https:'||canonical.username||canonical.password)throw new Error('Use an HTTPS canonical URL');
  if(!['index','noindex'].includes(root.indexing))throw new Error('Invalid indexing choice');
  if(!safeImage(root.ogImage)&&!/^https:\/\//.test(root.ogImage))throw new Error('Invalid sharing image');
  const ids=new Set();let heroes=0;
  for(const block of data.content){
    const spec=templates[block.type],p=block.props;
    if(!spec||!p||typeof p.id!=='string'||p.id.length>150||ids.has(p.id))throw new Error('Unknown section or duplicate section identifier');ids.add(p.id);if(block.type==='Hero')heroes++;
    for(const key of Object.keys(p))if(key!=='id'&&!Object.hasOwn(spec.defaults,key))throw new Error('Unsupported section property');
    for(const[key,allowed]of Object.entries({background:themes,textColor:textColors,headingFont:fonts,bodyFont:fonts}))if(!Object.hasOwn(allowed,p[key]))throw new Error('Choose an approved '+key);
    if(!['original','left','center'].includes(p.alignment)||!['original','image-left','image-right'].includes(p.layout)||!spec.layout&&p.layout!=='original')throw new Error('Unsupported layout');
    const dark=p.background==='plum'||p.background==='original'&&spec.dark;
    if(p.textColor!=='auto'&&!(dark?['ivory','gold']:['plum','muted','green']).includes(p.textColor))throw new Error('Choose a text colour with contrast against this background');
    for(const b of spec.bindings){
      if(b.kind==='link'){if(typeof p[b.key+'Text']!=='string'||p[b.key+'Text'].length>500||!safeLink(p[b.key+'Href']))throw new Error('Use a valid button label and destination');}
      else if(b.kind==='image'){if(!p[b.key]||!safeImage(p[b.key].src)||typeof p[b.key].alt!=='string'||p[b.key].alt.length>1000)throw new Error('Choose a local image and descriptive alt text');if(p[b.key].variants&&(!Array.isArray(p[b.key].variants)||p[b.key].variants.length>3||p[b.key].variants.some(v=>!safeImage(v.src)||!Number.isInteger(v.width)||v.width<1||v.width>2000)))throw new Error('Invalid responsive image');}
      else if(typeof p[b.key]!=='string'||p[b.key].length>30000)throw new Error('Invalid text field');
      else if(b.kind==='rich'&&p[b.key]!==b.initial)p[b.key]=cleanRich(p[b.key]);
    }
  }
  if(heroes!==1)throw new Error('Keep the original hero so the page retains one main heading');
  return data;
}
