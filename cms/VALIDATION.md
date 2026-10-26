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
