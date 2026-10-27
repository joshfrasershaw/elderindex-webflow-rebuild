> **CURRENT OVERRIDING EXECUTION RULE (27 October 2026):** [Autonomous publishing](autonomous-publishing.md) is the active owner mandate. Codex audits, implements, tests, commits directly to main, checks deployment and logs observed live changes without asking for routine PR approval. A prior requirement for review-branch-only work is superseded. The old live-domain switch remains owner-controlled, and Git commits are not automatically live releases.

# ElderIndex operating system — active policies
Version: 2.0 | Owner-approved standing autonomous publication policy; initial domain cutover remains separately controlled.

## Purpose
Josh and ChatGPT agree the objectives and update standards; Codex audits, researches, implements, tests and records compliance. Codex does NOT invent policy on its own. Autonomous corrections are explicitly permitted only within the decision-rights policy and safe execution boundary.

## Authority and precedence
1. Direct, current, explicit owner instruction and applicable legal/security obligations.
2. This repository's AGENTS.md (entrypoint and execution boundaries).
3. docs/ops/autonomous-publishing.md and docs/ops/decision-rights.md (approved standing authorisation and exceptions).
4. docs/launch/release-gates.md for prelaunch, cutover, production and rollback.
5. docs/ops/change-control.md (evidence and traceability).
6. docs/seo/seo-standard.md + docs/seo/research-entity-map.md + docs/seo/editorial-policy.md + docs/seo/measurement-authority.md.
7. Existing docs/seo/strategy.md and docs/seo/internal-linking.md; these preserve agreed commercial priorities and detailed link rules.
8. Historic audits, dated commercial cluster reports and logs are evidence, NOT overriding ongoing policy.

When equally authoritative instructions conflict: preserve current production state; use higher-precedence policy; record the conflict and ask ONE concrete decision only if it blocks a safety-critical action.

## Work cycle
Read current repository and environment -> establish baseline and classify stage/URL -> check invariant and supporting evidence -> choose approved intervention -> implement the smallest sufficient fix on a safe branch -> run checks and inspect rendered output -> record change with source SHA, approval and rollback -> report only actual blockers and facts.

No unverified assertions of completion. A commit is not a deployment, deployment is not domain cutover, and a successful build is not proof of Google indexing or lead delivery.

## Existing history
- docs/seo/implementation-plan.md is the COMPLETED 26 October internal-linking project, not the current go-live plan.
- docs/launch-status.md is a historic narrative checklist, not the authoritative release decision.
- docs/seo/activity-log.md remains the chronological index; individual detailed records belong in docs/changes/.
- cms feature/puck-local-cms is separate and has diverged from main; preserve all stored drafts.
- The old site remains live until Josh authorises the DNS/domain cutover.
