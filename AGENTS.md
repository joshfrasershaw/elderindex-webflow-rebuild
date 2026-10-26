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
