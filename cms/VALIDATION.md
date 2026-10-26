# Local prototype validation

Validated on 26 October 2026, branch `feature/puck-local-cms`, using Node.js 24.19.0 and system Chromium.

| Check | Result |
| --- | --- |
| `npm --prefix cms test` | 10 passed: source/SEO preservation, sanitisation, field validation, draft history, stale-write protection, Host/CSRF checks, uploads, preview/publish separation, ZIP backups and persistence after a complete server restart |
| `npx playwright test --config cms/playwright.config.mjs` | 5 passed: searchable dashboard, responsive geometry parity, actual section movement/deletion/style changes, text/button/font edits, undo/redo, block insertion, viewport controls, save/reload, unsaved preview and image upload/replacement |
| `npm run cms:build` | Passed; Puck's editor bundle produces a size advisory. Font URLs resolve through the local server at runtime. No files are added to public `dist/`. |
| `npm run build` | 22 public pages generated |
| `npm run check` | 22 pages checked, zero issues: metadata, headings, schema, links, assets, sitemap, robots and 22 redirect rules |
| `npm test` | All 13 existing public browser/accessibility tests passed |
| `npm run audit:links -- --output /tmp/elderindex-cms-links.json` | Completed |
| `git diff --check` | Passed |
| `git diff --exit-code -- src public scripts wrangler.jsonc` | Passed: public source, assets, build scripts and deployment configuration unchanged |

Initial-preview tests compare original headings, prose, internal links, canonical/social metadata and structured data. Browser tests compare section dimensions at 1440 px and 390 px widths. Actual editor interactions use an isolated data directory; no public enquiries, GitHub writes or deployments are performed.

CMS additions are under `cms/`. Existing repository changes are limited to convenience scripts in `package.json`, ignored local/generated files in `.gitignore`, and a link to the editor guide in `README.md`.

This validates a local prototype, not a production CMS. Only Website Design is editable. Administrator authentication, authenticated hosted previews, durable hosted storage, GitHub publishing and adaptation of the remaining pages are not implemented. See `README.md` in this directory for access instructions and the staged production plan.

## Hosted adapter validation (26 October 2026)

The prepared Cloudflare adapter passes six security/state checks: signed Access JWT identity/audience/expiry verification, fail-closed invalid auth, transactional durable draft persistence and stale saves, previews that do not publish, media storage/backup, and unauthenticated static-asset rejection. Two auth checks are also included in the normal unit suite, which now has 12 checks. The browser suite now has six cases, including hosted-mode browser WebP conversion. The native undo interaction check passed on rerun after explicitly waiting for Puck's 250 ms history debounce.

Cloudflare Wrangler 4.152.0 compiles the deployment successfully in dry-run mode. A local workerd smoke test verifies unauthenticated asset rejection, saving/reloading the actual SQLite-backed Durable Object and rendering its saved HTML preview. No account resources or DNS records were changed by these tests. The public source/build scripts/Worker configuration remain unchanged.

Live Access redirects, identity-provider behavior, Cloudflare account provisioning and custom-domain routing still need post-deployment verification. Hosted publishing into GitHub/Vercel is deliberately unavailable. See `hosted/README.md` for the exact separate Worker deployment settings and scope.

## Access verification fix (26 October 2026)

A full signed-login test in the actual local Cloudflare runtime reproduced `TypeError: Invalid redirect value` when retrieving Access signing keys: Workers does not implement Fetch's `redirect: "error"` option. The request now uses `redirect: "manual"` and explicitly rejects non-success responses, including redirects.

The expanded runtime check passes a real RSA-signed test JWT through the public Worker using both the forwarded assertion and the Access session cookie, checks the verified identity, rejects an unsigned/missing session and a write without CSRF proof, and retains the existing SQLite draft/preview checks. The issuer, signing key and audience are test-only fixtures and cannot authenticate to the deployed CMS. Nine targeted security/state tests pass, including forged cookies, wrong issuer/audience, expired sessions, safe diagnostic responses and signing-key redirect rejection. The CMS bundle and Wrangler dry-run also pass.

Live owner login still requires verification after the automatic CMS redeployment. No Access policy, DNS record, public-site source or public-site deployment configuration is changed by this fix. The optional GitHub Actions queue-bypass draft remains unpushed.

## Hosted dashboard fix (26 October 2026)

A browser running the compiled production assets against the actual local Cloudflare Worker API reproduced `Cannot read properties of undefined (reading 'length')` immediately after the loading screen. The hosted bootstrap response exposed `pageList`, while the frontend contract uses `pages`. The Worker now returns the expected `pages` property. Startup also checks API response status/content and required page data, while a React error boundary provides reload/backup controls for unexpected rendering failures.

`npm run cms:hosted:browser` passes against the real compiled Worker and SQLite-backed Durable Object, with test-only signed authentication: the dashboard renders all 22 pages, the owner can open Website Design, edit its heading, save, and reload the persisted value. The API page-list contract is now asserted in the signed runtime check too. Three targeted Playwright regressions pass: local dashboard discovery, hosted-mode uploads, and visible recovery for denied/malformed bootstrap responses. No live credentials or production drafts are used by these checks.

## Hosted navigation fix (26 October 2026)

Using Cloudflare's actual static-assets handler reproduced `307 Location: /` for the authenticated `/media` request. The HTML fallback fetched `/index.html`, which the asset handler canonicalises to `/`. The previous local proxy silently followed that redirect, masking the browser navigation failure.

The Worker now serves recognised application routes from the canonical `/` asset without changing the browser URL. Both the Worker and UI accept trailing slashes consistently. `npm run cms:hosted:browser` now uses the real asset handler with Worker-first authentication and preserves redirects in its local HTTP bridge. It asserts six Media/Settings/Edit URL variants return 200 without Location headers, clicks Media and Settings, verifies direct reloads, uploads a PNG through the browser's hosted conversion and reloads the persisted private image, opens Website Design, edits/saves and reloads the SQLite-backed draft. These checks pass, along with signed-cookie/header authentication, CSRF protection and the Wrangler compilation dry-run. No public-site source, DNS or Access policy is changed.
