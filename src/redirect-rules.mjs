// One source for the existing static aliases and the prepared apex redirect target.
const shortcuts=[['/website-design','/services/website-design/'],['/website-management','/services/website-management/'],['/search-visibility','/services/search-visibility/'],['/care-directory-management','/services/care-directory-management/'],['/care-home-seo','/services/care-home-seo/'],['/home-care','/services/home-care/'],['/choosing-a-care-website','/guides/choosing-a-care-website/'],['/home-care-local-seo','/guides/home-care-local-seo/'],['/care-directory-comparison','/guides/care-directory-comparison/'],['/carehome-co-uk-profile','/guides/carehome-co-uk-profile/'],['/google-business-profile-care','/guides/google-business-profile-care/']];
export function redirectRules(legacy){
 const pairs=[...shortcuts,...legacy.map(r=>[r.from,r.to,r.slashVariants??true])];
 return pairs.flatMap(([from,to,slashVariants=true])=>slashVariants?[[from,to,'301'],[from+'/',to,'301']]:[[from,to,'301']]);
}
