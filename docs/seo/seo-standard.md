# ElderIndex full-spectrum SEO operating standard
Version 1.0 | 27 October 2026. This is a policy and remediation playbook, not a claim that a live audit has passed.

## Universal loop for every SEO rule
STANDARD (desired behaviour) -> DETECT (source + live where accessible) -> DIAGNOSE (intent/root cause) -> REMEDIATE (minimal approved action) -> VERIFY (rendered build, relevant test, live check) -> LOG (changed URL, SHA, framework version and outcome). If a material fact is unavailable, record 'unknown' and do not manufacture it. Guardrails in docs/ops/decision-rights.md override convenience.

### T01: Crawlability, indexation and environments
For each URL use approved URL manifest, HTTP status, robots.txt, X-Robots-Tag, HTML meta robots, canonical and actual index coverage; distinguish production from staging and legal drafts. A published, approved commercial URL should return 200, be crawlable and indexable, use an appropriate self-canonical, appear in sitemap and have suitable internal links. Staging intentionally noindex. Correct factual environment mismatches under approved authority; never turn an unreleased preview indexable. Google-selected canonical and indexed state must be checked from Search Console after launch.

### T02: URL architecture and redirects
Inventory historic URLs before migration from old sitemap, crawl, GSC landing pages, analytics and owner materials; record last-seen, traffic and closest intent. Map old to equivalent new URL (301); never bulk redirect unrelated URLs to home. Preserve important paths, avoid redirect chains and redirect loops, verify actual production status/header. Keep original old-site archive and redirect map. New slugs and migrations require change-control and release gates.

### T03: Rendering, page health and structured content
Exactly one meaningful H1, sensible semantic headings, HTML text available without mandatory hydration, stable navigation and links crawlable with href, helpful 404 status and custom page. Monitor 4xx/5xx/broken assets and JS console exceptions. Validate XML sitemap, robots and distinct URL/title/description where applicable. Use no arbitrary character count or keyword-density quota.

### T04: Page relevance and commercial intent
One leading buyer/search intent per canonical landing page, with natural supporting synonyms and decision-useful coverage. Website design/redesign is the principal commercial objective; management second; SEO/local/directory third. Preserve specialist Care Home SEO and Home Care SEO pages. Test ambiguous searches such as 'care home websites' before targeting; avoid provider-versus-family intent mismatch, duplicate city pages and shallow keyword clones. Titles, snippets and H1s must match actual value.

### T05: Semantic coverage, topics and entity graph
A topic cluster has an accountable parent page, useful related subtopics, user questions, precise internal links and non-duplicated intent. First identify what the reader wants and what other pages already answer; create a new article only for a distinct intent with genuinely useful evidence. Schema.org Organization, Person, WebSite, WebPage, Service, Article and BreadcrumbList can describe real facts consistently with visible content, stable @id and verified attributes. Structured markup does not confer Google Knowledge Graph membership or rankings. Do not mark up fake reviews, ratings, branches, business addresses or credentials. Check schema syntax and applicable Google feature rules, without assuming eligibility.

### T06: Experience, expertise, evidence and content quality
Give practical, authentic answers from Josh's actual care operations experience and validated primary sources; distinguish first-person experience from population-level research. Avoid invented ElderIndex project history, client testimonials, results or case studies. Provider facts and clinically/regulatorily sensitive statements require appropriate approval. Favour substantive unique examples, clarity, source/update dates where meaningful, useful accessibility and editorial maintenance. Protect authorship and permissions. Follow editorial-policy.md.

### T07: Internal linking and customer journey
Apply the established docs/seo/internal-linking.md in full. Service pages must expose a direct enquiry route; guides answer the informational question first and suggest relevant services only when justified. Avoid forcing a commercial sequence and keep existing useful links. Detect contextual links separately from header/footer/cards. Zero orphans and broken paths is the technical baseline; link counts are diagnostics, not quotas.

### T08: Local SEO, directories and care coverage
Separate actual business office, regulated registered location, branch, geographic coverage and website service area. Do not create false Google Business Profiles, invented local offices or inaccurate coverage. Validate GBP eligibility under official current guidance; confirm NAP only when a real, approved business address/phone is provided. Keep first-party site and approved directory facts aligned, but distinguish listing rules, platform ownership and paid packages. Directory claims require current official checks. No fake review generation or gating.

### T09: Authority, backlinks and digital PR
Pursue earned, relevant links from genuine care-sector organisations, collaborations, useful resources and editorial mention; assess topical fit, traffic quality, placement, independence and outbound-link risk. No guaranteed number of links, no exchange networks, PBNs, paid links passing PageRank or automated outreach spam. Codex may research prospects and draft original pitches; contacting sites, payments and partnerships need owner approval. Track referring domain, link type, source, dates and outcome; don't claim rankings from link counts alone.

### T10: Image, video and assets
Accurate alt descriptions for informative imagery; empty alt for decorative images. Preserve source rights and consent; illustrative concepts and stock cannot masquerade as actual homes, clients or staff. Provide appropriate sizes/formats, responsive srcset, explicit dimensions, non-lazy main/LCP imagery and meaningful image filenames where useful. Video should provide a genuine user benefit, appropriate captions/transcripts and technically valid metadata only when present. Don't create synthetic 'real people' or fabricated testimonials.

### T11: Performance, mobile and accessibility
Measure production mobile and desktop with synthetic tools and, where available, real-user Core Web Vitals. Reference targets (good field 75th percentile): LCP <=2.5s, INP <=200ms and CLS <=0.1. If no field data exists, say so; don't pass a lab result off as field data. Check responsive overflow, keyboard/focus and WCAG issues; a passing axe test is not certification. Fix verified regressions without trading away conversion paths or editorial meaning.

### T12: Discovery in AI systems
Ensure first-party pages are indexable, unambiguous, attributable and easy to cite; track qualified assistant referrals if analytics allows and avoid claims about 'AI ranking'. Do not add unverified llms.txt, FAQ stuffing or AI-only pages simply for supposed visibility. Validate whether assistants can access public, relevant content, and respect crawler/access policy. Use documentation from search providers before changing technical controls.

### T13: Conversion measurement
Separate impressions/clicks, branded referral validation, contact clicks, accepted form submissions, qualified enquiries, projects and revenue. Don't record a lead until the receiving service confirms success. Keep names, messages, health details, email and phone out of GA4. Test privacy consent and analytics configuration; do not change clinical information to boost conversions. See measurement-authority.md.

## Quality gates and prioritisation
Fix release blockers/incorrect indexation/broken enquiry/irrelevant redirects/security first; then verified commercial relevance and technical failures; then content gaps with distinct search intent; then earned authority and experiments. Before every significant edit: baseline, rationale, expected effect, safeguards and rollback. After: rendered crawl, link/asset/schema checks, affected browser tests, log. No ranking promises, word-count quotas or raw content-production targets.
