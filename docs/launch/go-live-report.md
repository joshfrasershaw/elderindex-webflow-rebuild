# ElderIndex launch handoff — 28 October 2026

Release ID: **EI-20261028-02 — legal policy, cookie controls and 404**.
Tested release SHA: **e3275522e73e3d083ac768bc04da8e30b633bf05** (feature implementation **a7030c4f4ec96a5ab43df7f3311ed7ed7b42ffdb**, followed by a test navigation-wait correction) on main; baseline **67374116c4019fed758713df5ce3fa0f9eb919a5**. Documentation-only follow-ups do not replace that immutable implementation identity. Any newer clean checkout must be rebuilt/tested under its own exact SHA.

**Code/source preparation is complete; production-domain acceptance is still an owner hosting step.** Do not attach the public domain to the existing staging Worker: it is intentionally noindex. Use the separately prepared production/www and apex targets. No DNS, domain binding or production traffic switch was performed by this work.

## Current gates

| Gate | Status | Evidence | Minimum remaining action |
| --- | --- | --- | --- |
| G00 release/recovery | BLOCKED-EXTERNAL | Exact clean-source local staging and production manifests; old-site Git repo retained according to Josh. Repo retention alone does not verify a restorable serving deployment. | Record the old hosting project/deployment and web DNS/proxy/route restore state before switching. Josh executes rollback. |
| G01 URL migration | PASS | 30 pages, all 60 mapped old paths and 126 unchanged 301 rules. No broken links, orphan pages or unreachable canonical routes in classified before/after audit. Glossary fragments and specialist intent preserved. | Verify actual production-host redirects after binding. |
| G02 build/browser/release | PASS | Exact-SHA [quality run 40681826240](https://github.com/joshfrasershaw/elderindex-webflow-rebuild/actions/runs/40681826240) completed successfully 2026-10-28T11:43:11Z: all 22 browser tests, all-page mobile/desktop/axe, 551 HTTP checks per staging/production, 285 apex checks, provenance/target/CLI checks and staging checksum isolation. | Use this clean tested source, or rebuild/recheck a newer source under its own identity. |
| G03 indexing/hostname | PASS | Production source checks: 27 commercial/informational/reference pages indexable, www canonical/robots/sitemap consistent, no global noindex header. Three legal pages and 404 intentionally noindex. Staging remains noindex; separate dist-production. | Deploy the production config/build, then check served release.json, HTML and headers at www. Do not connect staging. |
| G04 enquiry delivery | PASS | Test EI-LAUNCH-20261027161513: one real staging POST accepted, one Formspree entry and one intended mailbox delivery confirmed by Josh. [Receipt evidence](evidence/real-enquiry-test-2026-10-27.json). | Do not repeat the closed staging test. Check production-origin/spam/reply settings and one live-origin journey as part of hosting acceptance. |
| G05 legal/privacy | PASS | Josh supplied and authorised publication of legal identity/address, non-VAT status, actual suppliers/data uses and monthly advance-payment/cancellation/refund policy. [Policy and sources](../ops/business-and-privacy-policy.md); notices no longer labelled drafts. Annual review rather than falsely mandated 12-month deletion. No trackers configured. | Follow the published review policy and retain applicable supplier processing/transfer paperwork. Account documents were not independently inspected; no legal certification claimed. |
| G06 usability/content | PASS | Static metadata/headings/schema/link/image alt/dimensions/assets checks: 30 pages, zero issues; 26 unique photos/two concepts retained. Desktop staging UI inspection confirms branded cookie dialog and 404. Full automated all-page mobile/desktop/axe checks also passed in G02. | Real-device/field-performance follow-up; do not claim accessibility certification or field CWV from source checks. |
| G07 deployment/HTTPS/mail | BLOCKED-EXTERNAL | Cloudflare staging build on e327552 succeeded 2026-10-28T11:41:44Z (build/version in the check snapshot). Browser-observed release.json serves exact tested e327552 source, clean staging/www/30 pages, verified 2026-10-28T11:43:50Z. Production/apex configs remain separate and unbound. | Deploy/identify production/apex versions, bind through owner Cloudflare flow, confirm public certificates/routing/redirect order and origin settings. Preserve mail/CMS/portal records and old-host fallback. |
| G08 measurement | PASS | Existing owner GSC baseline retained. Josh supplies CSVs on review requests and handles Search Console/sitemap actions; direct connector access is not a prerequisite. GA4 intentionally off. | Submit https://www.elderindex.co.uk/sitemap.xml after switch; record UTC, inspect D+1/D+7/D+28/D+90. No automated monitoring claimed. |
| G09 CMS/editing | PASS | Owner accepts code-driven initial editing; CMS separate and drafts preserved. | None for initial launch. |
| G10 security | PASS | No new credentials/admin exposure or trackers; private CMS/API paths excluded. Granular consent defaults off, invalid/expired/unavailable storage fails closed, scope change requires fresh consent, withdrawal disables GA and reloads. | Public certificate/account access configuration remains G07; arbitrary future trackers are not automatically covered by this banner. |

## What changed

- Privacy/Terms/Cookies now reflect owner-approved facts; address confined to footer-linked legal pages, deliberately noindex and omitted from marketing/schema/maps. Noindex is a visibility preference, not a secrecy guarantee.
- Monthly business services: paid in advance from agreed start date, cancellation stops next renewal, continued service to end of paid period, no pro-rata refund solely for a voluntary early stop, legal/breach remedies preserved. Put the terms in the accepted email/proposal before payment. No capacity claims or invented daily/hourly price.
- Branded banner: Accept all / Reject optional / Manage preferences; purpose switches; essential choice storage; footer access, close/Escape, persistence/expiry and withdrawal. Unused purposes clearly disabled. New services require disclosure, implementation/tests and fresh consent.
- Branded real-404 page with home, services, guides and contact routes, shared header/footer and consent controls. No soft-404 homepage redirect.
- No service/guide rewrite, new keyword pages, URL removal or photo replacement. All old mappings retained.

## Minimum switch sequence

1. Retain the old host/deployment and web routing/DNS restore settings. Inspect actual Cloudflare build/deploy branch/watch configuration; an earlier policy-branch build did not prove production deployment reach. Historical failed build 953a1da2 remains undiagnosed, but later successful main builds mean it is not a current-main failure. Confirm the selected target and successful production build rather than disabling checks.
2. Deploy clean accepted source using `npm run build:production`, `npm run check:production`, `wrangler.production.jsonc` (www) and `wrangler.apex-redirect.jsonc` (apex); record both version IDs. Keep existing staging/noindex unchanged. Follow [production-cutover.md](production-cutover.md); do not guess a workers.dev CNAME.
3. Josh connects www to production and apex to redirect target. Check certificates and HTTPS/redirect-rule order; preserve all email/MX/SPF/DKIM/DMARC, CMS, portal and verification records. Confirm Formspree allows production origin and reply routing.
4. Verify actual www release.json/environment/source, no accidental commercial-page noindex, canonical/robots/sitemap, redirects/query retention/direct 200 destinations, real 404, images/mobile navigation and one production enquiry. Record real cutover UTC, submit sitemap and retain fallback. If it fails, undo intercepting bindings/routes as well as restoring old web DNS/host state.

## Verification and limits

Local browser download returned non-ZIP data; local workerd could not start because uv_interface_addresses is restricted by this host. Neither is evidence of a website defect; full GitHub quality CI passed these on a supported runner. Local clean-source build, policy, provenance, production-target, release and link checks passed.

Staging UI checked directly in the cloud browser: homepage banner; Manage preferences dialog with unused categories disabled; rejection saved; terms text; missing-path branded page. These observations are not a production-host acceptance or complete deployed HTTP crawl. Shell public probes received an environment 403; no public-certificate validation is inferred. No new real form submission was sent.

[Implementation record](../changes/2026-10-28-legal-consent-launch.md). [Final CI and staging evidence](evidence/legal-consent-launch-2026-10-28.json) records the passing clean tested release. Google indexing, field CWV and account legal compliance are not certified by a source build.

## Rollback

Code: selectively revert the implementation commit, preserving unrelated main and CMS work, then run checks. Actual domain: Josh removes/undoes replacement Custom Domain bindings or Worker routes, restores the saved old web DNS/proxy/redirect state and retained old deployment, preserves email/CMS/portal records, verifies old www/contact/HTTPS and records UTC. An A-record edit alone may leave a Worker route intercepting traffic. No domain rollback was performed.
