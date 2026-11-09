# 9 November 2026 — Production indexability safety fix

## Incident and evidence
The owner captured live homepage HTML for `https://elderindex.co.uk/` containing `<meta name="robots" content="noindex, follow">`. That prevents Google indexing the approved homepage. Source: owner-provided live HTML, 9 November. No live `X-Robots-Tag` header output was supplied, so it must be verified separately. Historical Search Console impressions began declining before the late-October cutover: do not attribute the entire history to this incident.

## Baseline and root cause
Baseline source SHA: `6cbb3c5c255ec51f42805f3194a00d20bff32e92`, branch `main`. The code set `config.production = (SITE_ENV === 'production')`. As a result, a plain `npm run build` with no `SITE_ENV` created an implicit staging build (`noindex` in HTML and global `_headers`). The public site evidently served HTML from a noindex build, but the specific Cloudflare project/build command/account settings cannot be confirmed from source alone.

## Remediation — SEO standard T01
- Treat an omitted `SITE_ENV` as `production` so the default `npm run build` generates indexable HTML, no global `noindex` header, and an apex canonical sitemap.
- Make deliberate staging explicit: `npm run build:staging` and corresponding check commands remain `noindex`.
- Preserve `noindex` for legal and fictional concept pages in *both* build modes; no SEO copy/URL/canonical changes.
- Run CI staging tests explicitly under staging mode, then build once with the exact plain `npm run build` path and reject noindex markup/headers. Restore staging for non-public build artefacts. Add a unit test verifying missing/explicit environment semantics.

## Verification and publication state
Code changes must pass the GitHub quality workflow for the final commit SHA. Do not claim a running deployment or reindexing on the strength of a commit or CI check alone. **Public deployment state: NOT VERIFIED** until the live homepage and commercial services are checked for `<meta name="robots" content="index, follow">` and absence of `X-Robots-Tag: noindex`, plus correct canonical/robots/sitemap. If they still show `noindex`, inspect the actual Cloudflare build command/environment and public domain binding.

## Expected effect and recovery
Restores crawl eligibility on approved public pages once the corrected build is deployed and served; it does not guarantee rankings, immediate reindexing or reverse the pre-existing September decline. Rollback: revert the code/CI changes to this commit, but **do not re-deploy the old noindex build to production**; instead deploy a verified indexable production artefact. Explicit staging/noindex output is retained for private previews.
