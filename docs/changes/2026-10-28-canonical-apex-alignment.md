# 2026-10-28 — Canonical hostname alignment after Cloudflare cutover

## Reason and scope
Owner confirmed the public Cloudflare Worker serves `https://elderindex.co.uk` as the preferred hostname. The generated sitemap still referenced `https://www.elderindex.co.uk`. Correct the generated SEO URL origin without changing page paths or content.

## Code changes
- `src/config.mjs`: default `SITE_URL` from `https://www.elderindex.co.uk` to `https://elderindex.co.uk`.
- `scripts/production.mjs`: production `SITE_URL` from `https://www.elderindex.co.uk` to `https://elderindex.co.uk`.
- Generated sitemap, robots Sitemap directive, canonical tags and structured data inherit the shared base URL; actual production output must be verified.
- Commits: `6d29a52338e53dfba17242d91fa503de12791dda`, `650c83d162aec0246d3d30dd172035980ee8c13c`.

## Validation and status
- Configuration read back from GitHub on 2026-10-28: both source files reference the apex host.
- GitHub quality workflow for `650c83d` failed at policy/hygiene before build/test stages; this missing change record was the likely cause. CI must be rerun/rechecked.
- Cloudflare deployment Build #7ace8e12 was shown stuck at initializing build environment. The live production release and sitemap are **NOT VERIFIED** at this stage.
- Redirect from www to apex remains an account-level configuration task and is not implemented by this change.
- Historical documentation and the prepared, unbound apex-to-www redirect implementation remain a separate migration legacy and should not be deployed as written.

## Rollback
Revert the configuration changes above to return to the previous www origin if the domain strategy is deliberately reversed. Do not change DNS or production routes as a consequence of this log.
