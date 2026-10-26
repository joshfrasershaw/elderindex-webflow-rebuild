import {defineConfig} from '@playwright/test';
import {mkdtempSync,existsSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const directory=process.env.CMS_BROWSER_DATA||mkdtempSync(path.join(os.tmpdir(),'elderindex-cms-browser-'));
process.env.CMS_BROWSER_DATA=directory;
export default defineConfig({testDir:'./browser',workers:1,fullyParallel:false,timeout:45000,outputDir:'./test-results',globalTeardown:'./browser/teardown.mjs',use:{baseURL:'http://127.0.0.1:4322',viewport:{width:1700,height:1000},headless:true,launchOptions:{executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined)},trace:'retain-on-failure'},webServer:{command:'node cms/server.mjs',cwd:path.resolve(import.meta.dirname,'..'),url:'http://127.0.0.1:4322/api/bootstrap',env:{CMS_PORT:'4322',CMS_DATA_DIR:directory},reuseExistingServer:false}});
