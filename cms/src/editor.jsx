import React,{useEffect,useState,useContext,createContext,useMemo,useCallback} from 'react';
import {Puck,FieldLabel} from '@puckeditor/core';
import '@puckeditor/core/puck.css';
export const MediaContext=createContext(null);
const iframeOptions={syncHostStyles:false};
const viewports=[{width:1440,label:'Desktop',icon:'Monitor'},{width:768,label:'Tablet',icon:'Tablet'},{width:390,label:'Mobile',icon:'Smartphone'}];
function cleanBrowserHtml(html){
  const template=document.createElement('template');template.innerHTML=html;
  const allowed=new Set(['P','STRONG','EM','B','I','U','BR','A','UL','OL','LI']);
  for(const el of [...template.content.querySelectorAll('*')]){
    if(!allowed.has(el.tagName)){el.replaceWith(...el.childNodes);continue;}
    for(const a of [...el.attributes])if(!(el.tagName==='A'&&['href','title','rel'].includes(a.name)))el.removeAttribute(a.name);
    if(el.hasAttribute('href')&&!/^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(el.getAttribute('href')))el.removeAttribute('href');
  }
  return template.innerHTML;
}
function styleObject(text=''){return Object.fromEntries(text.split(';').filter(x=>x.includes(':')).map(x=>{const i=x.indexOf(':');return[x.slice(0,i).trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),x.slice(i+1).trim()];}));}
function attributes(attrs){const output={};for(const[key,value]of Object.entries(attrs||{})){if(key==='style'){output.style=styleObject(value);continue;}const k=({class:'className',for:'htmlFor',tabindex:'tabIndex',srcset:'srcSet',fetchpriority:'fetchPriority',readonly:'readOnly',maxlength:'maxLength',autocomplete:'autoComplete',novalidate:'noValidate'})[key]||key;if(['required','hidden','disabled','checked','selected','multiple','novalidate'].includes(key))output[k]=true;else output[k]=value;}return output;}
function rootStyle(spec,p,bootstrap){
  const result=attributes(spec.tree.attrs),classes=[result.className||'','cms-section'];const dark=p.background==='plum'||p.background==='original'&&spec.dark;
  const style={...result.style,'--cms-color':p.textColor==='auto'?(dark?'#fffdfa':'#392a42'):bootstrap.textColors[p.textColor]};
  if(p.background!=='original'){style.background=bootstrap.themes[p.background];classes.push('cms-custom-background','cms-custom-text');}
  if(p.textColor!=='auto')classes.push('cms-custom-text');
  if(p.headingFont!=='original'){style['--cms-heading-font']=bootstrap.fonts[p.headingFont];classes.push('cms-custom-heading');}
  if(p.bodyFont!=='original'){style['--cms-body-font']=bootstrap.fonts[p.bodyFont];classes.push('cms-custom-body');}
  if(p.alignment!=='original'){style['--cms-align']=p.alignment;classes.push('cms-custom-alignment');}
  if(p.layout!=='original')classes.push('cms-'+p.layout);
  return {...result,className:classes.join(' '),style};
}
function Section({spec,props,bootstrap}){
  function node(n,key,root=false,skipBinding=false){
    if(n.text!==undefined)return n.text;
    const b=!skipBinding&&spec.bindings.find(b=>b.key===n.binding);const attrs=root?rootStyle(spec,props,bootstrap):attributes(n.attrs);attrs.key=key;
    if(b?.kind==='rich'){
      const value=props[b.key];
      if(typeof value!=='string')return value;
      if(value!==b.initial)return <div key={key} className="cms-rich-copy" dangerouslySetInnerHTML={{__html:cleanBrowserHtml(value)}}/>;
    }
    let children=n.children.map((c,i)=>node(c,key+'-'+i));
    if(b?.kind==='heading'){
      const value=props[b.key];if(typeof value!=='string'||value!==b.initial)children=typeof value==='string'?value.split('\n').flatMap((line,i)=>i?[<br key={'br'+i}/>,line]:[line]):value;
    }
    if(b?.kind==='link'){attrs.href=props[b.key+'Href'];children=[props[b.key+'Text'],...(n.children.some(c=>c.attrs?.['aria-hidden'])?[<span key="arrow" aria-hidden="true"> ↗</span>]:[])];}
    if(b?.kind==='image'){
      const value=props[b.key];attrs.alt=value.alt;
      if(value.src!==b.initial.src){attrs.src=value.src;delete attrs.srcSet;delete attrs.sizes;delete attrs['data-photo-id'];delete attrs['data-photo-key'];attrs.className=(attrs.className||'').replace('uploaded-concept-jpeg','');if(value.variants)attrs.srcSet=value.variants.map(v=>v.src+' '+v.width+'w').join(', ');}
    }
    if(['img','input','br','hr','source','meta','link'].includes(n.tag))return React.createElement(n.tag,attrs);
    return React.createElement(n.tag,attrs,...(Array.isArray(children)?children:[children]));
  }
  return node(spec.tree,spec.type,true);
}
export function MediaField({value,onChange,label='Image'}){
  const media=useContext(MediaContext),[open,setOpen]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  async function upload(file){if(!file)return;setBusy(true);setError('');try{const asset=await media.upload(file);onChange({src:asset.src,alt:asset.alt,variants:asset.variants});setOpen(false);}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <div className="media-field"><FieldLabel label={label}/>{value?.src&&<img src={value.src} alt="Selected image preview"/>}<button type="button" className="small-button" onClick={()=>setOpen(!open)}>Choose image</button><label className="upload-control">{busy?'Uploading…':'Upload image'}<input aria-label="Upload replacement image" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>upload(e.target.files[0])}/></label>{error&&<p role="alert" className="error">{error}</p>}{open&&<div className="media-options" aria-label="Image library">{media.assets.map(asset=><button type="button" key={asset.src} title={asset.name} onClick={()=>{onChange({src:asset.src,alt:asset.alt||value?.alt||'',...(asset.variants?{variants:asset.variants}:{})});setOpen(false);}}><img src={asset.src} alt={asset.name}/></button>)}</div>}<label className="cms-label">Image description (alt text)<textarea aria-label="Image description (alt text)" value={value?.alt||''} onChange={e=>onChange({...value,alt:e.target.value})}/></label><small>Describe what is shown. Use an empty description only for a decorative image.</small></div>;
}
function Iframe({children,document:doc,bootstrap}){
  useEffect(()=>{
    if(!doc)return;
    const link=doc.createElement('link');link.rel='stylesheet';link.href='/assets/site.css';doc.head.append(link);
    const style=doc.createElement('style');style.textContent=bootstrap.extraCss+'\n.cms-site-chrome,.cms-rich-copy{display:contents}form input,form textarea,form button{pointer-events:none}body{margin:0}';doc.head.append(style);
    const stop=e=>{if(e.target.closest('a,form'))e.preventDefault();};doc.addEventListener('click',stop);doc.addEventListener('submit',stop);
    return()=>{link.remove();style.remove();doc.removeEventListener('click',stop);doc.removeEventListener('submit',stop);};
  },[doc]);return children;
}
export function VisualEditor({bootstrap,record,onChange,save,preview,busy,dirty,notice}){
  const config=useMemo(()=>{
  const components={};
  for(const spec of Object.values(bootstrap.templates)){
    const fields={};
    for(const b of spec.bindings){
      if(b.kind==='heading')fields[b.key]={type:'text',label:b.label,contentEditable:b.inline};
      if(b.kind==='rich')fields[b.key]={type:'richtext',label:b.label,contentEditable:true,options:{heading:false,code:false,codeBlock:false,blockquote:false,horizontalRule:false}};
      if(b.kind==='link'){fields[b.key+'Text']={type:'text',label:b.label+' — label'};fields[b.key+'Href']={type:'text',label:'Button destination'};}
      if(b.kind==='image')fields[b.key]={type:'custom',label:b.label,render:props=><MediaField {...props} label={b.label}/>};
    }
    fields.background={type:'select',label:'Background colour',options:[{label:'Original design',value:'original'},{label:'Warm cream',value:'cream'},{label:'Ivory',value:'ivory'},{label:'Deep plum',value:'plum'},{label:'Soft sage',value:'sage'},{label:'Pale lilac',value:'lilac'}]};
    fields.textColor={type:'select',label:'Text colour',options:[{label:'Automatic contrast',value:'auto'},{label:'Plum',value:'plum'},{label:'Muted plum',value:'muted'},{label:'Deep green',value:'green'},{label:'Ivory',value:'ivory'},{label:'Gold',value:'gold'}]};
    const fontOptions=[{label:'Original typography',value:'original'},{label:'DM Serif Display',value:'serif'},{label:'DM Sans',value:'sans'}];
    fields.headingFont={type:'select',label:'Heading font',options:fontOptions};fields.bodyFont={type:'select',label:'Paragraph font',options:fontOptions};
    fields.alignment={type:'select',label:'Text alignment',options:[{label:'Original layout',value:'original'},{label:'Left',value:'left'},{label:'Centre',value:'center'}]};
    if(spec.layout)fields.layout={type:'select',label:'Image position',options:[{label:'Original layout',value:'original'},{label:'Image left',value:'image-left'},{label:'Image right',value:'image-right'}]};
    components[spec.type]={label:spec.label,fields,defaultProps:spec.defaults,
      ...(spec.type==='Hero'?{permissions:{delete:false,duplicate:false,insert:false}}:{}),
      ...(spec.type==='Contact'?{permissions:{duplicate:false,insert:false}}:{}),
      resolveData:({props})=>{const dark=props.background==='plum'||props.background==='original'&&spec.dark;return {props:{...props,textColor:props.textColor==='auto'||(dark?['ivory','gold']:['plum','muted','green']).includes(props.textColor)?props.textColor:'auto'}};},
      resolveFields:({props})=>{const dark=props.background==='plum'||props.background==='original'&&spec.dark;return {...fields,textColor:{...fields.textColor,options:fields.textColor.options.filter(o=>o.value==='auto'||(dark?['ivory','gold']:['plum','muted','green']).includes(o.value))}};},
      render:props=><Section spec={spec} props={props} bootstrap={bootstrap}/>
    };
  }
  const config={components,categories:{sections:{title:'ElderIndex sections',components:['Content','TextImage','FeatureGrid','Gallery','CallToAction','Benefits','FAQs']},existing:{title:'Existing page sections',components:['Hero','ServiceContent','PhotoStory','Contact']}},root:{
    label:'Page SEO settings',fields:{title:{type:'text',label:'SEO title'},description:{type:'textarea',label:'Meta description'},path:{type:'custom',label:'Page address',render:({value})=><label className="cms-label">Page address<input value={value} readOnly/><small>Protected in this prototype; no public URL changes.</small></label>},canonical:{type:'text',label:'Canonical URL'},indexing:{type:'select',label:'Future published indexing preference',options:[{label:'Do not index',value:'noindex'},{label:'Allow indexing',value:'index'}]},ogTitle:{type:'text',label:'Social sharing title'},ogDescription:{type:'textarea',label:'Social sharing description'},ogImage:{type:'text',label:'Social sharing image URL'}},
    render:({children})=><><div className="cms-site-chrome" dangerouslySetInnerHTML={{__html:bootstrap.shell.header+bootstrap.shell.breadcrumbs}}/><main id="main-content">{children}</main><div className="cms-site-chrome" dangerouslySetInnerHTML={{__html:bootstrap.shell.footer}}/></>
  }};
  return config;
  },[bootstrap]);
  const iframeOverride=useCallback(props=><Iframe {...props} bootstrap={bootstrap}/>,[bootstrap]);
  return <Puck iframe={iframeOptions} config={config} data={record.data} onChange={onChange} onPublish={()=>{}} headerTitle="ElderIndex" headerPath="Website Design" viewports={viewports} overrides={{iframe:iframeOverride,headerActions:()=> <><span className="save-state" role="status">{notice|| (dirty?'Unsaved changes':'Draft up to date')}</span><button className="small-button" onClick={preview} disabled={busy}>Preview draft</button><button className="primary-button" onClick={save} disabled={busy}>{busy?'Working…':'Save draft'}</button><button className="small-button" disabled title="Production publishing is not connected">Publish unavailable</button></>}}/>;
}
