# Commercial SEO implementation review — 26 October 2026

**Status: reviewed; owner explicitly authorised committing and pushing this patch to repository `main`. Cloudflare deployment completion remains unverified. No DNS or Access changes.** Scope is the main Webflow rebuild, not the CMS. Branch: `review/commercial-seo-2026-10-26`, based on `origin/main` at `0a80960`. The checkout had been on the CMS feature branch; a local review branch from the main-site baseline avoids including that work. Existing unrelated untracked files are left alone.

The supplied audit is reference material, not independently verified research. The supplied implementation prompt provides the requested patch scope and editorial direction; its assumption that a local `main` branch already existed did not match this checkout. The implementation uses the existing remote-tracking main baseline. The supplied founder observations are attributed as experience, not research statistics or client results.

## Priorities and implemented decisions

1. **P0, Design:** retain the combined commercial page, title and H1; replace generic opening sections with operator-specific decisions, authentic imagery and language, provider approval, realistic project scope and enquiry testing. Separate single-home, group and home-care needs in one useful section. Consolidate the existing complementary links into one optional after-launch explanation.
2. **P0, Care Home SEO:** keep the specialist title, H1, examples, audit method and enquiry routes. Add one reporting paragraph distinguishing recommendation/brand validation from discovery and contact actions from suitable admissions.
3. **P1, Management:** make maintenance explicit in the introduction and description, clarify approval and technical scope, handover and separately commissioned SEO. Add one justified directory-management link where approved facts must stay aligned.
4. **P1, Guide and About:** expand the existing care-website guide's procurement, photography and upkeep questions; make the buyer audience explicit. Refine About's existing discovery paragraph to show how actual care experience changes the brief.
5. **P1, Schema and checks:** replace generic primary-image claims with images actually rendered in the page, or omit when there is no appropriate page image. Add reciprocal WebPage → Service/Article subjects and clear service types. Keep organisation, author and entity IDs stable.
6. **P2, defer new pages:** no new guides or exact-match service pages. Independent search intent for extra photography/maintenance guides has not been verified. The existing design guide can carry those practical questions now. Reassess with real search/query evidence after launch.

## Query intent and complete route review

These are intended query families, not measured search volumes or confirmed positions. Every route's rendered title, description, headings, canonical, robots, schema and placement-aware internal links is recorded in the evidence files linked below.

| Route | Primary intent / cluster | Secondary relationship and review decision |
| --- | --- | --- |
| `/` | Broad care-sector web design, management and SEO / brand | Existing founder perspective and service order are adequate; keep title/H1/copy. Immediate enquiry remains. |
| `/services/` | Compare care digital services | Existing Design → Management → Search order, specialist cards and audience choices remain. No need for another cross-selling component. |
| `/services/website-design/` | Care home website design; web design for care homes; home care website design / web design | One commercial intent with genuinely different provider structures explained inside the page. Optional management and SEO remain separate. |
| `/services/website-management/` | Care home / home care website management and website maintenance | Clarify approved updates, platform-dependent upkeep and ownership; retain conditional redesign route; link to directory coordination. |
| `/services/care-home-seo/` | Care home SEO / search engine optimisation; residential and nursing homes | Preserve substantive specialist content; small measurement clarification only. Existing design/management routes remain. |
| `/services/home-care/` | Home care SEO / domiciliary care SEO | Keep established URL, real-office versus coverage distinction, methods, reporting and both guide paths unchanged. |
| `/services/search-visibility/` | Broad care SEO / local search service exploration | Overview directs to both specialist services; preserve intent and conditional implementation links. |
| `/services/care-directory-management/` | Care directory / profile management | Keep platform-independent scope and access/fee limitations. Management is complementary, not automatically included. |
| `/for-care-homes/` | Care-home operator evaluating digital support | Audience overview links to distinct services; do not duplicate design or SEO landing pages. |
| `/for-home-care-agencies/` | Domiciliary / live-in agency evaluating digital support | Keep coverage-oriented overview; no cosmetic URL or keyword-page creation. |
| `/about/` | Evaluate founder and agency credibility | Refine discovery questions; retain pre-revenue honesty, first-name-only Josh, genuine career versus agency-results distinction. |
| `/guides/` | Find provider-facing website/search/directory advice | All six cards remain accessible. Existing guide navigation is sufficient; no additional image placements or duplicate grid needed. |
| `/guides/choosing-a-care-website/` | Commission or improve a care website; preparation and proposal checklist | Expand buying guidance, real imagery, consent, people profiles, ownership and post-launch questions. Retain all design, management, SEO and profile links. |
| `/guides/home-care-local-seo/` | Basic service-area / local SEO planning | Keep Search Console mapping, useful town pages, specialist SEO and optional management routes. |
| `/guides/multi-location-home-care-seo/` | Advanced branches / coverage architecture | Keep distinct multi-office examples, migration and branch responsibility. Not a duplicate basic local guide. |
| `/guides/care-directory-comparison/` | Evaluate directory fit and commercial questions | Keep caveats and official platform links; no newly verified vendor terms or prices claimed. |
| `/guides/carehome-co-uk-profile/` | Improve one platform's factual profile | Preserve profile checklist, responsible reviews and directory/care-home SEO/maintenance paths. |
| `/guides/google-business-profile-care/` | Eligible, accurate business profiles | Preserve real-location versus service-area caveats and official Google source links. No new listings or eligibility claims. |
| `/talk-to-us/` | Direct commercial enquiry | Existing service selections, form validation and direct email remain; no additional qualification barrier. |
| `/privacy/` | Draft data transparency | No copy changes; stays noindex and requires legal review. |
| `/terms/` | Draft website terms | No copy changes; footer access and noindex intentional. |
| `/cookies/` | Draft technology / consent explanation | No copy changes; noindex and consent controls remain. |

“Care home websites” could mean finding actual homes, not commissioning design. “Home care web management” could refer to operational software. Live UK search access was blocked, so neither is assigned a standalone page or used as the sole primary target. No query volumes or difficulty scores are invented. The combined design page is retained because the buyer action is the same and the existing architecture can explain both audiences; splitting would currently duplicate scope without demonstrated need.

## Research provenance and limitations

Access attempted on **26 October 2026** to every competitor below, Google's structured-data documentation and UK-parameter Google searches for the two ambiguous phrases. Every request failed at this environment's network proxy with `Tunnel connection failed: 403 Forbidden`, including an escalated read attempt. This is not evidence that those websites are broken. There are **no freshly observed competitor pages or verified SERP positions** from this run. The following observations come solely from the supplied audit and should be rechecked before relying on changing prices, offerings or terms.

| Supplied reference | Supplied observation / review question |
| --- | --- |
| https://www.podiumdesign.co.uk/services/care-home-website-design | Sector specificity, deliverables and buying questions. Does our page explain a tangible scope? |
| https://heritagecarepartners.com/care-home-websites | Handover and ongoing terms. Are our options clear without copying packages or prices? |
| https://carebrand.co.uk/website-design/ | Credibility, recruitment and enquiries. Show what care experience changes rather than repeat a generic trust slogan. |
| https://lottie-media.com/care-home-websites/ | Imagery and practical features. Explain genuine provider assets without pretending to own client projects. |
| https://www.splitpixel.co.uk/carehome-medical-website-design-agency/ | Identifiable sector work. ElderIndex cannot substitute illustrative concepts for a portfolio. |
| https://carehomeseo.com/ | Specialist audit and process clarity. Existing care-home SEO content already supplies substantial detail. |
| https://www.trgdigital.co.uk/care-homes | Sector architecture. Preserve audience versus service roles. |
| https://truecaresites.co.uk/pricing/ | Build versus upkeep comparison. Explain scope; do not invent our own fees or SLAs. |

Google reference reading supplied with the brief: [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [title links](https://developers.google.com/search/docs/appearance/title-link). No claim of fresh live verification of these sources, directory package features or Google rich-result eligibility is made.

## Metadata decisions: proposal to final implementation

The rendered baseline includes `src/editorial.mjs` overrides. In particular Home is **Web Design & SEO for Care Homes and Home Care Agencies | ElderIndex** and Care Home SEO is **Care Home SEO | Residential & Nursing Homes | ElderIndex**, not the base-object titles. Both remain unchanged. All H1s and canonicals remain unchanged.

| Page | Before | Proposed and final | Reason |
| --- | --- | --- | --- |
| Design title | Care Home & Home Care Website Design \| ElderIndex | Retained | Already directly expresses both commercial audiences. |
| Design description | Professional website design and redesign for care homes and home care agencies. Clear, accessible websites that help families find the right information. | Care home and home care website design informed by real care-sector experience. Clear care information, authentic imagery and welcoming enquiry journeys. | Specific process/experience with no client-result promise. |
| Management title | Website Management for Care Providers \| ElderIndex | Website Management for Care Homes & Agencies \| ElderIndex | Clarifies operator audience; maintenance remains natural in the intro/body. |
| Management description | Keep your care website secure, accurate and up to date. ElderIndex provides ongoing maintenance, content updates and practical website support. | Website management and maintenance for care homes and home care agencies. Agree approved content updates, platform upkeep and clear responsibilities. | Replaces broad security implication with scoped, concrete work. |
| Website guide title | What Makes a Good Care Home Website? \| ElderIndex | Retained | Existing informational role remains useful. |
| Website guide description | Discover what care home websites need to help families find information, build trust and make enquiries, from accessibility to content and design. | Commissioning a care home website? A practical checklist for your brief, photography, accessibility, enquiry routes, handover and ongoing website care. | Makes the provider/buyer audience and practical value explicit. |

All remaining page titles and descriptions are retained. Search engines can rewrite snippets; character counts are not a promise of display.

## Material page changes: review excerpts

**Design** — Before: “Beautiful, accessible websites that explain your care, reassure families and make the next step easier.” After: “Website design and redesign for care homes and home care agencies, shaped by real care-sector experience.” The new opening attributes referral/validation observations to Josh and explains concrete content priorities. The single-home/group/agency section replaces a brief two-audience comparison. Real photographs, approved people profiles, provider language, factual fee/funding boundaries and enquiry testing replace generic project filler. One final section explains handover, optional management and optional SEO using the existing links.

**Management** — Before: “Ongoing updates, monitoring and support so your care website stays useful and accurate after launch.” After: “Website management and maintenance for care homes and home care agencies: approved content updates and practical upkeep, with scope and responsibilities agreed around your site.” The revised copy distinguishes routine maintenance from a separately agreed search campaign, names the provider's approver and retains platform-dependent security/backup terms. New contextual anchor: “directory updates”, explaining how approved facts can be coordinated.

**Care Home SEO** — Before reporting already covered home-level queries, contact routes and capacity/fees/operations caveats. Added: “A family may already know the home through a professional referral, recommendation or directory. Separate branded searches and referral visits where attribution permits.” The new paragraph explicitly distinguishes a click/form from a suitable admission. No title, H1, example or service link changed.

**About** — Before: “We start with the provider’s real services, locations and priorities.” After: “We start with a conversation with the owner, director or nominated lead about real services, locations, wording preferences, photographs and permissions, and who responds to enquiries.” Existing honest career history and lack of established agency results remain; no invented staff, client work or full founder name.

**Website guide** — Before: “A practical checklist for making the first online experience clear, useful and reassuring for families.” After: “A practical checklist for care-home owners and teams commissioning or improving a website: what to prepare, what to ask a designer and what to check after launch.” New briefing checklist and expanded photography/proposal questions cover consent, replacement images, people profiles, costs, account ownership and handover. Existing `#part-1` through `#part-6` anchors remain; the new briefing section is appended as `#part-7` to preserve established deep links. Publication stays 25 October; modification advances to 26 October for a genuine revision.

## Selected topic graph and customer journeys

- Design commercial pillar ↔ practical website guide; the same guide also supports management/maintenance decisions, care-home SEO and accurate directory facts. No separate thin maintenance guide is needed for this patch.
- Design → optional Management or Search; Management → Design only for structural limits, Search for discovery, Directory Management for coordinated facts. All commercial entry pages retain immediate enquiry routes.
- Care Home SEO ↔ website/profile guides and directory comparison. Preserve specialist examples and optional implementation paths.
- Home Care SEO ↔ basic local guide + advanced multi-location guide; both retain profile guidance. Management handles approved updates, not invented service areas.
- Directory Management ↔ comparison + profile checklist + Google profile guide. Guide next steps remain tailored to the actual subject.

These are existing paths refined, not a new compulsory funnel. All six guides already had useful links. The link audit finds no orphans, broken routes or unreachable pages; Design and Management contextual referring-page counts remain 11 and 12. Directory Management gains one source (6 → 7). There are no repeated contextual source/destination pairs. The only added links are the new guide contents item and the explained management-to-directory link. No existing link, anchor, destination or placement is removed.

## Structured-data findings

The existing schema.org `@graph` is not proof of a Google Knowledge Graph entity or ranking advantage. Organization, Person, WebSite, WebPage, BreadcrumbList, Service and Article already exist; their stable `@id`s and founder/author/provider relations are preserved.

- `WebPage.mainEntity` now identifies the existing Service or Article entity, reciprocating `mainEntityOfPage` rather than adding speculative entity types.
- Six service names/types explicitly describe the visible service. Care Home SEO no longer gets a title-pipe fragment as its service type. Audience pages retain their broad service descriptions.
- Homepage and Design primary images are their approved uploaded concepts. Other applicable pages use their existing visible hero/interlude photo. Pages without an appropriate main image omit the property; Article no longer claims the generic social card as its article illustration. The branded card remains in Open Graph/Twitter metadata.
- No `sameAs` was added: no verified official profiles were supplied. No reviews, ratings, clients, awards, FAQ rich-result claims or proprietary authority scores were added. `Article.about` was left alone because reciprocal entity subjects already describe the document and no additional honest distinction was needed.

Local tests check schema JSON, required entity types, reciprocal subjects, unique IDs, service types, author IDs and actual rendered image presence. This is not a remote Schema.org validator or Google's Rich Results Test; Article image omission may reduce eligibility for image-dependent presentations, and no rich-result appearance is promised.

## Evidence, verification and remaining launch limits

Changed files: `src/editorial.mjs` contains the five page revisions and guide modification date; `src/seo.mjs` contains semantic/image corrections; `src/styles.css` darkens the small illustration labels; `tests/browser.spec.mjs` adds three focused tests. The strategy, linking instructions and activity log under `docs/seo/` record permanent guidance and publication state. This review and its two JSON evidence files are new documentation. No CMS, build configuration, redirect rules, public artwork or form implementation changed.

Machine-readable snapshots: [before](evidence/commercial-before-2026-10-26.json), [after](evidence/commercial-after-2026-10-26.json). These include every canonical page's final metadata, H1/H2, robots, schema and classified links. The comparison also includes health/inbound diagnostics. They are local rendered evidence, not a live crawl.

Validation results and commands are recorded in the dated [activity log](activity-log.md). Baseline: frozen dependency install, 22-page checks and all 13 existing browser tests passed. Final: all **16 browser tests passed**, including focused mobile optional-service journeys, all-page schema checks and expanded automated accessibility checks. The 22-page checks passed with zero issues in both staging and the local production variant; the build was restored to staging. No production environment setting was changed. Live redirect statuses, live performance, real inbox delivery, Google indexing and legal approval still require the existing launch checklist.

## After-launch measurement plan

Before launch, confirm authorised Search Console access and canonical property, production sitemap, real enquiry delivery and consent-aware tracking. Keep a dated change/deployment record. Do not enable production or add analytics credentials as part of this draft.

- **Baseline:** export query/page/date/country/device data for each intended cluster: Design (both care-home and home-care wording), Management/maintenance, Care Home SEO and Home Care SEO. Record existing impressions/clicks/CTR/position where available, brand versus non-brand, intended landing URL and any competing page. No historical data means an empty baseline, not invented values.
- **Indexing checks:** inspect production URLs and Google-selected versus declared canonicals; test legacy redirects/404, sitemap discovery, robots/noindex state and page rendering. Confirm legal drafts remain noindex. Monitor after publication rather than assuming a source check proves indexing.
- **Qualified enquiries:** track confirmed form acceptance and consented email/phone actions separately. Review selected service and qualification in the owner’s records; do not put names, addresses, messages or sensitive care information into GA4. A contact action is not a qualified lead or admission. Account for referrals and brand validation.
- **30 days:** verify indexing and query-to-page alignment, find surprising intent or competing URLs, check enquiry routes, distinguish branded changes from new discovery. Do not split pages on tiny samples.
- **60 days:** compare relevant queries and landing pages, CTR with impression mix/device/position context, and qualified design/management/SEO enquiries where attribution permits. Compare equal periods and prior-year seasonality if data exists.
- **90 days:** review useful commercial demand and enquiry quality alongside completed changes. Decide whether any distinct guide or landing page is justified. Note care capacity, fees, referral activity, seasonality, low volumes, consent gaps, search changes and attribution limits. Do not attribute every change to this patch or promise a rank/deadline.

No blocking editorial questions remain for this local implementation. Fresh competitor/UK SERP research, current vendor terms, live technical checks, legal review and measurement access remain external evidence gaps, not reasons to fabricate claims or delay justified content improvements.
