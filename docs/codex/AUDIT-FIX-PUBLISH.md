# ElderIndex — the routine Codex job
**This is the standard instruction whenever Josh says "audit against the framework and fix it."** It is an execution task, not a request for a plan or a pre-publication review.

## Mission
Use `main` as the source of truth. The owner and ChatGPT have already defined business/SEO/marketing/editorial standards in `docs/ops/autonomous-publishing.md`, `docs/ops/decision-rights.md`, `docs/seo/strategy.md`, `docs/seo/seo-standard.md`, `docs/seo/research-entity-map.md`, `docs/seo/internal-linking.md`, `docs/seo/editorial-policy.md` and `docs/seo/measurement-authority.md`.

Your job is to independently bring the website into conformity, not to ask for permission already granted by those documents.

## Mandatory workflow
1. Fetch latest `main`. Identify what environment serves the actual public domain and the last verified live release; distinguish initial pre-cutover stage from post-cutover. Never assume the site is live from a Git commit.
2. Audit rendered URLs, site links/keyword ownership, content evidence, titles/descriptions, canonical/indexing, schema/entities, business offers, care accuracy, page speed, accessibility, enquiry journeys, images, redirects and content freshness against approved frameworks. Use public/live evidence and first-party GSC only where legitimately available. Prioritise real defects and high-impact commercial relevance before cosmetic optimisations.
3. For each gap, classify: approved, factually supported and reversible -> IMPLEMENT automatically; uncertain -> investigate and use conservative default; excluded legal/spending/security/first cutover -> one concise exception report. Do NOT ask for a routine PR or owner review of a framework-compliant change. Do not mass-rewrite good content without evidence.
4. Make edits directly on `main` if account and branch settings permit, or use the shortest path the environment allows; do not intentionally introduce a separate approval gate. Run checks `npm run build`, `npm run check`, `npm run audit:links -- --output /tmp/elderindex-links.json`, `npm test`, production variant/release validation and affected local browser checks. Failed mandatory tests -> diagnose/fix before pushing.
5. Record each material edit or coherent batch in `docs/changes/YYYY-MM-DD-<topic>.md` with target query, rule, URL, why, before/after, expected effect, tests, source SHA, revert procedure, and distinguish proposed/committed/deployed/live-verified timestamps. Append index entry to `docs/seo/activity-log.md`.
6. Commit and PUSH framework-compliant work to `main`. Use configured deployment pipeline; diagnose build failures if accessible. Verify deployed revision and changed content via actual published host and HTTP status/headers, not just CI or screenshots. Then append exact **LIVE URL + UTC first verified active time** to the change record and, if live verified, add one line in `docs/changes/live-deployment-ledger.csv`. If failed, update record `NOT LIVE` and don't add a fictitious live entry. This logging itself may require a subsequent commit and cannot retroactively alter the earlier observed time.
7. Return one concise summary AFTER work: fixes published and verified live, tests, logged commits/URLs/timestamps, anything committed-but-not-live (with reason), genuinely blocked actions, recommended next highest-value work. Do not repeatedly interrupt Josh.

## Initial domain transition
The old public ElderIndex website must remain online until Josh specifically authorises switching its domain/hosting. Before first cutover, main code can be updated and checks run; record only a staging deployment when verified. Do not declare main-domain LIVE for replacement content. After owner confirms initial cutover, the standing automatic publish workflow above applies to routine framework-compliant changes.

## Permission/runtime limits
If Codex tool runner requires interactive command consent, repository policy cannot override that security mechanism. Batch operations and use approved auto-review settings if offered; do not try to bypass security. Work on other tasks while account-only actions remain blocked.

## Definition of done
Not "opened a PR", not "committed to a review branch", not "CI green". Done for an authorised live change means ACTUAL PUBLIC CONTENT CHANGED and VERIFIED plus dated footprint. Otherwise state accurately: BUILT, COMMITTED, DEPLOYED TO STAGING or NOT LIVE.
