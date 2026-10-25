import { config } from './config.mjs';
import { lookup } from './data.mjs';
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
  const webpage={'@type':'WebPage','@id':url+'#webpage',url,name:p.headline||p.title,description:p.description,isPartOf:{'@id':config.baseUrl+'/#website'},publisher:{'@id':orgId},primaryImageOfPage:{'@type':'ImageObject',url:config.baseUrl+'/assets/elderindex-social.png',width:1200,height:630}};
  graph.push({'@type':'WebSite','@id':config.baseUrl+'/#website',url:config.baseUrl+'/',name:'ElderIndex',publisher:{'@id':orgId}},webpage);
  const crumbs=breadcrumbItems(p);
  if(crumbs.length){
    webpage.breadcrumb={'@id':url+'#breadcrumb'};
    graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))});
  }
  if(p.kind==='guide') graph.push({'@type':'Article','@id':url+'#article',headline:p.headline,description:p.description,mainEntityOfPage:{'@id':url+'#webpage'},author:{'@id':config.founderName?personId:orgId},publisher:{'@id':orgId},datePublished:p.datePublished,dateModified:p.dateModified,image:config.baseUrl+'/assets/elderindex-social.png',inLanguage:'en-GB'});
  if(p.kind==='service') graph.push({'@type':'Service','@id':url+'#service',name:p.headline,serviceType:p.title.split(' | ')[0],description:p.description,url,provider:{'@id':orgId},areaServed:{'@type':'Country',name:'United Kingdom'},mainEntityOfPage:{'@id':url+'#webpage'}});
  return {'@context':'https://schema.org','@graph':graph};
}
