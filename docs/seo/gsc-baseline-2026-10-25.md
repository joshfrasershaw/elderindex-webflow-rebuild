# First-party pre-cutover baseline: 26 July–25 October 2026

Source: owner's `27.10.26.zip`, SHA-256 `a74c82039fe247b6bce40d4d3cfdd7fc145dd77235579c89a0b147394bb451da`. Original CSVs retained in `docs/launch/evidence/gsc-2026-07-26-to-2026-10-25/`. Filters say Web (text-based), Last 3 months; Chart.csv establishes 92 daily rows from 26 July to 25 October inclusive.

**Site chart: 4 clicks, 5,223 impressions.** Pages.csv has 23 URL rows summing to 4 clicks and 5,935 impressions. These are different aggregations; do not replace the site total with the page-row sum. Query export has no clicked query rows despite four site clicks; do not invent their query attribution. Queries, Pages, Countries and Devices are separate dimensions, not a joined dataset.

| Reported landing page | Clicks | Impressions | Reported average position | Migration treatment |
| --- | ---: | ---: | ---: | --- |
| www `/services/home-care` | 3 | 2,876 | 25.74 | Retain specialist canonical `/services/home-care/`; permanent direct alias, unchanged rendered HTML |
| www `/directory-guides` | 1 | 574 | 49.47 | Existing direct 301 to substantive directory comparison; original topics retained/expanded |
| www `/glossary` | 0 | 1,749 | 32.89 | Retain `/glossary/`, all 97 fragment IDs and useful explanations; consolidate aliases directly |
| www `/framework` | 0 | 198 | 70.41 | Retain methodology root; consolidate four closely related pillars into substantive sections |
| www `/resources` | 0 | 187 | 63.94 | Guides hub now includes retained specialist resources and references |
| www `/how-it-works` | 0 | 54 | 13.17 | Existing equivalent process on Search Visibility retained; no ranking/turnaround promises copied |
| www `/resources/carehome-co-uk-ranking-explained` | 0 | 50 | 7.78 | Direct equivalent profile guide; separate apex row has 8 impressions, position 7.5 |
| www `/framework/credible` | 0 | 33 | 11.36 | Credible section on retained framework |
| www `/framework/authority` | 0 | 23 | 29.52 | Authority section on retained framework |
| www `/framework/relevance` | 0 | 18 | 9.11 | Relevance section on retained framework |
| www `/framework/effective` | 0 | 10 | 11.9 | Effective section on retained framework |
| www `/glossary/scie` | 0 | 20 | 18.2 | Existing glossary alias; retain glossary/SCIE fragment; separate apex row has 1 impression, position 1 |
| www `/contact` | 0 | 2 | 4 | Existing old 308 alias independently verified; direct new 301 to enquiry canonical |
| apex `/glossary/crawlability` | 0 | 1 | 6 | Existing old 308 to glossary independently verified; direct new 301 to retained glossary |
| www `/glossary/url-structure` | 0 | 1 | 16 | Same alias treatment; URL Structure fragment retained |

The complete URL-row match, including other pages and exact original host spellings, lives in `docs/launch/legacy-url-map.json`. Metrics on a path with both hosts are explicitly summed URL rows, not deduplicated people or site impressions. Paths absent from the export have **null metrics / NOT_IN_EXPORT**, not zero.

## Search intent and commercial ownership

Home-care query families show meaningful existing relevance: `seo for home care` 546 impressions, `home care seo` 434, `homecare seo` 416 and `seo for homecare` 403. These support protecting the existing specialist Home Care SEO intent, not replacing it with design copy. Their exact page attribution is unavailable from these separate exports. Care-home/nursing query families retain Care Home SEO ownership. Directory comparison queries support the existing comparison page; no new platform-specific keyword clones are required.

Website Design remains commercial priority one, Management two, SEO/local/directory three. Do not use this SEO-heavy historical dataset to overturn the agreed offer, create irrelevant aged-care/consumer-location pages, invent forecast rankings or rewrite otherwise appropriate service copy. Average position is a historical aggregate across the supplied context, not today's fixed rank.

Glossary and CARE methodology have distinct informational/methodological roles and now provide relevant routes to services without competing as commercial landing pages. Six useful specialist resources are retained at existing paths with corrected provider-facing marketing guidance; missing rows are not evidence that their content or backlinks have no value. No backlink export was supplied; no zero-backlink assertion or irreversible retirement follows from this data.

## Measurement after cutover

Record actual domain-switch UTC, release SHA and affected URLs. Compare equivalent windows and matching page/query/device/country/brand segments at D+7, D+28 and D+90, alongside verified enquiry quality. Do not claim a ranking gain from a commit, a redirected URL or the baseline's small click total. Preserve the raw pre-launch files for reproducible comparison.
