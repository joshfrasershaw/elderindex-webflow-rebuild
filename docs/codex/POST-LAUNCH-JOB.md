# CODEX JOB: post-cutover verification and ongoing self-directed SEO
Use only after Josh has confirmed which site is live and the observed domain_cutover_at UTC. Do not use this job to initiate DNS changes.

Read AGENTS.md and all authoritative policies in docs/ops, docs/launch and docs/seo. Check deployed version against documented release SHA, old/new redirects, canonical, meta robots and X-Robots-Tag, sitemap, 404, forms, images, SSL, navigation, consent and (where account access exists) Search Console and GA4. Record passes with evidence; don't invent production status or third-party access.

Automatically correct deterministic, low-risk divergences only within delegated authority; if autonomous-production publishing is NOT explicitly enabled, prepare one tested PR rather than merging main. Every meaningful change needs a docs/changes record and activity-log entry, source SHA, actual live timestamp and rollback. Maintain the old site's search baseline and query migration tracking.

Create an operational cadence recommendation: D+1 technical, D+7 indexation, D+28 keyword/page intent and D+90 commercial. Establish automation only when credentials, execution schedule and explicit monitoring authority exist; never claim to work unattended merely because a markdown file proposes it. Prioritise critical enquiry/index failures over fresh content. Surface owner questions only for genuine framework gaps, legal/account blockers or meaningful strategic choices.
