# ElderIndex — independent website rebuild

A code-owned, static rebuild of the **ElderIndex Webflow design**, including 21 pages recovered from the Webflow site on 25 October 2026. The design system is plum/gold/ivory/sage; all site pages are actual HTML with CSS and JS, not images of a website.

## Build and preview

Requires Node.js 18+, and **no npm dependencies**.

```bash
npm run build
npm run check
python3 -m http.server 4173 -d dist
```

Visit `http://localhost:4173`. Build output is in `dist/`.

## Deploy for free

Cloudflare Pages → connect GitHub repository → **Build command** `npm run build` → **Output directory** `dist` → **Root directory** `/` (default). Cloudflare automatically builds a preview deployment for non-production branches. You can also upload `dist/` directly via Cloudflare Pages Direct Upload. Vercel can build the site with the same build command and output directory.

### Hosting prerequisites

- Connect `elderindex.co.uk` only after the replacement site and form are approved.
- Retain all existing email DNS records (MX, SPF, DKIM, DMARC) during any domain changes.
- Check existing URLs in Search Console and expand `_redirects` for other legacy paths before launch.
- This repo does **not** contain analytics, tracking pixels or cookies beyond platform essentials.

## Honest limitations / before-launch checklist

- **Contact form** uses JavaScript to open a pre-filled mail app. It does **not** send server-side submissions. A genuine server-side contact endpoint or hosted form service must be configured before replacing an existing working form. The button states exactly what happens.
- **Photography** uses live external Pexels URLs sourced from the Webflow concept. Check licence/source and replace with locally hosted, approved genuine photos before production. Fallback colours render when external images are unavailable.
- **Website concept previews** are illustrative, uncommissioned designs — not client sites or case studies.
- **Privacy/terms/cookies** are marked drafts, with `noindex` and excluded from the sitemap until the operator reviews, completes and approves them. Remove `noindex` after completion.
- **Business claims** avoid testimonials, client outcomes, made-up metrics and ranking guarantees.
- **SEO**: 21 static routes, unique titles, descriptions, one H1, canonical URLs, internal links, sitemap, robots, 11 groups of root-to-nested redirects; guides/specialist pages nested under `/guides` and `/services`.
- **Image optimisation**: Move production photography to local assets and generate multiple responsive sizes for performance.
- **Visual QA**: Review desktop/tablet/mobile screenshots, tab/keyboard navigation, form behaviour and Lighthouse before launching.

## Editorial maintenance

- `src/data.mjs`: headings, page copy, service lists, guides, meta titles/descriptions.
- `src/template.mjs`: sections, card layouts, structured data, internal linking.
- `src/styles.css`: complete design system and responsive styles.
- `src/client.js`: mobile menu and contact email-draft behaviour.
- `scripts/build.mjs`: writes final static HTML and SEO files.

The existing `joshfrasershaw/EI2.0` project is a different website and **must remain untouched**.
