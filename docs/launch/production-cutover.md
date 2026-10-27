# Separate production targets and owner cutover — 27 October 2026

**Prepared and locally testable; no account deployment, domain binding or DNS change is performed by these files/commands until the owner explicitly executes them.** The existing Vercel website and staging Worker remain unchanged.

## Targets

| Role | Worker/config | Exposure before cutover |
| --- | --- | --- |
| Existing staging | `elderindex-webflow-rebuild` / `wrangler.jsonc`, assets `dist/` | Existing workers.dev stays staging/noindex |
| Prepared www production | `elderindex-public-production` / `wrangler.production.jsonc`, assets `dist-production/` | workers.dev and preview URLs disabled; no domains/routes configured |
| Prepared apex redirect | `elderindex-public-apex` / `wrangler.apex-redirect.jsonc` | workers.dev and preview URLs disabled; no domains/routes configured |

Prepared account ID `c27156f8f3cc29038495bf64fbf2bae7` is the account referenced by current staging Cloudflare checks. It is an identifier, not a credential. Authenticated Cloudflare/Vercel/Formspree/mail access is unavailable to this task. Confirm the new Worker names are unused or the intended unbound targets before owner deployment; do not overwrite an unrelated application.

## Build and verify without changing staging

Use Node 24 and the locked dependencies, on the accepted clean main revision:

```bash
npm ci
npm run build
npm run check
npm run check:release
npm run test:production-targets
npm run build:production
npm run check:production
npm run check:runtime:production
npm run check:runtime:apex
```

`build:production` forces `SITE_ENV=production`, `SITE_URL=https://www.elderindex.co.uk`, `BUILD_OUTPUT_DIR=dist-production`; it never overwrites `dist/`. Strict checks identify the exact clean checkout. Production contains 30 canonical pages, 126 rules and the 60-path migration map; 27 commercial/informational/reference pages are indexable, three unapproved legal notices remain draft/noindex. Staging remains noindex in HTML and headers. CI checksums staging files before/after isolated production verification. Output-directory guards prevent arbitrary deletion and reject a staging build in the production directory.

The public production archive includes `release.json`; verify `sourceSha`, `trackedChanges:false`, `environment:production` and `canonicalOrigin:https://www.elderindex.co.uk`. A build, deployment, owner binding and actual public launch are separate events.

## Owner account steps BEFORE any domain switch

1. Confirm legal notice facts/approval and find exactly one test `EI-LAUNCH-20261027161513` in Formspree and the intended inbox; check reply destination and that the production origin `https://www.elderindex.co.uk` is allowed by actual form/spam settings.
2. Export the authenticated Cloudflare DNS zone plus proxy state, redirect rules, Worker routes and bindings. Record the current old-site Vercel **project and serving deployment ID** and how to restore it. No authenticated Vercel deployment ID is available from this checkout; GitHub’s deployment list is empty. Do not substitute a Git SHA, request ID or Next.js build ID.
3. Authenticate locally to the correct Cloudflare account (`npx wrangler login` if needed; never paste tokens into chat). Confirm target names, then deploy **unbound** targets from the accepted clean source:

```bash
npm run build:production
npm run check:production
npx wrangler deploy --config wrangler.production.jsonc
npx wrangler deploy --config wrangler.apex-redirect.jsonc
```

These explicit configs have no route/custom-domain entries and no workers.dev/preview exposure. They do not change the existing staging Worker or Vercel routing. Record returned Worker version IDs. Do not replace the staging project’s build/deploy commands with these production commands.

## Initial domain switch — OWNER ONLY, after all critical gates close

1. In Workers & Pages → production Worker → Settings → Domains & Routes, connect **www.elderindex.co.uk** to `elderindex-public-production` using Cloudflare’s actual Custom Domain flow. Inspect existing bindings/routes before confirming; follow the dashboard’s real DNS conflict instructions rather than guessing a CNAME to workers.dev.
2. Connect **elderindex.co.uk** to `elderindex-public-apex`. Never bind www to this redirect Worker: it deliberately returns 421 for www to prevent a self-redirect loop.
3. Check the account’s HTTPS/redirect rules and remove or adjust only conflicting **web** rules as part of the approved cutover. The apex Worker redirects both HTTP and HTTPS requests directly to HTTPS www and maps known old paths to canonical destinations in the same hop. A blanket account “Always Use HTTPS” rule may add a preliminary hop on HTTP apex; prefer a hostname-scoped www HTTPS rule while apex is handled directly by its Worker. This is an account plan, not a claim those settings were changed or already verified. Verify certificate readiness and no loops before declaring live.
4. Do not change nameservers again or modify MX/SPF/DKIM/DMARC, verification, cms, portal, autodiscover or domainconnect records. Only confirmed web-domain bindings/records are part of this switch.

## Tested request matrix and post-binding acceptance

- www HTTPS: all 30 pages 200; correct canonical/indexability, assets, robots, sitemap; all 126 explicit rules 301 → direct 200 with query preserved. Unknown/CMS/API paths real 404.
- Apex HTTP and HTTPS: all 60 inventoried old paths have a direct 301 to the correct **HTTPS www canonical**, query preserved. Original shortcuts/slash variants share the exact same rule source as static www; no duplicated independent migration map.
- Apex canonical/asset paths: path/query preserved and host fixed to www. Unknown host → 421, POST → 405; no open redirect or www self-loop.
- Local workerd verifies real Host-header handling for the prepared apex bundle. Public certificates/account redirect order cannot be proved by local emulation and must be checked immediately after owner binding.
- After binding: inspect release.json at www, `http://` and `https://` on both hostnames, each old URL, robots/sitemap, 404, mobile navigation and one confirmed live enquiry. Verify the exact accepted SHA, production environment and no residual global noindex. Record actual verified UTC and retain both deployment version IDs.

## Recovery (owner)

Preserve the old Vercel project/deployment and authenticated export first. Public observations are only a reference: apex A `216.198.79.1`; www CNAME `19c7fb3e4d54c23b.vercel-dns-017.com`; nameservers Alexis/Aron Cloudflare. Refresh against the actual account export before changing anything.

If the replacement fails, remove/undo replacement apex/www Custom Domain bindings or Worker routes that intercept requests, then restore only the old web DNS/proxy/redirect configuration and retained Vercel deployment from the saved account state. Simply restoring an A record may leave a Worker route active. Retain all mail/CMS/portal and verification records. Verify old www pages/contact/HTTPS and apex redirect and record rollback UTC. Code recovery is a selective revert of the launch-preparation implementation, with all release checks before pushing; it is not a DNS rollback.
