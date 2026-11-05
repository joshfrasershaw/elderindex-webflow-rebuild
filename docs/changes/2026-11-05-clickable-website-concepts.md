# EI-20261105-01 — Clickable fictional care website concepts

- **Owner request / authorisation:** Josh requested real, clickable examples replacing The Meadow House and Kindred at home homepage illustrations on 5 November 2026. This is ordinary website design under docs/ops/autonomous-publishing.md v2.0.
- **Baseline:** The homepage `/#concepts` showed two unlinked mini-site illustrations. Their source page was the homepage only.
- **After:** The cards now link to `/concepts/the-meadow-house/` and `/concepts/kindred-at-home/`. Each destination is a responsive one-page fictional website with the same hero copy, imagery, colour and masthead as its preview, actual in-page navigation and a real ElderIndex enquiry link.
- **Scope:** `src/concepts.mjs` (new), `src/data.mjs`, `src/template.mjs`, `src/styles.css`, `scripts/build.mjs`, `scripts/check.mjs` and `scripts/check-release.mjs`. Documentation in this change record and `docs/seo/activity-log.md`.
- **Why:** Give prospective care providers a genuine design experience rather than a mock website screenshot; support the commercial website-design journey.
- **Accuracy:** These are uncommissioned design concepts, not live care providers, client projects, results, reviews or case studies. Disclosures appear on the homepage and concept pages. No provider-specific contact information or operational booking forms exist. The only real CTA goes to ElderIndex.
- **Photographs:** Existing locally hosted, licensed illustrative stock used on the homepage preview is intentionally reused in each destination's matching hero. The original photography assignment and licence records remain unchanged.
- **SEO/indexing:** Concepts are always `noindex, follow` (including production) and excluded from the XML sitemap; other pages retain their existing index and URL treatment.
- **Risk:** Low; no DNS, marketing promises, payment data, customer information, external integration or legacy URL change.
- **Testing:** Additional deterministic concept disclosure and link assertions added to `npm run check`. `npm run build`, `npm run check`, `npm test`, and CI must pass on a clean exact SHA. Tool-connected GitHub actions status should be assessed separately. Do not infer live publication from a Git commit.
- **Implementation commits:** first `aaf184ff654f49819553f61d0fd402045e772d41` (concept source), latest implementation before this record `5882a21c35c4987a823ae08678d428b87e014a68` (indexability check).
- **Deployment:** Actual deployment SHA/time and production URL response **NOT VERIFIED** at record authoring.
- **Expected effect:** The new exploration path may improve the quality of website-design enquiries; no ranking or conversion outcome asserted.
- **Follow-up:** Check exact commit CI and the live paths, then annotate the real deployment UTC and release SHA. D+7 and D+28 may compare engagement if consented analytics exist.
- **Rollback:** Revert these implementation commits in reverse order on main, rebuild and recheck, then verify deployment. No DNS changes needed.
