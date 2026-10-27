# Historic 27 October prelaunch Codex work order — COMPLETED

This document records the initial framework rollout and cutover preparation. **Do not execute it again as the standing SEO workflow.** The owner has explicitly clarified that regular Codex jobs should implement, test, publish to main, verify live changes and log retrospectively, without routine review branches, PR approvals or micro-prompts. Use [the current autonomous audit/fix/publish job](AUDIT-FIX-PUBLISH.md) and [the standing publishing policy](../ops/autonomous-publishing.md) instead.

The one-off old-site -> new-site domain/DNS switch remains owner-controlled and must follow [release gates](../launch/release-gates.md). Old historical test logs and work reports remain as recorded.

---

<details><summary>Historic master instructions (kept as audit evidence; superseded)</summary>

> **SUPERSEDED EXECUTION FLOW — 27 OCT 2026:** The former one-off task's instruction to use a policy review branch, prepare a PR and stop before publishing is superseded by [autonomous publishing](../ops/autonomous-publishing.md). The frameworks have been merged to main. All new Codex audit tasks should work from `main`, fix/test/push eligible changes directly, verify deployment and log what actually became live. Only the initial DNS/domain cutover and restricted business/account decisions require owner approval. Historical release gates still apply to first cutover; maintain the old site until then. Do not re-execute old instructions that conflict with this update.

# ONE-SHOT CODEX JOB — adopt operating system, audit and prepare today's ElderIndex replacement
Version 1.0 | 27 October 2026 | This is an execution specification, NOT authority to repoint a live domain.

## Objective
Get the replacement ElderIndex static website to a professionally evidenced, safe-to-cutover release candidate TODAY, while the existing website stays live. Adopt complete policy-driven AI autonomy: do approved deterministic fixes without micro-prompts, record every material modification, escalate only true authority gaps. The owner will return after work and make the final domain decision.

## Start — read before changing anything
1. Confirm repository joshfrasershaw/elderindex-webflow-rebuild and branch policy/seo-ops-and-launch-2026-10-27; this branch contains the approved *draft* policies. Inspect git status and remote SHA. Do not discard outstanding unrelated edits.
2. Read in order: AGENTS.md; docs/ops/README.md; docs/ops/decision-rights.md; docs/launch/release-gates.md; docs/ops/change-control.md; docs/seo/seo-standard.md; docs/seo/research-entity-map.md; docs/seo/editorial-policy.md; docs/seo/measurement-authority.md; docs/marketing/marketing-and-conversion.md; docs/ops/qa-ci.md; existing docs/seo/strategy.md and docs/seo/internal-linking.md; docs/launch/legacy-url-migration.md; docs/launch-status.md; docs/seo/activity-log.md.
3. Classify environment: old public domain (must remain live); static new site; staging worker and any separate Puck CMS feature branch. Verify current remote configuration and do NOT assume a previous status report describes today's deployment. Do not merge CMS work or overwrite its drafts.

## Work autonomously; do not micro-question owner
PHASE 1 POLICY & INTEGRATION
- Verify new documents integrate cleanly; update AGENTS.md if not already changed to reference the operating system and delegated authority. Preserve existing useful rules and tighten any contradictions to policy precedence.
- Make docs/launch/release-gates.md the current go/no-go source; retain the old docs/launch-status.md as dated history with a banner/link (do not erase evidence). Treat docs/seo/implementation-plan.md as completed historic INTERNAL-LINKING plan; do not mistake for full SEO implementation roadmap.
- Create docs/changes/ entry for this policy adoption and index in docs/seo/activity-log.md; track the policy version and ensure future relevant code changes generate human-readable records.

PHASE 2 PRE-LAUNCH CODE AND CONTENT AUDIT
- Confirm complete page inventory, titles, H1/H2, robots staging vs production, self-canonicals, structured data relevance, sitemap, all internal links (contextual vs footer), six guides and cross-selling, form tracking/consent and real image rights/disclosures.
- Keep design first, management second and SEO third; don't rewrite well-formed content without a demonstrated problem. No mass keyword pages, invented proof, unsupported legal guidance or fictitious SEO success.
- Research old public URL inventory with official current evidence when accessible and build verified mapping to the new site; supplement existing scripts/build.mjs 11 old/new pairs only when legacy URLs/intent are substantiated. Document unknown routes and blockers. Test deployed redirect behaviour, mindful that static _redirects rules are not applied to custom Worker-generated responses.
- Check production build config explicitly; staging noindex is intentional, production commercial pages must not inherit it. Correct deterministic issues inside reviewed branch.
- Review difference against feature/puck-local-cms; avoid accidental merge, ensure initial Website Design content snapshot/fingerprint compatibility is documented. CMS publishing may remain a separate post-launch workstream if owner accepts code-driven edits.

PHASE 3 TESTS, AUTOMATION AND EVIDENCE
- Add non-deploying .github/workflows/quality.yml PR/push checks for deterministic build/link/Playwright/production-indexability checks as per docs/ops/qa-ci.md, if compatible with repo access. No deploy workflow, production secrets or spending.
- Run npm ci; npm run build; npm run check; npm run audit:links -- --output /tmp/elderindex-links-ready.json; npm test. Check SITE_ENV=production npm run build and check, comparing intended indexability and then restoring staging build as appropriate.
- For any changes, create or update docs/changes/ dated records, snapshot before/after where appropriate, record SHA and tests, and do not label unobserved GSC/GA4 results as verified. Group related small changes.
- For third-party gates impossible without account access (real Formspree inbox, GA4/GSC ownership, Cloudflare Access, DNS, legal approval), state BLOCKED-EXTERNAL with the smallest direct owner action. Never fake success.

PHASE 4 RELEASE REPORT & HANDOFF
- Fill docs/launch/go-live-report.md from template, identifying each gate G00-G10 as PASS/FAIL/BLOCKED-EXTERNAL/NOT-RUN/WAIVED with evidence and precise SHA/UTC. Include final owner cutover checklist, old-site rollback, and any remaining critical blockers.
- Commit/push work ONLY to non-deploying branch, prepare one well-described PR for owner review. Do NOT merge/push to main if it deploys without distinct owner permission. Do NOT flip domain DNS, apex/www routing, SITE_ENV on the existing public host, account access rules, mail DNS, legal statements or send real external messages on owner's behalf.
- Return one concise final report: (1) branch/commit/PR; (2) verified passes; (3) exact launch blockers requiring owner/account; (4) recommendation READY/NOT READY FOR OWNER'S CUTOVER; (5) direct link to release report + rollback point. Avoid endless follow-up questions. If a noncritical task remains, place it in post-launch backlog; don't hold today's release hostage to arbitrary polish.

## Autonomy contract
If something is objectively noncompliant AND framework explicitly authorises fixing it AND the remedy is reversible, act. If a high-impact judgement/third-party approval is genuinely missing, preserve existing production, record one exception and proceed with independent tasks. 'Owner wants to launch tonight' does NOT itself grant permission to execute the DNS switch. A local PASS does NOT verify a live endpoint. Existing SEO rules, no-index intent and client honesty remain in force.

## Reporting expectation
At minimum record: changed URLs, why, old/new values, baseline and current SHA, source/primary evidence, test results, actual commit time, actual deploy time (if any), risk and git revert or last-good rollback procedure. Changes must be explainable alongside future GSC data. Preserve both current old-site search baseline and new-site rollout milestone.


</details>
