# SEO measurement, experimentation, authority and operations
Version 1.0 | 27 October 2026.

## Measurement tiers
A: Discoverability — GSC indexed URL status, impressions, clicks, CTR, query, page, search appearance, country, device and appropriate brand/non-brand group. Average position is an aggregate, not a stable individual rank.
B: Behaviour — relevant landing page -> qualified next step; contact clicks, user-requested forms, button journeys, Web Vitals. GA4 only after documented consent, configured G- ID and verified privacy disclosure.
C: Outcomes — successful form acceptance, actual inbox delivery, qualified leads, proposals, contracts and revenue; this needs human CRM classification and cannot be inferred from a click.
D: Reputation/authority — earned referencing pages/domains, direct brand mentions, relevant directory completeness, genuine industry citations and any verifiable assistant-referral traffic. Never equate link count with ranking.

## Baseline and time window
Before domain cutover archive old-site GSC date range and top URLs, current redirect status, canonical host, known brand vs non-brand demand and current live date. Label gaps in historical data. On production release annotate exact UTC cutover, SHA, affected URLs and consent/analytics configuration. Review D+1 (technical), D+7 (index/redirect), D+28 (query/page patterns), D+90 (commercial trends); dates are CHECKPOINTS not assumptions of when Google has responded.
Always compare equal date ranges, query/page/device/country, differing impressions, seasonal and competitor trends. If substantial changes overlap, attribute cautiously; never claim causality without appropriate evidence.

## Experiments
Hypothesis -> baseline -> target URL(s) and target query set -> change isolation where practical -> intended positive/negative signals -> launch annotation -> predeclared observation window -> outcome and confounders -> KEEP/ITERATE/REVERT recommendation. No mass title changes solely based on short-term position noise. Require an opportunity statement and relevant page intent for any new content work.

## Cadence
When enabled: daily monitoring for critical 5xx/404/indexability/form issues after launch; weekly technical and GSC sanity check; monthly intent/topic/lead review; quarterly strategy and authority review. Monitoring cannot be claimed automated without deployed jobs, app access and alerting. Missing GSC or GA4 access should produce one well-defined owner setup task, not fabricated data.

## Authority and ethical promotion
Codex can identify genuine relevant UK care-sector and marketing publishers, analyse brand link mentions, research potential partnerships, propose useful original resources and prepare outreach drafts. Contacting people, purchases, co-marketing commitments or publication on third-party sites require owner approval. Never pay for ranking links, use PBNs, exchange networks, unrequested comment spam or AI-scale scraped directories. If sponsorship/paid placements exist, apply proper link attributes and disclosure.

## AI referrals
Only analyse assistant referral sessions/conversions when GA4 and other available first-party evidence exists; define grouping method and limitations. No proof of 'AI SEO' rankings from anecdotal appearances. Consider search engines and AI assistants as discovery channels fed by authentic public content.

## Reporting format
Weekly or upon request: release ID, URL-specific changes, source/commit and true deployed timestamp; gate failures; GSC page/query segment (with dates and caveats), verified enquiry outcomes, unanswered questions and recommended next action with confidence. Escalate substantive strategy changes, not routine healthy fluctuations.
