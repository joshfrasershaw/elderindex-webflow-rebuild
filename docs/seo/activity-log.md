# SEO activity log

## 27 October 2026 — Release candidate preparation (review lane)

**Status:** authorised non-deploying policy-branch checkpoint; no merge, deployment or domain changes. [EI-20261027-02](../changes/2026-10-27-launch-readiness.md) records code/tooling, ten verified migration mappings, retained migration blockers and lossless homepage optimisation. [Go-live report](../launch/go-live-report.md) is the current release-specific gate evidence. Remaining account/legal/migration decisions are explicit; no GSC, real inbox receipt or production result is invented. Implementation commit `ab9b014` passed all remote quality checks and 16 browser tests in run 40482477807; evidence/QA follow-up is linked from PR #1. No production deployment or cutover occurred.

## 27 October 2026 — Policy-driven SEO operating system and cutover governance

**Status:** committed on non-deploying branch policy/seo-ops-and-launch-2026-10-27, owner review pending. Old live site and main source unchanged by this documentation work. No domain or DNS changes and no claimed website release.

**Reason:** make Codex able to enact documented standards autonomously, distinguish fact-based remediation from owner-controlled changes, implement an evidence-backed release checklist, and leave a searchable human-readable history of changes alongside Git SHA and real deployment timestamps. **Record:** [EI-20261027-01](../changes/2026-10-27-seo-ops-framework.md). **Operating system:** [docs/ops/README.md](../ops/README.md). **Execution:** [master Codex job](../codex/MASTER-JOB.md). **Verification:** GitHub documentation commits only; build/live gate checks have NOT been run for these policy changes and remain Codex's next task.


Record significant changes here. Every entry must identify its date, evidence, affected pages, purpose, validation and publication state. Do not label a local build or a commit as a deployment. Record ranking or enquiry outcomes only when supported by actual data.

## 26 October 2026 — Evidence-led commercial page and semantic review

**Status:** reviewed on `review/commercial-seo-2026-10-26`, based on `origin/main` at `0a80960`. The owner subsequently explicitly instructed “yes push to repo please” after being told this would publish to `main` and trigger deployment. This authorises committing and pushing this specific patch to `main`; Cloudflare completion remains unverified. Main website only; CMS code/configuration untouched. No live-domain or DNS/Access changes.

**Purpose:** make the existing design and management offers concrete for care operators, preserve specialist SEO intent and useful internal links, and connect practical commissioning guidance to optional post-launch choices.

**Evidence and plan:** [commercial cluster review](commercial-clusters-2026-10-26.md) includes all 22 route decisions, metadata before/after, material copy excerpts, guide paths, schema findings, research limitations and a 30/60/90-day measurement plan. [Before](evidence/commercial-before-2026-10-26.json) and [after](evidence/commercial-after-2026-10-26.json) snapshots capture final rendered metadata/headings/canonical/robots/schema and classified internal links. Live competitor/Google requests were blocked by the environment proxy; supplied competitor observations were not independently verified. No ranking, volume, client-result or enquiry-outcome data is claimed.

**Significant changes:**

- Website Design retains its title/H1 and combined audience URL. The introduction and description now explain real care-sector experience. Revised sections distinguish a single home, group and home-care agency; cover genuine images, permission, provider language, factual care information, enquiry routing, delivery scope and optional handover/management/SEO.
- Website Management gains an audience-specific title and maintenance-focused description/introduction, concrete update/approval responsibilities and a clear maintenance-versus-SEO distinction. One contextual link to Directory Management explains coordination of approved facts. No security, SLA or unlimited-work guarantee added.
- Care Home SEO retains its title, H1, examples, distinctions and all links. One reporting paragraph adds referral/brand context and distinguishes contact actions from suitable admissions.
- The existing website guide gains briefing, photography/people-profile, ownership and handover questions. Existing section fragments remain; its real modification date advances to 26 October, publication stays 25 October. About's discovery paragraph now names the provider questions that inform design decisions.
- Schema retains all existing entity IDs, author/provider identity and breadcrumbs; adds reciprocal page subjects, descriptive service types and visible page images where appropriate. Generic social cards remain sharing images but are no longer claimed as article/primary page illustrations. No fabricated entities, ratings or rich-result claims.
- New accessibility coverage found pre-existing low-contrast management-illustration labels (3.05–3.91:1); darkened only those small labels to `#665b6b`. Approved photographs, uploaded concepts and layouts remain.
- Updated permanent strategy and linking guidance with evidence boundaries, optional-service clarity, existing-guide reuse and deep-link preservation.

**Validation:** frozen `npm ci` succeeded (restricted initial install needed retry with network-enabled execution). Baseline `npm run build`, `npm run check`, placement-aware audit and all 13 original browser tests passed. Final `npm test` passed **16/16**, including new mobile optional-service/guide journeys, all-page schema checks and automated WCAG A/AA checks on Design, Management and the expanded guide. The first expanded accessibility run identified the illustration contrast issue; final full suite passed after correction. These are automated checks, not accessibility certification.

Final `npm run check` passed all 22 pages with zero issues, 22 known redirect rules, 26 unique photographs and two uploaded hero graphics. `npm run audit:links -- --compare /tmp/elderindex-seo-before.json --output /tmp/elderindex-seo-after.json` reports no removed links, broken links, orphans, unreachable routes or repeated contextual pairs. One contextual link and one new guide contents link were added. Design/Management contextual referring pages stay 11/12; Directory Management grows 6 → 7. Footer-only main-content discovery for Terms/Cookies remains intentional. All canonicals, H1s and schema entity IDs are preserved; metadata changes are limited to Design, Management and the website guide. The local production build/check also passed, with staging rebuilt and checked afterwards. `git diff --check` passed.

**Limits and publication:** no live Cloudflare statuses, headers, performance, Google indexing or actual inbox delivery were tested. Existing legal, vendor-term and live launch checks remain in `docs/launch-status.md`. No new pages, URL changes or mandatory service bundles. No blocking editorial decision remains. The owner supplied the explicit publication instruction after reviewing the local patch; deployment success must still be verified separately.

## 26 October 2026 — Commercial cross-selling and permanent linking strategy

**Status:** implementation reviewed by the owner and explicitly approved for publication to `main`. Cloudflare build/deployment completion remains unverified. Baseline commit: `b405cd0`. No live-domain or environment publication changes.

**Purpose:** give Website Design/Redesign first commercial priority, Website Management/Maintenance second, and SEO/local visibility/directory optimisation third, while preserving each page's intent and existing useful SEO links.

**Evidence:** a rendered audit of all 22 pages found no broken internal links or orphans. Website Design had only one contextual referring page and Management three, compared with five for each specialist SEO page. No real Search Console, ranking or conversion data was used or invented.

**Significant changes:**

- Added 24 relevant contextual links across 14 pages, with specific reasons to explore a complementary service. Sources include the two specialist SEO pages, the other service pages, both audience pages, five guides and About.
- Retained the existing Design → Management route, clarified its benefit, and added Management → Design and Design → Search Visibility where appropriate.
- Increased contextual referring pages to Design from 1 to 11 and Management from 3 to 12. SEO-service and directory-service support is retained and modestly strengthened.
- Reordered existing service cards/footer to Design, Management, Search Visibility, Directory Management. No services, URLs or search-target pages were removed or created.
- Preserved every existing internal link, title, meta description, canonical URL and H1/H2 heading. No repetitive same-target prose pairs were introduced. Legal content and direct enquiry routes remain intact.
- Advanced modification dates only for the five guides with actual prose changes; preserved publication dates.
- Added permanent strategy, page-intent map, contextual linking rules and audit workflow under `docs/seo/`. Added `AGENTS.md` so future Codex SEO audits must read and apply them.
- Added the offline `audit:links` command, optional before/after comparison and three browser tests for commercial/guide enquiry journeys.

**Plan and review evidence:** [prioritised plan](implementation-plan.md), [complete before/after audit](audit-2026-10-26.md), [permanent strategy](strategy.md), [linking instructions](internal-linking.md).

**Validation:** generated 22-page checks passed; the offline audit found no broken internal links, orphan pages, unreachable routes or repeated prose destination pairs. The before/after comparison reports zero removed links and zero changes to captured titles, descriptions, canonicals or H1/H2 headings. All 13 browser tests passed, including three new tests for direct commercial enquiries and complementary-service/guide journeys, plus the existing desktop/mobile crawl and representative accessibility tests. The 404 template retains its return-to-home link. Live rankings and conversions were not measured.

**Publication authorisation:** the owner explicitly instructed “yes push it all, please”, authorising this change to be committed and pushed to `main`. That push triggers Cloudflare. This authorisation applies to this reviewed change; future SEO changes still require their own publication instruction.

**Owner review:** the owner confirmed “all reviews and happy”, then explicitly authorised the push. The successful pre-publication checks are recorded above; a push alone does not establish that Cloudflare finished deploying.
