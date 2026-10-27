# Quality assurance and CI implementation policy
Version 1.0 | 27 October 2026.

Main currently has no .github/workflows directory. Codex should install a PR/push quality workflow on its NON-DEPLOYING branch, with least-privilege read access and pinned major/action versions, respecting repository restrictions. Do not add a workflow that deploys, publishes, changes DNS or uses production credentials until explicit authorisation.

Required checks on the exact proposed SHA:
1. npm ci; npm run build; npm run check.
2. npm run audit:links -- --output /tmp/elderindex-links-ci.json; fail on broken URLs/unexpected orphans, review category-specific diagnostics; preserve legitimate legal-page footer-only links.
3. npm test; use Playwright Chromium set-up as required; fail test regressions.
4. SITE_ENV=production npm run build; SITE_ENV=production npm run check; inspect manifest of canonical/indexable routes, then restore staging outputs if used locally; CI artefacts should distinguish environments.
5. Check for absent secrets, node_modules/dist leaks, malformed release-gate docs, unlogged material SEO modifications and unsafe changes to main/deployment config; automated policy checks can support, but not certify, owner/legal approvals.
6. Retain concise test/log output and artefacts for code review, not real user data. Don't run real Formspree submissions or unauthorised traffic against production in CI.

Production smoke tests after a release must verify actual HTTP status, X-Robots-Tag, canonical, sitemap, 301 redirect mapping, form receipt via an authorised test, mobile hero and menus. CI success isn't deployed-state proof.

A test cannot decide marketing tone or quality on its own. Use code tests for deterministic invariants and owner review for material editorial claims and tradeoffs.
