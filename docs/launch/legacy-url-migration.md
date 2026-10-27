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
