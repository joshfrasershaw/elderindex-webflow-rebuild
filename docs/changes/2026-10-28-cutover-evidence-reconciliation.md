# EI-20261028-01 — Cutover evidence reconciliation

- Owner / implementation / risk: Josh / Codex / documentation-only; authorised by current request and autonomous-publishing v2.0. Release-gates v1.0 and change-control apply.
- Baseline: main `b3fa60ee39734904d37e5ff3691918201dedb575`; tested implementation `290211ab907bd0ae3dd4ddf0876eb1d172fb1005` remains historically identified, not replaced by a documentation SHA.
- Before -> after: staging API acceptance with unverified receipt -> owner-confirmed one Formspree entry and one mailbox delivery for `EI-LAUNCH-20261027161513` on 27 October. No independent mailbox/dashboard read claimed. Reply routing and production-origin/spam settings remain open; no repeat staging submission.
- Corrected distinctions: www canonical and initial code editing accepted; GA4 intentionally off. G08 now BLOCKED-EXTERNAL for current Search Console access, since a historical export does not prove present access. Historical failed build remains undiagnosed, but later main quality and Workers build succeeded.
- Files: go-live report, enquiry evidence, cutover instructions, reconciliation check snapshot and activity log. No source, generated pages, metadata, links, account settings or CMS content changed.
- Short sequence: account logs/trigger/recovery inspection; parallel legal/GSC/form-settings confirmations; exact-source unbound target deployment; Josh-authorised switch and actual host acceptance/rollback.
- Validation: JSON parsing, G00–G10 table/status structure and report/evidence consistency checked before commit. Existing baseline main quality run 40547280233 and Workers build e10cbc75 succeeded. New documentation commit CI/deployment must be observed separately; no code retest or new real enquiry needed.
- Proposed/recorded: 28 October 2026. Commit UTC/SHA: Git commit metadata. Website deployed UTC: NOT VERIFIED; domain cutover: NOT PERFORMED. No SEO performance attribution or live publication is claimed.
- Follow-up: account checks and exact-source deployment acceptance; D+1/D+7/D+28/D+90 from actual future cutover.
- Rollback: selectively revert this documentation commit against the baseline, preserving unrelated changes. No DNS rollback needed for these edits.
