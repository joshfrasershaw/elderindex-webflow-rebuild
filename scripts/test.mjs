import {spawnSync} from 'node:child_process';
const tests=spawnSync('npx',['--no-install','playwright','test'],{stdio:'inherit'});
// Browser fixtures use a fake GA ID. Always restore the real build afterwards.
const restore=spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
process.exit(tests.error||tests.signal?1:tests.status!==0?tests.status:restore.error||restore.signal?1:restore.status);
