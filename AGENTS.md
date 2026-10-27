# Active policy-driven operating system (27 October 2026)

Before **any** change to ElderIndex, read docs/ops/README.md, docs/ops/decision-rights.md and docs/ops/change-control.md. For SEO/marketing work also read docs/seo/seo-standard.md, docs/seo/research-entity-map.md, docs/seo/editorial-policy.md, docs/seo/measurement-authority.md, docs/marketing/marketing-and-conversion.md, the existing docs/seo/strategy.md and docs/seo/internal-linking.md. For any launch/deployment/production change read docs/launch/release-gates.md, docs/launch/legacy-url-migration.md and docs/ops/qa-ci.md. The one-shot execution brief is docs/codex/MASTER-JOB.md. Old dated audits, docs/seo/implementation-plan.md and docs/launch-status.md are historical, not current authority.

**Operate autonomously within written authority:** inspect -> establish baseline -> correct deterministic noncompliance -> test -> leave a docs/changes record with why, before/after, SHA and rollback. Do NOT micro-escalate authorised low-risk corrections. Push safe review branches only by default; do not infer approval to merge into production or change the old live domain. Release to production, switch DNS and commit legal/business promises only within docs/ops/decision-rights.md and docs/launch/release-gates.md. The default public build is intentionally staging/noindex: never mistake it for a live SEO error. Stop or escalate specific contradictions; continue unrelated safe work.

---

# ElderIndex repository instructions

Use this existing checkout; cloud tasks are isolated. Do not create a Git worktree unless the user asks for one.

For every SEO audit, internal-linking change or commercial-content task, read:

- `docs/seo/strategy.md` — commercial priorities and page/search intent.
- `docs/seo/internal-linking.md` — contextual cross-selling rules and audit workflow.
- `docs/seo/activity-log.md` — significant changes and their publication status.

Website design/redesign is the first commercial priority, followed by ongoing website management/maintenance, then SEO/local visibility/directory optimisation. This does not override a page's existing keyword targeting or the visitor's intent. Preserve valuable SEO links and explain complementary services only where they solve a relevant problem. There is no requirement to link every page to every service.

Review the entire generated architecture, distinguish prose links from navigation/sidebars/CTAs, check orphaned and weakly connected pages, and consider entry points at every funnel stage. Use `npm run build`, `npm run check` and `npm run audit:links -- --output /tmp/elderindex-links.json`; use `--compare` with a saved pre-change audit when available. Run the existing browser tests for affected journeys. Record significant SEO changes in the activity log and explain any intentional loss of established links or change of page intent.

Do not invent results, client claims, ranking data, prices or platform terms. Do not create extra keyword pages or alter established URLs without a justified, explicitly authorised scope. Preserve the owner's public first name, Josh, and the existing accessibility, enquiry and image-uniqueness behaviour.

For SEO work, prepare changes and evidence locally for review. Do not push to a deployment branch, invoke deployment, publish, or alter live domains automatically. Pushing `main` triggers Cloudflare. Publication needs an explicit user instruction; earlier unrelated pushes are not blanket approval for publishing a new SEO draft.
