# ElderIndex change evidence and publication ledger

The normal process is **implement and publish within authority FIRST, log what happened and what was actually live**, then use the records for retrospective Search Console and enquiry analysis. The owner does not need to approve routine commits.

- Individual change histories: `docs/changes/YYYY-MM-DD-<subject>.md`.
- Short release/time-series record: `live-deployment-ledger.csv`.
- Chronological editorial/SEO link index: `docs/seo/activity-log.md`.
- Technical diff, exact before/after, and rollback: Git commit SHA and `git revert`/last-known-good build.
- Distinguish UTC Git commit from first observed deployed status. Use the actual main-domain canonical and URL, not a preview, when marking `LIVE_MAIN`. A staging release is `LIVE_STAGING` and must not be mistaken for public replacement content.
- Never backdate deployment from a commit, guess indexing date, or state rankings improved on evidence of a build alone.
- Google Search Console comparison is page/query/brand/device/country/date-based after observed public changes. Change ledger entries are annotations for analysis, not proof of causation.

Example record: `EI-20261027-04 | website-design intro updated | /services/website-design/ | source SHA | deployed UTC | LIVE_MAIN | target intent | rationale | measurement review dates | rollback SHA`.
