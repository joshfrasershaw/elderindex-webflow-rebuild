# Launch status — 25 October 2026

The code changes support staging review. This is not a declaration that the production site, legal notices, live delivery or accounts have been verified.

## Implemented

- Formspree POST integration using the owner's public endpoint; inline validation, pending/success/error/timeout states, duplicate suppression and retained input on failure.
- Compact homepage form; service checkboxes and qualifying fields on the contact page.
- Optional GA4 wiring with opt-in/rejection/preferences and consent-gated lead/email/phone events. No real Measurement ID exists yet, so analytics remains off.
- Accurate Josh profile based on the owner's care home management, operations and customer relations background. Named author links, real source dates and appropriate schema.
- Expanded Home Care SEO and Care Home SEO methods, deliverables, examples and buying questions.
- Five improved guides plus a distinct multi-location home care planning guide. Keyword-to-page mapping is included in the local SEO guide rather than an unnecessary separate keyword page.
- In-paragraph links, guide contents navigation and relevant next steps instead of repeated full forms on guides.
- A directory comparison table with official links and explicit limits on unverified commercial information.
- Brand social image, full sharing metadata, visible/schema breadcrumbs, stronger generated-site checks, local fonts and contrast/accessibility improvements.
- Explicit Cloudflare static-asset configuration, staging noindex policy, production toggle and preserved legacy redirect rules.

## Required external actions and remaining verification

1. **Form delivery:** the environment's network proxy blocks `formspree.io`. Network domain additions have been saved to the cloud environment draft. Apply the relevant environment settings to allow a live test from here, or submit one clearly labelled test through the deployed site. Confirm the submission in Formspree and actual arrival at `hello@elderindex.co.uk`; check spam and recipient verification. Automated tests simulate Formspree responses, not mailbox delivery.
2. **GA4 and Search Console:** create or reuse the correct GA4 property, supply its Measurement ID as a build variable and verify events in DebugView/Realtime after consent. Review enhanced measurement so it does not collect form data or contact URLs. Confirm existing Search Console ownership and submit the production sitemap; no access or verification token was supplied.
3. **Directory research:** official directory sites, Google guidance and W3C were blocked by this environment's network policy. No vendor-check date or commercial-model verification is claimed. Check the official information and provider agreements, then add a genuine checked date and verified feature/charging details. Saved draft domain additions preserve the existing Cloudflare-docs entry.
4. **Photography:** provide or approve local source photographs and permissions. Generate responsive sizes/formats and replace the original remote Pexels backgrounds. The current browser checks do not verify third-party image delivery or licensing.
5. **Legal:** review the draft privacy, terms and cookie notices, including Formspree processing, lawful basis, retention, international transfers and any future GA4 usage. Draft legal pages stay noindex until separately approved and updated in code.
6. **Production routing:** inventory the actual legacy Webflow URLs from Search Console/export/hosting records. The 22 generated rules cover the 11 known root-to-nested paths; they do not prove that every historic URL is covered. Test HTTP redirects, custom 404 status, headers, canonical host and social-image fetch on Cloudflare after deployment. The local Python server does not emulate these features.
7. **Performance and accessibility:** automated browser, keyboard and WCAG A/AA checks cover representative components; they are not certification. Review real mobile devices, zoom, screen readers and full image-loaded layouts. Measure Lighthouse and field Core Web Vitals on the actual deployment before calling production performance verified.
8. **Go live:** keep `SITE_ENV=staging` for the test site. Once the preceding items are complete, set `SITE_ENV=production` on the live-domain build, confirm `SITE_URL`, rebuild and crawl the live site. Preserve mail DNS records. No live-domain/DNS switch has been made by these code changes.

## Evidence to capture after deployment

- One confirmed received enquiry with correct service selections and no duplicate delivery.
- Consent rejection sends no GA requests; granted test generates one lead event without personal information.
- Production URL/status/redirect crawl, final canonical/sitemap checks and images loaded on mobile.
- Actual vendor source URLs and verification date, approved image records and completed legal notices.
- Field/lab performance evidence labelled with the deployment and date; no ranking or occupancy guarantee.

## Current-instance checks

- Frozen `npm ci` installation succeeded.
- Staging and production variants built and passed the 22-page metadata/schema/link/asset/robots/sitemap checks, including all 22 known redirect rules. The generated build was returned to staging afterwards.
- Ten Playwright tests passed, including a crawl of all routes at desktop and mobile widths, accessible controls, controlled Formspree success/failure/timeout states, duplicate suppression and consent-gated event behaviour.
- Automated Axe WCAG A/AA checks passed on homepage, contact, Home Care SEO and directory comparison pages. This is a limited automated assessment, not a complete accessibility audit.
- Wrangler 4.152.0 accepted the assets configuration in a dry run; no deployment or API credentials were used.
- A local mobile Lighthouse lab run completed (25 October 2026), but all five external photo requests failed in the environment. Its results do not establish image-loaded production performance or field Core Web Vitals.
