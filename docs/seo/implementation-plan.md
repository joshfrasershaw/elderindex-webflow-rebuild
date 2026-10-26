# Commercial internal-linking implementation plan

Date: 26 October 2026. Baseline: `b405cd0`. Status: implemented and validated locally; reviewed and approved by the owner, with explicit authorisation to publish to `main`. Cloudflare deployment verification is pending. This plan applies to the existing 22-page architecture.

## Audit findings

The rendered-site audit covers all pages and classifies prose links separately from headers, footers, breadcrumbs, contents navigation, related-reading blocks and enquiry CTAs. Counts below are distinct *other pages* containing contextual prose links; they are diagnostic evidence, not ranking or revenue scores.

| Commercial destination | Contextual referring pages before |
| --- | ---: |
| Website Design | 1 |
| Website Management | 3 |
| Care Home SEO | 5 |
| Home Care SEO | 5 |
| Search Visibility | 2 |
| Directory Management | 4 |

- No orphan pages, unreachable pages or broken internal URLs were found.
- `/cookies/` and `/terms/` have footer discovery rather than main-body inbound links. This is intentional; do not add unrelated sales links to legal content.
- Specialist SEO pages explain website structure but do not link contextually to Website Design. Management links back to Design only through a related-services block.
- Both audience pages discuss design, SEO, profiles and ongoing updates with no contextual links to the corresponding commercial services.
- Several guides explain stale pages, branch changes or poor enquiry destinations without providing a relevant route to design or management.
- The navigation already lists design and management before search. The reusable service cards/footer instead place search second; align those cards and the footer with the commercial priorities.
- No repeated same-destination contextual pairs were found in the baseline. Some standard CTAs, footer links and related links repeat by design. Keep useful navigation and direct enquiry routes; do not delete them merely to reduce link counts.
- No Search Console query/ranking data or live search-result measurements were supplied. Protect known page intent and structural signals; do not claim verified ranking protection or uplift from a source-code audit alone.

## Prioritised implementation

| Priority | Work | Why / review criterion |
| --- | --- | --- |
| P0 | Capture baseline; retain the 22 routes, titles, descriptions, H1/H2 headings, canonicals, redirects and existing links. Leave work local for review. | Existing search intent and valuable journeys must survive. Publication is explicitly excluded. |
| P1 | Add contextual design routes from Care Home SEO, Home Care SEO, Search Visibility and Website Management. Add ongoing-management routes where repeated website updates are already discussed. | Support design/management enquiries at a relevant decision point; explain the specific benefit and never imply SEO requires a rebuild. |
| P1 | Strengthen Design → Management's existing explanation and link the existing Design search-discovery sentence to Search Visibility. Place management second in shared service cards/footer. | Present a coherent build → maintain → improve discovery journey without replacing any primary service CTA. |
| P2 | Link the two audience pages' existing service explanations to their relevant design, management, specialist SEO and directory destinations. | Help comparison-stage visitors choose an appropriate service without having to return to the hub. |
| P2 | Add selective links in the local SEO, directory comparison, Carehome.co.uk profile, Google Business Profile and multi-location guides where the existing issue calls for design or management. Add a relevant design/management connection to the founder's methodology explanation. | Informational pages retain their teaching purpose and SEO-service routes. Commercial pages remain accessible directly; the funnel is not mandatory. |
| P3 | Save permanent strategy, page-intent map, agent instructions, reproducible audit tooling, before/after evidence and an SEO activity entry. | Future audits must consider cross-selling, measure placement rather than raw link totals, and record meaningful changes. |

## Placement decisions

- **Care Home SEO:** add a design option to the existing home-page structure explanation; keep care-specific SEO and current management links.
- **Home Care SEO:** explain design help if the platform cannot support clear service/coverage/enquiry pages; link management where actual coverage changes need approved updates.
- **Website Design:** retain the management link and explain what ongoing updates address; turn the existing search-service reference into a relevant link.
- **Website Management:** link design only when the existing platform has structural limitations that maintenance cannot reasonably solve.
- **Search Visibility:** link design in the technical-site discussion and management in the content-maintenance discussion, not as a replacement for SEO.
- **Directory Management:** connect approved website changes to ongoing site management.
- **Audience pages:** link the services already described, using care-home/home-care-specific anchors and explaining the relationship to the reader's need.
- **Local SEO guide:** management for changing service/coverage information; retain SEO implementation links.
- **Directory comparison guide:** design where the destination website cannot explain care or support a clear enquiry.
- **Carehome.co.uk profile guide:** management to synchronise approved website changes with a profile review.
- **Google Business Profile guide:** design for a poor website destination; retain local-profile guidance and the SEO/directory service routes.
- **Multi-location guide:** management for agreed branch updates; design only when the existing platform cannot support the planned structure.
- **Care website guide:** its current Design/Management/SEO links and design next step already work; do not add redundant links.
- **About:** connect the operational perspective to useful website design and keeping information accurate, preserving the existing SEO methodology links.

## Validation and publication boundary

Run the generated-site checks and the repeatable link audit, compare before/after destinations and metadata, and run the existing browser suite. Confirm each guide has a relevant commercial next step and every commercial/audience page keeps a direct enquiry route. Inspect additions for benefit-led copy, descriptive varied anchors and unnecessary repeated destinations. Do not interpret an arbitrary link quota as the goal.

The changes were left uncommitted and unpushed for review. The owner has since explicitly authorised committing and pushing this reviewed change to `main`. Pushing `main` triggers Cloudflare; later SEO work still requires its own publication instruction.

## Implementation outcome

All planned priorities are complete in the local review draft. The [full audit](audit-2026-10-26.md) records all 24 added contextual links across 14 pages, retained links/metadata and before/after coverage. Website Design rises from 1 to 11 contextual referring pages; Management from 3 to 12. All 22 page checks and 13 browser tests pass. The owner subsequently authorised committing and pushing the reviewed change. Cloudflare completion is a separate verification step.
