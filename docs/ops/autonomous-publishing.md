# ElderIndex — autonomous implementation and publishing policy
Version 2.0 | 27 October 2026 | Owner-authorised standing instruction for the replacement website, subject to hosting availability and the one-off cutover boundary.

## Operating contract
Josh and ChatGPT set or amend the policy: commercial priorities, keyword and URL ownership, editorial style, internal linking, technical SEO, accepted evidence standards and business constraints. Codex is the operator: AUDIT -> DETECT -> RESEARCH -> FIX -> TEST -> COMMIT TO MAIN -> VERIFY DEPLOYED LIVE STATE -> RECORD. Its ordinary response is completed action and evidence, **not a request for a review before taking compliant action**.

Standing owner authorisation: Codex may make and directly publish changes to the ElderIndex website on `main` where they implement an existing policy, stay within the agreed business offer and don't trip a specific restricted-action boundary below. This includes factual corrections, SEO metadata, indexability on pages already approved for production, internal linking, commercial keyword implementation, guides and care-sector content within approved editorial standards, schema, imagery and accessibility, speed, safe redirects with substantiated equivalent destinations, automated tests and layout improvements within the established design language. Codex may refine its edits after deployment if live verification shows failure.

**NO MANDATORY PR, REVIEW BRANCH, MICRO-APPROVAL OR PRE-PUBLICATION SIGNOFF** for normal framework-compliant work. A PR is a tool for exceptional high-risk changes, complex conflicts, or when GitHub branch protection objectively requires one; do not turn it into the default path. Codex should push directly to main when tests pass and the action is authorised. If the connected deployment trigger fails, investigate/fix the available pipeline, preserve the last known live release and mark changes as NOT LIVE; never pretend a push was published.

## Not delegated by this policy
(1) The *initial* old-site -> new-site domain/DNS/custom-host cutover until Josh explicitly authorises that specific switch. (2) New subscriptions, spend, buying links, sending outreach, changing hosting plans or legal commitments. (3) Inventing care services, prices, qualifications, client outcomes, testimonials, partners, regulated/clinical facts, funding eligibility, legal or privacy conclusions. (4) Deleting/retiring valuable legacy pages without an equivalent or an evidenced impact decision, destructive database/CMS changes, security/access/credential changes, or bypassing controls. (5) Publishing an unverified production configuration that risks taking the only existing public site offline. Escalate only those decisions; proceed with all independent safe work.

## Pre-cutover versus post-cutover
Before the first domain switch: push approved code/framework fixes to main and the already configured non-public deployment target, but DO NOT alter the old live site's DNS, routing or binding. Production-prepared releases may have a proposed `SITE_ENV=production` variant, but do not allow staging to become indexed or alter public traffic. Use docs/launch/release-gates.md to prepare a safe cutover; owner decides cutover. This is the sole exceptional release boundary, not an indefinite pre-review regime.

After Josh confirms the new canonical host is live and the launch is accepted: framework-compliant routine changes may automatically publish to main/live, followed by deployed verification and dated logging, with no further release-by-release owner approval. If the deployment target or credentials are unavailable, document the blocker once and continue safe work; a command approval required by Codex runtime cannot be overruled by markdown.

## Mandatory footprint AFTER implementation
Every meaningful change must preserve:
- governing policy version / rule ID and reason, evidence, target query/intent and URLs;
- before -> after (Git diff + baseline SHA), tests and implementation SHA;
- exact deployment SHA, UTC time and live canonical URLs actually inspected, or explicit `NOT DEPLOYED / NOT VERIFIED`;
- expected effect, uncertainty, follow-up checkpoints, rollback/revert commit;
- human-readable record under `docs/changes/` and entry in `docs/seo/activity-log.md`. Aggregate routine typos into a dated batch.
Never mark an edit LIVE merely because GitHub accepted a commit, a Cloudflare build started, or a test passed. Monitor deployments/headers and confirm the content or release identity at the real domain. Document any failed attempt so it doesn't contaminate Search Console timelines.

## When uncertain
Do research; implement the safe policy-compliant alternative when substantiated; otherwise leave that specific exception unchanged and proceed elsewhere. Deliver one short exception summary instead of repeated requests. The owner can adjust the framework when decisions recur. Framework amendments are strategic changes for Josh/ChatGPT; Codex should suggest wording, not silently rewrite business policy to justify an action.

## Related sources
`docs/seo/strategy.md`, `docs/seo/research-entity-map.md`, `docs/seo/internal-linking.md`, `docs/seo/editorial-policy.md`, `docs/seo/seo-standard.md`, `docs/ops/change-control.md`, `docs/launch/release-gates.md`.
