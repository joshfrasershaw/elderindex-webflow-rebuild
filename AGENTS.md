# PRIMARY OPERATING INSTRUCTION — POLICY-DRIVEN AUTONOMOUS PUBLISHING (27 OCT 2026)

**Owner's confirmed standing mandate:** Codex should independently audit the website against the agreed SEO, marketing, internal-linking and editorial frameworks; identify discrepancies; implement fixes; test; **publish authorised work directly to `main`** (normally deploying to the configured website); verify what actually deployed/live; and leave a dated before/after record for Search Console comparison. NO routine PRs, review branches, per-change permission requests or pre-publication human review. Read `docs/ops/autonomous-publishing.md` FIRST; this is the controlling operational clarification and supersedes earlier 'leave local for review', 'non-deploying branch only' and 'do not push main' wording in this file or lower-precedence documents.

**Exceptions:** do not perform the first replacement-domain DNS/custom-host cutover without Josh's specific instruction; do not invent evidence or make independent legal, financial, irreversible security/CMS or unverified regulated commitments. Before cutover, main/source may be updated while the old live site must stay up. After cutover, authorised website changes deploy and are checked automatically. A Git commit alone is never evidence of a live release; failed Cloudflare builds must be diagnosed or logged NOT LIVE.

**Required footprint:** `docs/changes/` and `docs/seo/activity-log.md` must identify exactly WHAT changed, WHY, old/new SHA/content, tests, and actual LIVE deployment UTC/URL or explicitly NOT VERIFIED, plus rollback. Original commercial priorities, internal linking and SEO intent still govern changes. Continue safe tasks when an account-level permission cannot be obtained.

---

# Active policy-driven operating system (27 October 2026)

Before **any** change to ElderIndex, read docs/ops/README.md, docs/ops/decision-rights.md and docs/ops/change-control.md. For SEO/marketing work also read docs/seo/seo-standard.md, docs/seo/research-entity-map.md, docs/seo/editorial-policy.md, docs/seo/measurement-authority.md, docs/marketing/marketing-and-conversion.md, the existing docs/seo/strategy.md and docs/seo/internal-linking.md. For any launch/deployment/production change read docs/launch/release-gates.md, docs/launch/legacy-url-migration.md and docs/ops/qa-ci.md. The one-shot execution brief is docs/codex/MASTER-JOB.md. Old dated audits, docs/seo/implementation-plan.md and docs/launch-status.md are historical, not current authority.

**Operating precedence update:** see docs/ops/autonomous-publishing.md. Its standing owner mandate permits framework-compliant publication to main; the initial live-domain cutover, legal/financial/security exceptions and actual production verification remain protected. The default staging/noindex build is intentional.

The owner's 27 October execution instruction authorises adopting and executing framework v1.0 in the non-deploying review lane, including commits, pushes and a PR. The older publication wording below continues to prohibit unapproved production publication; it does not prohibit authorised review-branch pushes or deterministic corrections. Policy precedence is defined in `docs/ops/README.md`. No autonomous production lane or cutover approval has been enabled.

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

For SEO work, implement, test, commit to main, verify deployment and log under the standing owner authorisation in docs/ops/autonomous-publishing.md. This does not authorise the initial live-domain cutover or restricted account/legal actions.
