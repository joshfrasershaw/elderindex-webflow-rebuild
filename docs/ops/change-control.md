# Change control, change history, experiment attribution and rollback
Version 1.0 | 27 October 2026.

## Rules
- Git history is the immutable technical record. docs/changes/YYYY-MM-DD-short-slug.md is the human-readable record for each meaningful content, SEO, design, configuration or deployment change. docs/seo/activity-log.md links to the records chronologically. Trivial contiguous spelling fixes can be bundled into a release record; do not make hundreds of tiny reports.
- Assign IDs EI-YYYYMMDD-NN. Include governing framework versions, origin of evidence, before/after values, affected canonical paths, reason/hypothesis, risk, tests, result and owner/AI authorisation classification.
- Track FOUR distinct moments when applicable: proposed_at, committed_at (UTC), deployed_at (UTC), domain_cutover_at (UTC). Never equate a Git commit with a live change. Note exact deploy URL, build SHA, production hostname and observed response. Where not known use 'UNVERIFIED', not an invented time.
- Save before-state through git SHA and targeted before/after snapshot or diff; explain if the content is generated. Do not store API keys, contact submissions or personal data in change reports.
- Record proposed effects as hypotheses, not guaranteed ranking impact. Where observed later, distinguish correlation from causation.
- Group changes into an explicit RELEASE ID; keep an index of URL -> release IDs if useful. Prefer coherent releases with minimal concurrent unrelated changes near a measurement window.

## Required change record template
# EI-YYYYMMDD-NN — descriptive name
- Owner / implementation agent / risk class: ...
- Framework versions + policy rule IDs: ...
- Status: proposed | review | merged | staged | deployed | live-verified | reverted
- URLs/files affected: ...
- Trigger and factual baseline: ... (source/date)
- Why / search intent / expected behavioural impact: ...
- Before -> after: ... (precise values / commit diff)
- Dependencies and collateral risk: ...
- Tests: commands, results, failures, manual and account-only gaps
- Source commit / PR / review link: ...
- Proposal UTC / commit UTC / deployment UTC / cutover UTC: ...
- Follow-up at D+7 technical, D+28 query mix, D+90 commercial: ...
- Search Console comparison: query + page + device + country + brand segmentation + equal-period dates, impression/click/CTR/position and known seasonality; distinguish traffic and qualified enquiries
- Rollback: parent/last-known-good SHA, configuration snapshot, instruction, owner if needed, and post-rollback tests
- Outcome or learning (when observed): ...
- Approval evidence / exception: ...

## Rollback standard
Prefer git revert of the specific change on a review branch; detect conflicts and re-test the entire release. For widespread failure, use the last-known-good deploy artefact/commit and documented host/domain configuration. Rollback to prior content does not restore an earlier Google ranking automatically. Never install a hidden 'backdoor', unauthenticated restore endpoint or permanent secret. Production rollback requires the release owner's authority, unless there is a separately approved emergency incident-runbook delegation.

## SEO timing
Google processing varies; do not infer outcomes from tomorrow's clicks. Preserve same-day deployment markers and annotate weekly/monthly GSC time series. If 4 unrelated changes hit one page, do not claim which one caused its change. Record external updates, seasonality, referral campaigns and analytics changes.
