# Internal linking and contextual commercial cross-selling

Applies permanently to future SEO audits and content changes. Read `strategy.md` first for commercial priorities and the current page-intent map.

## The decision for every proposed link

Identify the problem discussed in the source paragraph, the reader's likely next question and the destination that answers it. A complementary service belongs there only if the paragraph explains why it could help. Prefer an existing relevant phrase or one short explanation over a new sales section.

Design and management receive greater commercial priority where relevant. The destination must still fit the topic: do not insert a redesign pitch into an unrelated explanation of regulator records or replace a local SEO answer with general agency copy. A useful directory or SEO route remains useful even when it is not the highest-priority service commercially.

## Linking principles

1. Introduce complementary services naturally within relevant explanations.
2. Explain the benefit: a clearer enquiry journey, a suitable site structure, approved updates, genuine local discovery or consistent information. Do not promise unverified results.
3. Use descriptive, varied anchors that accurately identify the destination. Audience-specific anchors may point to the same combined design page.
4. Avoid forced links, repeated same-destination prose links and lists of every service. There is no minimum number of links to add per page.
5. Preserve the page's primary keyword, audience and search intent. Main titles/headings are not cross-selling slots by default.
6. Preserve existing valuable links and established URLs. Explain and log any intentional removal; do not delete footer, related-reading or enquiry links just because an equivalent prose route exists.
7. Give informational readers a logical route to the relevant commercial service while continuing to answer the informational question.
8. Prioritise design and management enquiries where the visitor's problem supports those services. Maintain direct enquiry options for SEO buyers as well.

## Illustrative relationships, not a closed map

| Source context | Complementary destination | Why the link can help |
| --- | --- | --- |
| Care Home SEO discusses confusing individual-home pages or enquiry routing | Website Design, with an anchor such as “care home website design” | Explains how a structural limitation could be addressed without assuming every home needs a rebuild |
| Home Care SEO discusses an unsuitable service/coverage structure | Website Design, using home-care wording | Connects the specific limitation to an appropriate design scope |
| Design discusses handover, changing team details or care information | Website Management | Gives a practical route to keeping the approved site current after launch |
| Management identifies platform limits that routine updates cannot solve | Website Design | Helps a visitor compare maintenance with a justified redesign |
| Search Visibility discusses technical site limitations or stale service information | Design or Management respectively | Links the actual problem to implementation rather than offering a generic bundle |
| Directory work discusses keeping approved facts aligned | Website Management | Coordinates the first-party pages with profile updates |
| A guide discusses local SEO implementation | Relevant specialist or umbrella SEO service | Offers help with applying the guidance, retaining informational intent |
| A directory/profile guide discusses a confusing website destination | Website Design | Explains why sending more visitors to an unusable page may not solve the issue |
| Branch/service-area content discusses ongoing factual changes | Website Management | Connects agreed operational changes to maintaining accurate pages |
| Audience pages already describe several services | Relevant service pages | Helps a provider compare the services without returning to the hub |

These examples do not prescribe adding both design and management links everywhere. Additional opportunities must be justified by actual content, user intent, relevance and commercial value. Leave already adequate connections alone.

## Evaluate the whole customer journey

- **TOFU:** useful guides answer the searcher's question; contextual links lead to a related guide or implementation service when helpful.
- **MOFU:** audience, about and service-hub pages help a provider compare needs and approaches.
- **BOFU:** every commercial service keeps a direct route to enquiry and explains the next step. Complementary services remain optional.
- Visitors can enter at any point, including directly on a service. Do not funnel every SEO buyer through Design or require a guide before contacting ElderIndex.

Review the header, cards, footer, related-service blocks, prose and enquiry routes separately. Reordering an existing service list may improve commercial emphasis without changing page targeting. Preserve navigation to SEO services and guides.

## Repeatable audit workflow

1. Read `AGENTS.md`, this document, `strategy.md` and the activity log. Check the working tree and preserve the user's changes.
2. Build and capture a baseline before editing:

   ```bash
   npm run build
   npm run audit:links -- --output /tmp/elderindex-links-before.json
   ```

3. Review all generated pages for missing contextual links, weak commercial destinations, orphans/unreachable pages, repetitive links, guide-to-service routes and direct commercial enquiry paths. Inspect actual copy rather than relying only on counts.
4. Produce a prioritised plan. Record an explicit content reason for each proposed complementary service. Preserve the current architecture and intent unless the approved scope says otherwise.
5. Implement small edits or links to existing phrases. Do not generate a new page or repeated sales block merely to create more links.
6. Build and compare:

   ```bash
   npm run build
   npm run check
   npm run audit:links -- --compare /tmp/elderindex-links-before.json --output /tmp/elderindex-links-after.json
   npm test
   ```

7. Inspect additions for benefit-led copy and natural anchors. Review any removed links or changed metadata from the comparison. Test the affected desktop/mobile journeys, table/contents anchors and forms. Verify every guide can reach a relevant service and every commercial page can reach the enquiry page directly.
8. Save the findings, before/after evidence, validation and publication status in `docs/seo/activity-log.md`. Update article modification dates only for real changes; keep publication dates genuine.
9. Leave the diff local for review. Do not push to `main` or deploy without an explicit publication instruction.

The audit reads `dist/`, never a remote site. It also reports the generated 404 utility page separately from the canonical-page graph, so an intentional error page is not incorrectly flagged as an orphan. It classifies **contextual** links as prose/list links within editorial/service sections; header/footer/breadcrumb/contents links, sidebars, cards and CTAs are separate. “Contextual referring pages” counts distinct other source pages. A footer link on every page is not evidence of strong contextual support. Same-target links in prose and a helpful related-services block are not automatically wasteful.

The script reports broken internal destinations, orphan/unreachable pages, pages without main-content inbound links, repeated prose pairs, inbound sources and page metadata. Legal pages can intentionally depend on the footer. Automated evidence supports editorial judgement; it does not determine relevance, prove live rankings or replace checking authorised Search Console/enquiry data.
