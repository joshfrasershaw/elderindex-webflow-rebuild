# ElderIndex — care-sector website

A static, code-owned website for UK care homes and home care agencies, built with Node.js and ordinary HTML, CSS and JavaScript. There are 22 routes, including six guides. Design concepts and worked examples are clearly labelled illustrations, not client work.

## Build, check and preview

Requires Node.js 18+ and Python 3. The production build has no third-party runtime dependencies. Development dependencies provide browser and accessibility tests.

```bash
npm ci
npm run build
npm run check
npm run dev
```

Build output is `dist/`; the preview server uses port 4173. Python's preview server does not interpret Cloudflare `_redirects` or `_headers`; verify those against a Cloudflare deployment.

```bash
# Install Chromium for tests if it is not already available:
npx playwright install chromium
npm test
```

Tests use system `/usr/bin/chromium` when available, or Playwright's Chromium. Override with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if needed. Browser tests intercept Formspree and analytics requests: they never send real enquiries. The test runner rebuilds with real configuration after removing its fake analytics fixture.

## Cloudflare staging and production

Cloudflare build command: `npm run build`. Deploy command: `npx wrangler deploy`. `wrangler.jsonc` declares `dist/` as static assets, enables the staging `workers.dev` route and serves the custom 404. Cloudflare Pages can use the same build and `dist` output without Wrangler.

All variables below are **build-time** values. Changing them requires a rebuild. Do not place secrets in public build configuration.

| Variable | Default | Purpose |
| --- | --- | --- |
| `FORM_ENDPOINT` | `https://formspree.io/f/xpqlvnaa` | Public Formspree form endpoint supplied by the owner. Set to an empty string to disable online enquiries. Do not use a project ID, deploy key or API key. |
| `GA4_MEASUREMENT_ID` | empty | Analytics stays off unless a real `G-…` ID is supplied. When configured, it only loads after opt-in. |
| `SITE_ENV` | `staging` | Only the exact value `production` enables indexing of non-legal pages. Keep staging builds unindexed. |
| `SITE_URL` | `https://elderindex.co.uk` | HTTPS canonical origin. Confirm the intended canonical domain before launch. |

Staging builds use `noindex` in HTML and an `X-Robots-Tag` header. Robots permits crawling so search engines can see the noindex instruction. Production builds allow non-legal pages; privacy, terms and cookies remain draft/noindex. Staging protection is a crawler instruction, not access control. Use Cloudflare Access if the site must be private. Do not connect the live domain until the outstanding launch checks are completed.

```bash
# Verify the production variant locally, then restore staging:
SITE_ENV=production npm run build
SITE_ENV=production npm run check
npm run build
```

## Form delivery and analytics

Forms POST directly to Formspree. They validate fields, preserve input on failures, prevent duplicate submissions and show success only after a successful JSON response containing `ok: true`. The homepage uses name, email, optional organisation and message. Other enquiry forms retain the website and multi-select service fields.

A genuine live submission and inbox receipt must be confirmed in Formspree and the recipient mailbox before production launch. Receiving a response in a simulated browser test is not inbox-delivery verification. No Formspree secret is required in this static site; configure recipient verification, spam protection, origin restrictions and notifications in the Formspree account.

No GA4 ID has been supplied. When configured, equal-weight allow/reject controls store a preference in local storage for up to 180 days. Footer preferences allow changes. Analytics only records `generate_lead` after confirmed submission, and separate `email_click`/`phone_click` actions. Events do not include enquiry contents, addresses or phone numbers; page locations omit query strings. Review GA4 enhanced measurement settings to avoid automatic form/PII collection; disable form-interaction and outbound-click enhanced measurement unless independently reviewed. No phone number is invented or displayed; tracking supports `tel:` links if a real number is added later.

## Content and assets

- `src/data.mjs`: base page inventory, services and guide cards.
- `src/editorial.mjs`: expanded service/guide content, worked examples, approved founder biography and contextual next steps.
- `src/template.mjs`: semantic rendering, safe contextual links, navigation and forms.
- `src/seo.mjs`: Organization, Person, WebSite, WebPage, BreadcrumbList, Article and Service relationships.
- `src/config.mjs`: public build settings and validation.
- `src/imagery.json` and `src/imagery.mjs`: unique per-placement photographs, source/licence records, responsive variants and descriptive alternatives.
- `src/client.js`: navigation, POST forms and consent-gated measurement.
- `src/styles.css`: design and responsive/accessibility styles.
- `scripts/check.mjs`: generated-page, metadata, headings, schema, links, asset, redirect and sitemap checks.
- `public/assets/fonts/`: self-hosted, OFL-licensed brand fonts; sources and licences included.
- `scripts/social-card.html`: editable social-card artwork. Run `npm run social:build` to regenerate the 1200 × 630 PNG using Chromium.

Guide publication/update dates refer to the actual 25 October 2026 source publication and revisions. They are **not** dates on which external platform terms were verified. Keep future content revisions and dates aligned.

The site uses 26 distinct, locally hosted Pexels photographs, with three responsive WebP sizes per image, plus two owner-supplied hero graphics. Riverside House (`3129.png`) is used on the homepage; The Oaklands (`3127.jpg`) is used on Website Design. Hawthorn Hall (`3128.png`) is retained for a future placement. Every editorial photograph is assigned to one placement only. Source/licence records and photographer credits are in [image credits](docs/image-credits.md). Stock imagery is illustrative, not a claim of client work or a portrait of the ElderIndex team. Current directory package features and commercial terms also require checking with the official platforms; the comparison deliberately avoids invented pricing or contractual claims.

See [launch status and remaining checks](docs/launch-status.md). The separate `joshfrasershaw/EI2.0` repository is unrelated and must remain untouched.

## Permanent SEO guidance and publication

Future SEO audits and content changes must follow [commercial strategy](docs/seo/strategy.md) and [internal linking/cross-selling guidance](docs/seo/internal-linking.md), as required by [AGENTS.md](AGENTS.md). Significant changes belong in the [SEO activity log](docs/seo/activity-log.md).

Run `npm run build`, then `npm run audit:links -- --output /tmp/elderindex-links.json` for a placement-aware rendered-site audit. Use `--compare` with a pre-change report to inspect removed links and metadata changes. Design and management have commercial priority, while each page retains its own search intent and useful SEO links.

SEO changes are prepared locally for review. Pushing `main` automatically triggers Cloudflare; do not push or deploy a review draft without an explicit publication instruction.
