# 2026-10-28 — Digital glossary scope correction

Owner clarified that ElderIndex's glossary serves care-provider decision-makers buying website design, SEO and digital management, not readers seeking care-practice definitions.

Changed `src/migration-content.mjs` to omit 19 care-practice/regulatory terms from rendered glossary while adding 26 digital/technical definitions covering web hosting, redirects, HTTP status codes, HTTPS, DNS, CMS, CSS, PHP, GA4, conversion tracking, accessibility, Web Vitals and associated terms. Retained original source entries for historical provenance; rendered glossary is filtered. Directory and search terms remain. The glossary page path and migration redirects remain unchanged.

Before: mixed care practice and digital terminology, including Care Plan, CQC Inspection and Duty of Candour. After: digital marketing and web technology glossary for care-provider operators.

Commits: `6c92f90466773dff27ba66af8c33d37840174839` and `c7c2f21c5bae28af46833a754e31659943bf2369`.

Deployment status: **NOT VERIFIED LIVE**. GitHub quality checks and deployed sitemap/page must be inspected following this change. Rollback: revert both implementation commits if required; no DNS changes.
