# SEO activity log

Record significant changes here. Every entry must identify its date, evidence, affected pages, purpose, validation and publication state. Do not label a local build or a commit as a deployment. Record ranking or enquiry outcomes only when supported by actual data.

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
