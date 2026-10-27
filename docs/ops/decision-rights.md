# Delegated authority and exception handling
Version 1.0 | 27 October 2026 | Applies to Codex and any other AI modifying ElderIndex.

## Principle
Correct the actual state to the approved state. The framework, not a guess that something is a fact, determines authority. A noindex on staging is correct; a noindex on an approved, live commercial URL is not. Distinguish environment, intention, reversibility, reach and risk.

## A: ACT autonomously (no micro-approval)
Codex may research, crawl, propose, write, test and commit changes to a NON-DEPLOYING review branch. It may correct deterministic, low-risk violations of already-approved requirements: broken internal links with a unique verified target, accidental heading/meta omissions, duplicate IDs, invalid schema referencing non-existent objects, image alt text that is clearly erroneous, test regressions, build failures, harmless factual typos corroborated by primary evidence. Revalidate all page dependencies. Document every material change, including source and intended effect.

AFTER launch, low-risk production publishing is delegated ONLY IF all of these are true: the owner has explicitly enabled the autonomous-deploy lane; the targeted URL is already approved live; the fix is strictly within the enumerated deterministic classes; CI passed; diff is minimal and reversible; telemetry and rollback are ready; no concurrent unreviewed main/branch differences; a production postcheck is performed. Until this lane is expressly enabled, prepare a non-deploying PR. NEVER infer that a past push or today's launch intention enables this lane.

## B: EXECUTE approved strategy, but use review lane
Within the SEO and editorial playbooks, Codex may autonomously draft/refine articles, improve links, update confirmed technical guidance, propose useful pages, run controlled tests and prepare a PR, with evidence and change record. Quality/voice judgement may be exercised within approved examples, but changes to core positioning, service scope, author credentials, claims, high-value URLs, visible design language or topical architecture require an owner review before production. If there is no evidence for a separate search intent, improve the existing page rather than multiplying pages.

## C: ESCALATE specific exception before action
Requires Josh's explicit decision: domain/DNS cutover, host/canonical changes impacting the live site, merge/push to a branch known to trigger production outside the autonomous lane, deletion/redirect of valuable URLs, broad noindex/indexability changes outside an approved live manifest, new product or price promises, client case studies, legal/regulatory conclusions, unverified clinical/funding claims, paid spending, outreach sent to third parties, account credentials, new external integrations, access policies, destructive operations, rollback of a production release, or choosing between contradictory factual sources.

Human/qualified review: legal/privacy and data-processing disclosures by business owner and appropriate adviser; clinical and care-eligibility assertions by appropriate qualified source/provider; pricing/contractual statements by business owner. No AI can self-certify those.

## Production and staging invariants
Staging and private previews: noindex; do not remove to 'improve SEO'. Production intended commercial/informational pages: indexable and accessible according to the approved release manifest; legal drafts intentionally noindex until reviewed; canonical host must match approved setting. Do not expose staging by changing SITE_ENV without gate approval. A live noindex violation AFTER a signed-off release is an eligible deterministic correction in the authorised deploy lane only.

## Escalation contract
Do not ask speculative questions. Investigate first, then give: (1) exact failed standard ID and evidence; (2) operational impact; (3) preferred remedy and alternatives; (4) what evidence/approval is missing; (5) safe interim action. If work is blocked, continue independent safe tasks and report blockers together.

## Prohibited independently
No invented ranking/traffic/client results; no falsified reviews, credentials, images or partnerships; no purchased/manipulative backlinks; no mass-generated thin pages; no personal/sensitive enquiry data in tracking; no bypassing auth; no publishing private CMS drafts; no secret values in code/log; no silent overwrites of changes in another branch; no unapproved automatic DNS switch.

## Acceptance
No task is 'done' unless it states its baseline, changed files/URLs, evidence, tests, state (draft/merged/deployed/live verified), and rollback instructions as appropriate.
