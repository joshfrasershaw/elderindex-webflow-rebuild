# Legacy URL mapping and migration procedure
Version 1.0 | 27 October 2026.

The prior ElderIndex site is still public. Do not switch the live domain on the assumption that the 11 legacy shortcut pairs in scripts/build.mjs cover it. Need current old-site sitemap/crawl plus Search Console URLs, top landing pages, historic links, www and non-www requests and any directory backlinks.

## Candidate investigation list — NEVER label verified until checked
| Legacy path from previous public review | New target candidate | Current disposition |
| --- | --- | --- |
| /services/care-homes | /services/care-home-seo/ | VERIFY intent and old URL |
| /services/home-care | /services/home-care/ | VERIFY old URL and intent |
| /services/care-groups | /services/care-home-seo/ | VERIFY; may need different page |
| /resources | /guides/ | VERIFY |
| /framework | none presumed | REVIEW actual content before mapping |
| /directory-guides/carehome-co-uk | /guides/carehome-co-uk-profile/ | VERIFY |
These examples are NOT an exhaustive list or confirmed mapping. Preserve case, trailing slashes and historic URLs found from real site/GSC.

## Inventory table required
old_url | source(crawl/sitemap/GSC/backlink) | last_verified_utc | current_http_status | impression/click data if authorised | intent | destination_url | rationale | approval state | staging_test_status | production_test_status

Find content equivalents first, map once, prevent old URL becoming a redirect chain. If no comparable page exists, recommend keeping the content, a genuinely relevant category page, or an honest 404/410; do not route irrelevant pages to /. Keep redirects after migration and audit inbound links to old URLs where possible.

Cloudflare Workers Static Assets parses a dist/_redirects file, but rules do not apply to responses produced by custom Worker code. Check actual Worker router and Cloudflare routing. Test with real HTTP requests after deployment, not Python local static server. Explicitly test /, robots.txt, sitemap.xml, www/apex, mixed-case/encoded URL handling where applicable, and 404 headers. Never touch MX/SPF/DKIM/DMARC when moving the website.

Sources: Google Search Central site moves: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes ; Cloudflare Workers static redirects: https://developers.cloudflare.com/workers/static-assets/redirects/ .

## 27 October execution evidence and disposition

The [dated public inventory](evidence/old-public-inventory-2026-10-27.json) contains 58 observations / **57 unique paths**, obtained from the actual old sitemap index, `sitemap-0.xml` and same-origin links. All were observed HTTP 200. The live site uses www, unlike the replacement's default apex canonical. No GSC click/impression data or authenticated platform export was available; those fields remain null, not zero.

The [machine-readable migration map](legacy-url-map.json) records every path, source, verification time, status, title/intent, destination/rationale, review state and local/deployed validation boundary. Ten substantiated equivalents are implemented for review in `src/legacy-redirects.json`; seven paths keep the same role under normal HTML slash handling. The six candidate examples above are now either mapped or explicitly unresolved by that evidence. No arbitrary case-insensitive aliases or asset redirects are invented.

**Forty unresolved paths are a release blocker**, grouped for one owner review: five framework pages plus How It Works; four platform-specific directory guides; thirteen specialist resources; the glossary and fifteen glossary child routes; Cookie Settings. The latter needs a deliberate consent/settings route decision, not a silent redirect to an inaccurate draft. Some old source copy contains regulatory/ranking claims that must not be blindly republished. Use qualified/source review where retaining them, and GSC evidence before retiring valuable URLs.

Existing remote staging confirms old shortcut rules work on deployed Static Assets (301); the newly added old-site mappings are intentionally not deployed. Both local workerd variants passed all 42 rules (slash/no-slash) and query retention. Encoded/case variants are recorded in runtime evidence; no unsupported old case variants were assumed. Actual production custom-domain validation remains mandatory after an owner-authorised deployment. Do not use this mapping file as automatic authority to delete valuable content.

### Review correction: canonical slash migration

Local Cloudflare verification found implicit **307** redirects for `/about`, `/services`, `/services/home-care`, `/talk-to-us`, `/privacy` and `/terms`. These are now explicit **301** rules. Their slash variants are intentionally NOT generated as redirect sources: those are the canonical destination pages and must stay 200. Together with the ten equivalent-content mappings and 11 original shortcut pairs, the corrected build has 48 rules. The older “seven paths under normal HTML slash handling” evidence is superseded: only root stays unchanged; the other six require these permanent aliases.


### Current main implementation — 27 October 2026

The prior review-only and 40-unresolved descriptions above are historical. Main now implements nine more content-equivalent mappings and the independently verified `/contact` alias: 68 rules. All 40 former exceptions have a content-based disposition in `evidence/legacy-disposition-review-2026-10-27.json`. The inventory adds `/contact`, `/glossary/crawlability` and `/glossary/url-structure`, giving 60 paths. The latter two are existing 308 aliases of the glossary, not separate articles. There are 33 remaining retention/retirement decisions (31 former paths plus two glossary aliases). No valuable unmatched URL has been silently approved for deletion.

The owner-specified GSC window is 26 July–25 October 2026. The export did not arrive in this session; all metrics remain null pending actual file receipt. Do not infer zero demand. Existing `/services/home-care` remains a direct permanent redirect to the retained specialist canonical page. See the current go-live report for exact source/runtime/deployment evidence.
