# Release candidate report — copy and complete, do NOT mark green by assumption
Release ID: UNASSIGNED
Prepared at UTC: NOT RUN
Codex branch and SHA: NOT RUN
Target production deployment URL and exact SHA: NOT VERIFIED
Old live host and rollback owner: NOT VERIFIED
Canonical host decision (apex vs www): NOT VERIFIED
Owner final cutover approval: NOT GIVEN
Production release decision: NOT READY — evidence pending

| Gate | Status | Evidence / test URL | Tested UTC | Responsible owner / next action |
| --- | --- | --- | --- | --- |
| G00 provenance, backup | NOT RUN | | | |
| G01 legacy redirects | NOT RUN | | | |
| G02 build/test/CI | NOT RUN | | | |
| G03 production robots/canonical | NOT RUN | | | |
| G04 real enquiry inbox | BLOCKED-EXTERNAL | real Formspree + mailbox test | | |
| G05 legal/vendor accuracy | BLOCKED-EXTERNAL | owner approval | | |
| G06 visual/mobile/performance | NOT RUN | | | |
| G07 host/DNS/email/SSL | BLOCKED-EXTERNAL | owner account verification | | |
| G08 GSC + analytics baseline | BLOCKED-EXTERNAL | property/access + truthful setup | | |
| G09 CMS requirement decision | BLOCKED-EXTERNAL | owner accepts code-only edits or proves CMS publication | | |
| G10 security | NOT RUN | | | |

## Autonomous improvements finished
- [exact SHA/file/path, evidence, tests, change record]

## Remaining blockers for owner tonight
- [ONLY material and account-only tasks; one concise item each with exact action]

## Suggested web DNS switch instructions (NOT executed)
- [Record verified current MX/SPF/DKIM/DMARC, OLD and intended NEW web records, canonical and HTTPS; no guesses]
- [Exact method in verified hosting account]
- [Rollback steps and verified previous settings]

## Post-cutover acceptance
- [200, indexability, 301, canonical, host redirect, sitemap, 404, live enquiry, mail delivery, search-console checks]
- [Record deployed_at and domain_cutover_at UTC as actually observed]

Never change this template's status to PASS merely because a local build works. Save completed copy as docs/launch/go-live-report.md and log release change under docs/changes.
