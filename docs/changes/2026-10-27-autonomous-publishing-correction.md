# EI-20261027-04 — Correct autonomy to retrospective review and live change history

- Authority: Explicit owner clarification on 27 October 2026: Codex should automatically audit, implement, publish and record actual live changes within existing frameworks. Josh and ChatGPT govern the frameworks, not individual implementation approval.
- Before: AGENTS and decision-rights directed most SEO work to review branches and PRs, resulting in a queue and extensive micro-approval friction.
- After: docs/ops/autonomous-publishing.md and updated AGENTS, ops README, decision-rights, change-control, release-gates, routine job and ledger. Framework-compliant work is authorised directly to main after tests and must verify real deployment, then log actual live UTC time.
- Protected exception: initial domain/DNS migration remains owner-controlled; legal/regulatory, spending, credentials, destructive and unverified third-party commitments are not delegated.
- Git integration: PR #1 merged into main at 733788f65c964d67a79c6440c41fc29d79ceb4a3 prior to policy corrections. Subsequent main commits document standing autonomous authority.
- Tests: This is documentation and governance only. Repository GitHub commits verified. No claims that production website, Formspree, Cloudflare build or Search Console data passed. Cloudflare build errors remain an existing issue and are NOT evidence of live publication.
- Live status: This policy change is active in GitHub main; the old public website stays in place. `deployed_at` and `first_verified_live_at` for replacement web content: NOT VERIFIED. No fabricated entry added to live-deployment-ledger.csv.
- Expected result: Codex executes approved policy rather than holding routine work for before-the-fact reviews. Future deployed changes are queryable by URL/timestamp and reversible by Git.
- Rollback: Selective Git revert of policy correction commits; no domain/DNS changes associated with this documentation task.
