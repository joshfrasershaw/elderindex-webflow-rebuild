import {rm} from 'node:fs/promises';
export default async()=>{if(process.env.CMS_BROWSER_DATA)await rm(process.env.CMS_BROWSER_DATA,{recursive:true,force:true});};
