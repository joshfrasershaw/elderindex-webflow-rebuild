> **Separation of concerns — 27 Oct 2026:** These gates protect the **ONE-OFF old-site -> replacement-domain CUTOVER**, not every future code/text/SEO edit. The owner authorises Codex to commit and publish normal framework-compliant fixes directly to main, subject to [autonomous publishing](../ops/autonomous-publishing.md). Existing live website stays on its old host until Josh approves the switch; once the replacement is live, Codex may publish eligible improvements without a new gate signoff for every release. Verification and dated live change logging are still mandatory. Do not claim a release went live if the host build failed.

# Release gates — definitive ElderIndex website cutover standard
Version 1.0 | 27 October 2026 | This document REPLACES docs/launch-status.md as the go/no-go standard. The older file remains historic evidence.

## Release principle
The older website remains live until the owner chooses to switch. This checklist applies to the exact release SHA, build configuration and intended host; green local tests do not attest live DNS, third-party services, SSL, email or search indexing. Codex should autonomously finish all code-owned gates. It must NOT make the final domain or DNS cutover, or switch production traffic, until Josh gives explicit approval.

Gate states: PASS (evidence + time + verifier), FAIL (reproducible violation), BLOCKED-EXTERNAL (account access or owner decision missing), NOT-RUN (no evidence), WAIVED (owner accepts a specified NONCRITICAL risk, with reason/date). A blocker cannot silently become a waiver. Every critical gate must PASS before declaring READY FOR CUTOVER; exception requires explicit owner acceptance of a particular risk, never assumed.

## Exact environment contract
Live canonical is proposed https://elderindex.co.uk, but confirm owner and current redirect destination including www. src/config.mjs defaults SITE_ENV=staging and SITE_URL=https://elderindex.co.uk, so a default build is intentionally noindex. The real production build must set SITE_ENV=production. Legally unapproved draft legal URLs stay noindex but must still be accurate and accessible if published. Existing public site and its search performance remain preserved until cutover.

## Critical gates
G00 Release provenance and recovery: record branch, commit, build commands, immutable artefact if available, last-known-good old-site host/DNS settings, screenshots/export of DNS zones excluding secrets, and person executing rollback. No destructive replacement of old-site data.

G01 URL inventory and migration: crawl old public canonical and www/redirect destinations; use current sitemap, linked pages, GSC top landing pages, analytics and any platform export. Build explicit old URL -> same/closest intent new URL or reasoned 404/410 map with source and reviewed status. Test paths including query/encoding/trailing slashes, 301/308, destination 200, no chains/loops. No blanket redirect to / and no accidental redirect of assets. See legacy-url-migration.md. IMPORTANT: confirm redirects will work on the actual deployed Cloudflare route, not just in the generated _redirects file.

G02 Build health and release-specific automation: npm ci; npm run build; npm run check; npm run audit:links -- --output /tmp/elderindex-final-links.json; npm test. Run equivalent commands for production configuration SITE_ENV=production, including a rendered indexation/redirect/sitemap/schema check, then restore desired staging artefact. Record CI/test evidence against exact SHA. Confirm no missing assets, broken internal URLs, duplicated titles/H1s or browser errors.

G03 Production indexability and duplicate control: intended commercial/service/guide URLs return HTTP 200 and have consistent intended canonical, meta robots and X-Robots-Tag; production isn't accidentally noindex and staging/private previews cannot be indexed. Verify sitemap.xml and robots.txt at intended host, no http/www duplicate index targets, correct custom 404 HTTP status. Google indexing itself cannot be guaranteed at cutover.

G04 Enquiry E2E: send one real clearly labelled test through actual deployed Formspree endpoint, verify receipt in Formspree and intended mailbox with required fields and no duplicate; verify timeout and error behaviours, anti-spam and correct reply destination. Simulated success in Playwright does NOT pass G04. Do not put personal/sensitive health details into testing or analytics.

G05 Legal, privacy and third parties: owner-approved accurate privacy and cookie notices and applicable terms, legal basis and processing disclosure including Formspree, retention and international transfers as applicable. If GA4 is OFF, state that truthfully; if ON, confirm preference gating and no PII. Directory/platform claims checked against current official sources. Owner reviews claims where judgement/legal responsibility exists.

G06 Mobile/performance/accessibility and content: browser QA on realistic iPhone/Android widths, desktop, keyboard navigation/focus, usable CTA, legible graphics, menu, guide anchors, zoom and images; automated axe checks, production synthetic performance with all images loaded, and no broken critical layout. Core Web Vitals field data is optional when unavailable; note baseline unknown instead of blocking solely on missing history.

G07 Hosting and domain cutover readiness: confirm production deployment target, Cloudflare Worker/static-asset routing, HTTPS/cert, DNS ownership, correct apex/www selection and TTL behaviour. Inventory/retain MX, SPF, DKIM, DMARC and any business email records. Verify old host remains restorable. Account-level configuration/DNS actions are an owner task, not assumed complete by code.

G08 Search measurement and post-launch operations: confirm Search Console property access to current domain, export pre-cutover branded/nonbranded queries and landing pages if available, preserve analytics baseline and prepare sitemap submission, query/landing monitoring, 404 reporting and change annotations. GA4 measurement setup is STRONGLY recommended but may be owner-waived before initial cutover if the site is truthfully operating without it; do not falsely declare events validated. Set D+1, D+7, D+28 and D+90 inspections.

G09 CMS compatibility decision: the public static site can go live without a CMS if Josh explicitly accepts that edits will be code-driven for now. A functional public site does not require Puck. If CMS handover is explicitly a release requirement, demonstrate authenticated editing, existing-draft migration, preview, safe publishing, backup and recovery; otherwise label separate WORKSTREAM, not an undisclosed blocker.

G10 Security: credentials in platform secrets only; inspect public output for secrets; no insecure admin/editor route, no Access bypass, no leaked staging and no unapproved remote script introducing sensitive collection.

## TODAY: Codex work order and handoff
1. Perform all self-contained tests, review inventory and implement deterministic missing code fixes on safe branch.
2. Separate remaining items into: CODEx FIXED, ACCOUNT-ONLY OWNER STEP, HUMAN/LEGAL SIGNOFF, OPTIONAL POST-LAUNCH.
3. Produce docs/launch/go-live-report.md for exact SHA, each G00-G10 status/evidence, unverified risks, proposed DNS/canonical steps, rollback path and a SHORT numbered owner cutover checklist.
4. Never invent PASS for account-only tasks or mark the site READY if critical gates are unknown.
5. Owner performs final DNS/domain decision after inspecting the report. After cutover Codex should check each external gate again if suitable authorised access is available, record exact live timestamp and fix allowed deterministic issues under decision-rights.md.

## Minimal owner-night checklist (generated with actual details by Codex)
Review RELEASE ID / target build SHA -> check gate report -> preserve old DNS & email records -> verify pre-cutover preview and contact test -> change ONLY confirmed web host records/routing -> wait for actual DNS result (no promised propagation time) -> inspect HTTPS, apex/www redirect, 200 indexable pages, sitemap, all 301s and one live enquiry -> annotate cutover time -> retain fallback -> check GSC after launch.
