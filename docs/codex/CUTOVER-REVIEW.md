# CODEX JOB: final owner-controlled cutover verification
Josh is considering repointing the old live ElderIndex site to the new build. DO NOT perform the switch yourself unless Josh explicitly directs a particular action after seeing the current release report.

Read docs/launch/release-gates.md and completed docs/launch/go-live-report.md. Confirm report still matches current HEAD and target deploy SHA. Verify all code-owned gates, canonical/indexing production build settings, current legacy redirect mapping and hosting responses without touching existing live DNS. Test a real enquiry only with owner-authorised access and clearly labelled test data. Identify every BLOCKED-EXTERNAL item and prepare specific dashboard instructions for Josh with verified account and host settings; never guess DNS values. Preserve MX/SPF/DKIM/DMARC.

Give Josh a SHORT final ready/not-ready recommendation, evidence and old-site rollback plan. If owner then approves cutover and provides authorised account access, follow the minimum-scoped documented action and perform actual live HTTP checks. Record actual timestamp and change log; if cannot verify, report honestly rather than claim a successful move.
