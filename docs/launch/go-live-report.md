# ElderIndex go-live report — 27 October 2026

Release ID: **EI-20261027-RC1**  
Prepared UTC: **2026-10-27T09:36:44Z**  
Review branch: `policy/seo-ops-and-launch-2026-10-27`  
Release SHA: **PENDING implementation checkpoint commit; recorded below after commit.**  
Baseline: `4ff652b78cd0fa5d3521e3e44e7fee8027d7ef9d`; existing main `3a5760d90e496990ecde3827f618081eba7d2260`.  
Deployment / domain cutover UTC: **NONE performed**.  
Decision: **NOT READY FOR OWNER'S CUTOVER**. Code-owned checks are substantially complete, but migration, legal, enquiry and account gates remain open. No waiver is inferred from the desire to launch today.

The owner authorised autonomous review-lane work and subsequently instructed pushing all changes. This does not authorise a merge, production deployment or DNS change. Untracked CMS files and the old CMS deployment-workflow draft are excluded.

## Release gates

| Gate | Status | Evidence / tested UTC | Required next action |
| --- | --- | --- | --- |
| G00 provenance and recovery | BLOCKED-EXTERNAL | Baseline Git revisions above; public DNS snapshot in `evidence/dns-public-2026-10-27.json`; old live Vercel responses observed 08:56 UTC. Old host remains untouched. | Josh exports the Cloudflare DNS zone and records the currently serving Vercel deployment/project and restore method. Public DNS cannot prove account-level backup or proxy/routing configuration. |
| G01 migration | FAIL | Crawl found **57 unique old paths**, all observed HTTP 200, versus 22 new pages. `legacy-url-map.json` records individual titles, status, destinations and decisions. Ten content-equivalent mappings added; local Cloudflare runtime passed 42 rules with query strings and slash variants at approximately 09:25 UTC. | Resolve **40 OWNER-DECISION paths** before cutover; use GSC/export to determine whether to retain, consolidate or explicitly retire them. Do not accept silent new 404s. New rules are not deployed by this review push. |
| G02 build, browser and CI | NOT-RUN | Baseline npm ci/build/check/audit passed; all **16 baseline browser tests passed**. Updated build/check passed with 22 pages/42 redirects. Both local runtime configurations passed 115 HTTP checks each. Exact committed SHA / remote CI validation is pending this checkpoint. | Complete/check the non-deploying quality workflow on the release revision; no baseline result is substituted for exact-release CI. |
| G03 production indexability | BLOCKED-EXTERNAL | Local production checks passed: 19 non-legal pages indexable, three legal drafts noindex; staging remains noindex. Initial live staging probe observed HTML and X-Robots noindex at 08:56 UTC. Later sandbox probe returned 403s and cannot establish remote failure. | Choose canonical host: old site uses **www**, rebuild defaults apex. Recommendation: preserve www with `SITE_URL=https://www.elderindex.co.uk`, then verify canonical/host redirects on the actual intended deployment. No host setting changed. |
| G04 enquiry E2E | BLOCKED-EXTERNAL | Public endpoint is `https://formspree.io/f/xpqlvnaa`. Browser tests simulate success/error/timeout/duplicate suppression. **No real submission was sent.** | Josh submits one labelled test through the deployed preview, confirms a single entry in Formspree and receipt in the intended mailbox, verifies reply destination and account spam/origin settings. Repeat after cutover. |
| G05 legal and vendor accuracy | BLOCKED-EXTERNAL | Privacy, Terms and Cookies remain explicitly draft/noindex. No legal claims were rewritten. Directory claims already avoid invented prices/terms. Official Google/Autumna/Lottie pages were accessible at 08:56 UTC; Carehome/Homecare returned anti-bot challenge HTML despite HTTP 200. | Owner/adviser approves accurate notices, actual business identity, Formspree processing/retention/transfers and GA4-off disclosure. Review any outstanding vendor statements against official terms. Noindex does not make an inaccurate notice acceptable. |
| G06 mobile, performance and accessibility | NOT-RUN | Baseline 16 browser tests include desktop/mobile images, navigation, enquiry, schema and automated axe checks. Local production mobile Lighthouse 13.0.1: score **85**, LCP **4.2 s**, CLS **0**, TBT **75 ms**, no failed requests. Initial result is saved, not claimed as field data. Homepage graphic reduced losslessly from 316,018 to 226,608 bytes with identical visible pixels; original retained. | Exact-release browser/CI recheck and optimisation remeasurement pending. Real-device and deployed production performance remain owner/post-deployment checks. No field CWV evidence available. |
| G07 hosting, HTTPS, DNS and email | BLOCKED-EXTERNAL | Current apex A `216.198.79.1`; www CNAME `19c7fb3e4d54c23b.vercel-dns-017.com`; authoritative NS Alexis/Aron Cloudflare; old host HTTP 200 via Vercel. MX/SPF/DKIM/DMARC public records captured. Proposed replacement Worker is `elderindex-webflow-rebuild`; config has static assets, no custom user Worker, no production routes in source. | In Cloudflare verify build branch, preview behaviour, certificate, route conflicts and separate production target. Do not turn the only public staging URL indexable. Confirm old Vercel deployment is retained. Export all records before any later owner cutover. |
| G08 measurement | BLOCKED-EXTERNAL | No authorised GSC/GA4 data supplied. GA4 is OFF in local release config; consent/PII tests use a fixture only. Existing Google verification TXT preserved. | Export GSC query/page/device/country baseline and confirm property access. Owner may explicitly waive GA4 for initial launch, while retaining truthful off-state; no waiver recorded. Submit sitemap after owner cutover. |
| G09 CMS | BLOCKED-EXTERNAL | CMS feature branch stays separate. Its saved drafts are tied to SHA-256 of rendered Website Design HTML; current main differs in content/templates/styles. Publishing is disabled there. No private draft accessed or overwritten. | Josh explicitly accepts code-driven public edits for initial release, or treats authenticated editing/migration/publishing as a separate required gate. Do not merge CMS or overwrite fingerprints to force compatibility. |
| G10 security | NOT-RUN | Public output has no CMS/admin/API bundle; local runtime returns 404 for `/cms/` and `/api/bootstrap`. No secrets added; CI uses contents:read and no deployment credential. Tracked-file/policy scan pending commit. | Complete exact-release policy/hygiene scan and CI. Cloudflare account Access/security configuration remains externally unverified. |

## Autonomous work completed

- Adopted framework v1.0 in the explicitly authorised review lane and clarified precedence while retaining the prohibition on production changes.
- Crawled the actual old sitemap and internal links. Preserved evidence separately from current policy; no old content or domain modified.
- Added ten substantiated intent-equivalent redirects in `src/legacy-redirects.json`, retaining the 11 existing shortcut pairs (42 slash/no-slash rules total). No blanket redirect or speculative glossary/framework mapping.
- Added pinned development-only Wrangler, local asset-router checks, production/staging manifest/schema/indexation checks, credential-pattern/release-policy checks and read-only `quality.yml` CI with separate evidence artefacts. No deploy workflow added.
- Added a public `release.json` build identity (source revision, environment, canonical host, dirty tracked state), with no credentials.
- Optimised only the actual LCP homepage graphic through lossless WebP; preserved the uploaded PNG and visible design. No speculative copy rewrite, new landing page or redesign.
- Added [change record EI-20261027-02](../changes/2026-10-27-launch-readiness.md). All prior dated audits remain historical evidence.

## Exact owner actions tonight, in order

1. **Do not switch yet.** Read this report and the PR checks. Resolve `OWNER-DECISION` entries in [the migration map](legacy-url-map.json): framework/how-it-works pages, platform-specific guides, specialist service articles and glossary routes. Prefer retaining valuable content; provide GSC top-page evidence. Blanket redirects to `/` are not an acceptable shortcut.
2. Confirm **www versus apex**. Existing live URLs and sitemap use www; preserving it avoids an additional host migration. Proposed production build variables: `SITE_ENV=production`, `SITE_URL=https://www.elderindex.co.uk`, leave `GA4_MEASUREMENT_ID` unset unless separately configured/approved. This is a proposal, not an executed account change.
3. Approve/finalise legal notices and the business identity; confirm Formspree processing and email handling. Perform a real preview enquiry test and confirm Formspree plus mailbox receipt. No real submissions are generated by CI.
4. Accept **code-driven edits initially**, or require the CMS workstream before launch. The current private prototype is not a safe public publishing pipeline.
5. Export the Cloudflare DNS zone; retain the old Vercel deployment and its project restore instructions. Verify a **separate** production deployment target, correct source revision, HTTPS and canonical routing before attaching live domains. Keep the staging Worker noindex. The code does not supply account-specific custom-domain records or grant DNS authority.
6. Once every critical gate passes, approve the PR/release and make the domain decision yourself. Configure only the confirmed web-domain bindings/records supplied by Cloudflare for the intended production target. **Do not guess a CNAME to workers.dev, change nameservers again, or alter mail/CMS/portal records.** Neither this PR nor a green CI check performs cutover.
7. Check the post-cutover list below immediately. Record actual deployment and cutover UTC. Export/annotate GSC baseline and submit the approved canonical sitemap. Optional GA4 needs an explicit waiver if deferred under the gate policy.

## Rollback procedure and recovery point

**Old live recovery state observed 27 October:** Vercel serving https://www.elderindex.co.uk; apex A `216.198.79.1`; www CNAME `19c7fb3e4d54c23b.vercel-dns-017.com`. Public DNS snapshot is evidence of observed answers, not a complete authenticated zone export. TTL observed 300 seconds for web answers; do not promise propagation time.

Josh is the rollback executor; no autonomous production rollback lane is enabled. If the replacement fails after an owner cutover:

1. Use the saved account export and retained Vercel deployment. Remove/undo replacement custom-domain bindings or Worker routes that intercept apex/www, as appropriate to the actual chosen cutover mechanism; merely restoring an A record may not remove a Worker route.
2. Restore **only** the old web records/proxy state from the authenticated export. The public answers above are a fallback reference, not permission to overwrite unknown account settings. Keep Alexis/Aron nameservers and every MX/TXT/DKIM/DMARC, `cms`, `portal`, autodiscover and verification record intact.
3. Confirm old www homepage/services/contact return 200 with the old canonical and working enquiry route, apex redirects correctly, TLS works and email is unaffected. Record rollback time/reason and stop replacement traffic until investigated.
4. Code recovery is a selective `git revert` of implementation changes on another review branch, followed by all checks. Do not reset `main`, delete old host data or mix in CMS drafts. Existing main recovery source is `3a5760d90e496990ecde3827f618081eba7d2260`, but **that is replacement staging source, not the Vercel old-site deployment ID**.

## Post-cutover acceptance and inspection schedule

- Verify `/release.json` source/environment against the accepted release, no tracked edits, approved host; homepage/service/guide HTTP 200, correct self-canonicals and indexability in both HTML and headers.
- Verify HTTP/HTTPS and www/apex resolve in one intended direction without loops; production robots and sitemap agree with the approved canonical, legal pages stay noindex, unknown pages return real 404 and assets return 200.
- Exercise every mapped old URL on the real custom-domain runtime (301/308 to intended 200, query and slash variants). Check CMS/portal isolation and unchanged email records; verify actual mail send/receive.
- Perform a single labelled live enquiry and check one Formspree entry plus mailbox receipt. Consent rejection must not load GA; no personal enquiry data in analytics.
- Inspect iPhone/Android widths, keyboard/menu/focus, guide anchors, 200% zoom and image-loaded layout; run deployed performance checks. Local lab measurements are not field CWV.
- D+1: technical/status/form/canonical checks. D+7: GSC indexing, redirects and 404s. D+28: equal-period query/page/brand/device/country comparisons. D+90: qualified design/management/SEO enquiry outcomes with seasonality and attribution caveats. These checkpoints run from the actual cutover, not from this review date.

## Remaining evidence boundaries

No merge, production deployment, DNS edit, certificate/account change, real external message, Formspree submission, GSC export or legal signoff was performed. No production secret is requested in chat. CI/account restrictions and exact-release evidence will be updated after the checkpoint push; external unknowns cannot be converted into PASS without evidence.
