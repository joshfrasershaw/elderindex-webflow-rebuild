# Quality assurance and CI implementation policy
Version 1.0 | 27 October 2026.

The review branch installs `.github/workflows/quality.yml`, a PR/push quality workflow with read-only repository permission and immutable action SHAs. It does not deploy, publish, change DNS or use production credentials. An unrelated untracked CMS deployment draft is excluded. Node 24 and pinned Wrangler provide the local Cloudflare Static Assets test runtime; they are development tools, not public-site runtime dependencies.

Required checks on the exact proposed SHA:
1. npm ci; npm run build; npm run check.
2. npm run audit:links -- --output /tmp/elderindex-links-ci.json; fail on broken URLs/unexpected orphans, review category-specific diagnostics; preserve legitimate legal-page footer-only links.
3. npm test; use Playwright Chromium set-up as required; fail test regressions.
4. SITE_ENV=production npm run build; SITE_ENV=production npm run check; inspect manifest of canonical/indexable routes, then restore staging outputs if used locally; CI artefacts should distinguish environments.
5. Check for absent secrets, node_modules/dist leaks, malformed release-gate docs, unlogged material SEO modifications and unsafe changes to main/deployment config; automated policy checks can support, but not certify, owner/legal approvals.
6. Retain concise test/log output and artefacts for code review, not real user data. Don't run real Formspree submissions or unauthorised traffic against production in CI.

Production smoke tests after a release must verify actual HTTP status, X-Robots-Tag, canonical, sitemap, 301 redirect mapping, form receipt via an authorised test, mobile hero and menus. CI success isn't deployed-state proof.

Commands added in the 27 October review: `npm run check:release -- <manifest.json>` checks generated environment, indexability, schema references, canonical sitemap and redirect integrity; `npm run check:runtime -- <results.json>` checks actual **local** workerd HTTP responses, query retention, assets and 404s; `npm run check:policy` checks gate-report structure, recorded material changes, tracked-file hygiene and common credential patterns. Pattern checks are not a comprehensive security audit or legal signoff. `dist/release.json` identifies the build source/environment and whether tracked edits existed, without credentials. CI uploads separate staging/production manifests and HTTP results under the exact Actions SHA, then restores staging.

A test cannot decide marketing tone or quality on its own. Use code tests for deterministic invariants and owner review for material editorial claims and tradeoffs.
