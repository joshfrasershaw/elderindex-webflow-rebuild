// Wrangler bundles this public, non-secret JSON into the redirect Worker.
import legacy from '../src/legacy-redirects.json';
import {createApexRedirect} from '../src/apex-redirect.mjs';
export default createApexRedirect(legacy);
