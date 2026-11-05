# EI-20261105-02 — Refined care website concept visual design

- **Authorisation:** Owner's two supplied visual references and explicit feedback on 5 November 2026. Routine website redesign authorised under `docs/ops/autonomous-publishing.md` v2.0, without initial DNS/domain cutover.
- **Baseline:** Main `654e86a5345b1509f004e9839fcc5de084d53b6b`; both concepts were text-led split hero designs. The Meadow House had relatively little architecture-led visual impact; Kindred at Home used hard rectangular layouts and a rose-coloured palette.
- **Change:** The Meadow House now uses full-bleed residence photography with a layered dark gradient, photographic navigation, white serif headline, light enquiry button and editorial sage/cream content sections. Kindred now uses a pale lime/forest palette, oversized serif headlines, rounded human-care image treatment, gentle circular and wave-like shapes, soft pill buttons and rounded service cards. Copy was refined to match these emotional directions.
- **Homepage/URLs:** The homepage previews render the *same* live header/hero and source photograph as their actual destinations: `/concepts/the-meadow-house/` and `/concepts/kindred-at-home/`. Existing paths and links are unchanged.
- **Files:** `src/concepts.mjs`, `src/styles.css`, this record and `docs/seo/activity-log.md`.
- **Image provenance:** Existing licence-recorded local Pexels assets reused solely for each respective preview/destination; no borrowed Home Instead marks or unverifiable material from owner-provided third-party screenshot. All photographs remain illustrative.
- **Integrity:** Both demonstrations remain fictional, uncommissioned and clearly disclosed. No claim of real care-provider operations or ElderIndex client work. No real provider contact/booking form.
- **SEO:** No changes to commercial routes, indexing, metadata, schema or linking. Concepts remain `noindex, follow` and omitted from sitemap.
- **Risk:** Low, visual changes restricted to `.demo-*` theme selectors; mobile layouts explicitly adjusted. No DNS, paid platform, or forms changed.
- **Testing:** JS generation smoke checks for preview headlines, single H1, disclosure and real CTA conducted before commit. Full Node/Playwright, accessibility and CI results must be verified on exact final SHA. Cannot claim successful local browser QA or live publication without evidence.
- **Deployment:** NOT VERIFIED at commit. GitHub Actions and hosting must be checked independently; initial old-site domain cutover remains outside this task.
- **Expected effect:** Higher perceived design quality and clearer distinction between care-home and home-care concepts; no conversion or SEO result claimed.
- **Rollback:** Revert this atomic change commit (parent `654e86a5345b1509f004e9839fcc5de084d53b6b`), rebuild and reverify. No migrations involved.
