# ElderIndex go-live report — 27 October 2026

Release ID: **EI-20261027-RC1**
Prepared UTC: **2026-10-27T09:48:34Z**
Review branch: `policy/seo-ops-and-launch-2026-10-27`
Release SHA (implementation): **`752f6a9f5d8b5be47bd9312c4ec58fcc3b85eb89`**, committed **2026-10-27T09:45:47Z**.

PR: **https://github.com/joshfrasershaw/elderindex-webflow-rebuild/pull/1**. The final handoff commit updates documentation/evidence only. The release build and CI evidence above identify the tested implementation revision. If later fixes change implementation or a merge changes the source SHA, rebuild and revalidate that exact SHA; never substitute an assumed merge SHA.
Baseline: `4ff652b78cd0fa5d3521e3e44e7fee8027d7ef9d`; existing main `3a5760d90e496990ecde3827f618081eba7d2260`.
Deployment / domain cutover UTC: **NONE performed**.
Decision: **NOT READY FOR OWNER'S CUTOVER**. Code-owned checks are substantially complete, but migration, legal, enquiry and account gates remain open. No waiver is inferred from the desire to launch today.

The owner authorised autonomous review-lane work and subsequently instructed pushing all changes. This does not authorise a merge, production deployment or DNS change. Untracked CMS files and the old CMS deployment-workflow draft are excluded.

## Release gates

| Gate | Status | Evidence / tested UTC | Required next action |
| --- | --- | --- | --- |
| G00 provenance and recovery | BLOCKED-EXTERNAL | Baseline Git revisions above; public DNS snapshot in `evidence/dns-public-2026-10-27.json`; old live Vercel responses observed 08:56 UTC. Old host remains untouched. | Josh exports the Cloudflare DNS zone and records the currently serving Vercel deployment/project and restore method. Public DNS cannot prove account-level backup or proxy/routing configuration. |
| G01 migration | FAIL | Crawl found **57 unique old paths**, all observed HTTP 200, versus 22 new pages. `legacy-url-map.json` records individual titles, status, destinations and decisions. Ten content-equivalent mappings added; local Cloudflare runtime passed 42 rules with query strings and slash variants at approximately 09:25 UTC. | Resolve **40 OWNER-DECISION paths** before cutover; use GSC/export to determine whether to retain, consolidate or explicitly retire them. Do not accept silent new 404s. New rules are not deployed by this review push. |
| G02 build, browser and CI | PASS | Exact implementation SHA `752f6a9` passed remote quality CI, including npm ci, staging/production builds/checks, classified links, all 16 browser tests, policy scan and 115 local HTTP checks per configuration. [Run 40483257586](https://github.com/joshfrasershaw/elderindex-webflow-rebuild/actions/runs/40483257586), completed 2026-10-27T09:47:27Z. | Final evidence/QA follow-up head must also remain green before owner merge; no CI step deploys. |
| G03 production indexability | BLOCKED-EXTERNAL | Local production checks passed: 19 non-legal pages indexable, three legal drafts noindex; staging remains noindex. Initial live staging probe observed HTML and X-Robots noindex at 08:56 UTC. A curl recheck at approximately 09:40 UTC confirmed every deployed staging page is 200/noindex; sandbox-only 403s were not live failures. Existing shortcut 301s and real 404s observed; release identity/new mappings are not yet deployed. | Choose canonical host: old site uses **www**, rebuild defaults apex. Recommendation: preserve www with `SITE_URL=https://www.elderindex.co.uk`, then verify canonical/host redirects on the actual intended deployment. No host setting changed. |
| G04 enquiry E2E | BLOCKED-EXTERNAL | Public endpoint is `https://formspree.io/f/xpqlvnaa`. Browser tests simulate success/error/timeout/duplicate suppression. **No real submission was sent.** | Josh submits one labelled test through the deployed preview, confirms a single entry in Formspree and receipt in the intended mailbox, verifies reply destination and account spam/origin settings. Repeat after cutover. |
| G05 legal and vendor accuracy | BLOCKED-EXTERNAL | Privacy, Terms and Cookies remain explicitly draft/noindex. No legal claims were rewritten. Directory claims already avoid invented prices/terms. Official Google/Autumna/Lottie pages were accessible at 08:56 UTC; Carehome/Homecare returned anti-bot challenge HTML despite HTTP 200. | Owner/adviser approves accurate notices, actual business identity, Formspree processing/retention/transfers and GA4-off disclosure. Review any outstanding vendor statements against official terms. Noindex does not make an inaccurate notice acceptable. |
| G06 mobile, performance and accessibility | BLOCKED-EXTERNAL | Baseline 16 browser tests include desktop/mobile images, navigation, enquiry, schema and automated axe checks. Local production mobile Lighthouse 13.0.1: score **85**, LCP **4.2 s**, CLS **0**, TBT **75 ms**, no failed requests. The committed optimisation passed remote browser checks. Remeasurement at 09:42 UTC: performance **89**, LCP **3.8 s**, CLS **0**, TBT **8 ms**, zero failed network requests. Homepage graphic reduced losslessly from 316,018 to 226,608 bytes with identical visible pixels; original retained. | Real-device/browser-zoom and deployed production performance remain unverified until an approved production preview is available. Lab LCP remains above the 2.5 s field reference; do not claim good field CWV or causal improvement from one run. |
| G07 hosting, HTTPS, DNS and email | BLOCKED-EXTERNAL | Current apex A `216.198.79.1`; www CNAME `19c7fb3e4d54c23b.vercel-dns-017.com`; authoritative NS Alexis/Aron Cloudflare; old host HTTP 200 via Vercel. MX/SPF/DKIM/DMARC public records captured. Proposed replacement Worker is `elderindex-webflow-rebuild`; config has static assets, no custom user Worker, no production routes in source. | In Cloudflare verify build branch, preview behaviour, certificate, route conflicts and separate production target. Do not turn the only public staging URL indexable. Confirm old Vercel deployment is retained. Export all records before any later owner cutover. |
| G08 measurement | BLOCKED-EXTERNAL | No authorised GSC/GA4 data supplied. GA4 is OFF in local release config; consent/PII tests use a fixture only. Existing Google verification TXT preserved. | Export GSC query/page/device/country baseline and confirm property access. Owner may explicitly waive GA4 for initial launch, while retaining truthful off-state; no waiver recorded. Submit sitemap after owner cutover. |
| G09 CMS | BLOCKED-EXTERNAL | CMS feature branch stays separate. Its saved drafts are tied to SHA-256 of rendered Website Design HTML; current main differs in content/templates/styles. Publishing is disabled there. No private draft accessed or overwritten. | Josh explicitly accepts code-driven public edits for initial release, or treats authenticated editing/migration/publishing as a separate required gate. Do not merge CMS or overwrite fingerprints to force compatibility. |
| G10 security | PASS | Public output has no CMS/admin/API bundle; local runtime returns 404 for `/cms/` and `/api/bootstrap`. No secrets added; CI uses contents:read and no deployment credential. Exact committed-SHA policy/hygiene checks passed in remote CI; added release scans reject common credential patterns and unapproved remote script tags. | PASS is scoped to public code/output checks, not a penetration test. Cloudflare account Access/security configuration remains externally unverified under G07. |

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

No merge, production deployment, DNS edit, certificate/account change, real external message, Formspree submission, GSC export or legal signoff was performed. No production secret is requested in chat. GitHub quality CI completed successfully for the implementation SHA; follow-up review-head status is available on PR #1. The initial artefact upload omitted hidden `.release-evidence` files; follow-up CI explicitly includes them and fails if no evidence files exist. This was an evidence-retention fix, not a deployment. External unknowns cannot be converted into PASS without evidence.

## CMS and source compatibility evidence

`evidence/cms-compatibility-2026-10-27.json` records the actual checked-in CMS seed fingerprint and current rendered Website Design fingerprint. They differ. The CMS feature SHA is `b2ced125147663d20113c0c4a55ab2a0268fac05`; private stored drafts were not read. Export drafts/media through authenticated backup before any future adaptation; review template/section bindings, migrate against the new source and prove preview/save/recovery before considering publication. Neither this code release nor the new image variant enables CMS publishing.

## Noncritical post-launch backlog

- Remeasure deployed compressed/cached performance at real mobile/desktop conditions; prioritise verified LCP causes. Preserve artwork/design; no speculative redesign.
- Complete manual real-device, assistive-technology and true browser-zoom reviews. Automated axe is not certification.
- Add GA4 only with owner approval, reviewed notice and consent-aware validation; preserve GA4-off truthfulness if waived initially.
- Migrate CMS snapshots and build a reviewed publishing/rollback lane as a separate workstream if code-driven launch edits are accepted.
- Use actual GSC evidence for retained specialist pages and future content; no mass new guides for keyword variants.

## Immutable review build

A clean tracked-source build of release SHA `752f6a9f5d8b5be47bd9312c4ec58fcc3b85eb89` was created at **2026-10-27T09:47:28Z** with `SITE_ENV=production SITE_URL=https://www.elderindex.co.uk`; build/check/release checks passed, GA4 is off, and staging was restored afterwards. This is an explicitly **proposed-www review artefact**, not an approved production release. `evidence/release-artefact-2026-10-27.json` records the 7,645,648-byte ZIP and SHA-256 `04abfb6a4b247f6834481de728f74e1c1bae1e24eddabbbb9a95b28083df2481`. Workspace archive: `/workspace/exports/elderindex-release-752f6a9-proposed-www-production.zip`. The archive has not been deployed. The successful CI run above also retains separate staging/production manifests and workerd HTTP evidence for the exact tested implementation SHA.

CI provenance detail: release evidence uses the **push** run 40483257586. Its archived manifest records source SHA `752f6a9` with `trackedChanges:false`. The separate PR workflow tests GitHub’s synthetic merge revision and labels its own artefacts accordingly; it is not substituted for the exact-source push evidence.
