import { config } from './config.mjs';
import { lookup } from './data.mjs';
import { imagery, heroConcepts } from './imagery.mjs';
const serviceTypes = {
  '/services/website-design/':'Care home and home care website design',
  '/services/website-management/':'Care website management and maintenance',
  '/services/search-visibility/':'Care-sector SEO and local search visibility',
  '/services/care-directory-management/':'Care directory and profile management',
  '/services/care-home-seo/':'Care home SEO',
  '/services/home-care/':'Home care SEO',
};
function primaryImage(p) {
  const concept = p.path==='/' ? heroConcepts.homepage : p.path==='/services/website-design/' ? heroConcepts['website-design'] : null;
  if(concept) return {'@type':'ImageObject',url:config.baseUrl+concept.src,width:concept.width,height:concept.height};
  const photo = imagery[p.path+'::hero'] || imagery[p.path+'::interlude'];
  const variant = photo?.variants.find(v=>v.width===960) || photo?.variants.at(-1);
  return variant ? {'@type':'ImageObject',url:config.baseUrl+variant.src,width:variant.width,height:variant.height} : null;
}
export function breadcrumbItems(p) {
  if (p.path === '/') return [];
  const parts = p.path.split('/').filter(Boolean);
  const crumbs = [{name:'Home', url:config.baseUrl+'/'}];
  let path = '/';
  for (const part of parts) {
    path += part+'/';
    const match = lookup.get(path);
    if(match) crumbs.push({name:match.headline || match.title.split(' | ')[0],url:config.baseUrl+path});
  }
  return crumbs;
}
export function structuredData(p) {
  const url=config.baseUrl+p.path, orgId=config.baseUrl+'/#organization', personId=config.baseUrl+'/about/#founder';
  const org={'@type':'Organization','@id':orgId,name:'ElderIndex',url:config.baseUrl+'/',email:'hello@elderindex.co.uk',description:'Web design, search visibility and digital management for UK care providers.'};
  const graph=[org];
  if(config.founderName) {
    org.founder={'@id':personId};
    graph.push({'@type':'Person','@id':personId,name:config.founderName,url:config.baseUrl+'/about/#founder',worksFor:{'@id':orgId},description:'Founder of ElderIndex, with care home management, operations management and customer relations experience, including leading work to fill care home beds.'});
  }
  const webpage={'@type':'WebPage','@id':url+'#webpage',url,name:p.headline||p.title,description:p.description,isPartOf:{'@id':config.baseUrl+'/#website'},publisher:{'@id':orgId}};
  const image = primaryImage(p);
  if(image) webpage.primaryImageOfPage=image;
  graph.push({'@type':'WebSite','@id':config.baseUrl+'/#website',url:config.baseUrl+'/',name:'ElderIndex',publisher:{'@id':orgId}},webpage);
  const crumbs=breadcrumbItems(p);
  if(crumbs.length){
    webpage.breadcrumb={'@id':url+'#breadcrumb'};
    graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))});
  }
  if(p.kind==='guide') {
    webpage.mainEntity={'@id':url+'#article'};
    graph.push({'@type':'Article','@id':url+'#article',headline:p.headline,description:p.description,mainEntityOfPage:{'@id':url+'#webpage'},author:{'@id':config.founderName?personId:orgId},publisher:{'@id':orgId},datePublished:p.datePublished,dateModified:p.dateModified,inLanguage:'en-GB'});
  }
  if(p.kind==='service') {
    webpage.mainEntity={'@id':url+'#service'};
    graph.push({'@type':'Service','@id':url+'#service',name:serviceTypes[p.path]||p.headline,serviceType:serviceTypes[p.path]||p.title.split(' | ')[0],description:p.description,url,provider:{'@id':orgId},areaServed:{'@type':'Country',name:'United Kingdom'},mainEntityOfPage:{'@id':url+'#webpage'}});
  }
  return {'@context':'https://schema.org','@graph':graph};
}
