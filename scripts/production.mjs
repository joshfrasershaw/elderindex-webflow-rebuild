// Build/test a separate production artefact. This script never deploys or binds domains.
import {spawnSync} from 'node:child_process';
const [action,output]=process.argv.slice(2);
const env={...process.env,SITE_ENV:'production',SITE_URL:'https://elderindex.co.uk',BUILD_OUTPUT_DIR:'dist-production',WRANGLER_CONFIG:'wrangler.production.jsonc'};
const run=(script,args=[])=>{const r=spawnSync(process.execPath,[script,...args],{stdio:'inherit',env});if(r.error||r.signal||r.status!==0)process.exit(r.status||1);};
if(action==='build')run('scripts/build.mjs');
else if(action==='check'){
 run('scripts/check.mjs');
 run('scripts/check-release.mjs',['--dist','dist-production',...(output?[output]:[])]);
 run('scripts/test-release-cli.mjs');
}else if(action==='runtime')run('scripts/check-runtime.mjs',output?[output]:[]);
else throw Error('Usage: production.mjs build|check|runtime [evidence.json]');
