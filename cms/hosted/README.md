# Hosted ElderIndex editor

The editor has a separate Cloudflare Workers deployment adapter. Initial deployment was confirmed by the owner-supplied Cloudflare build log on 26 October 2026; post-deployment login/dashboard fixes and owner verification are tracked separately. The live ElderIndex website remains hosted on Vercel. This editor is independent of the public site deployment and does not change the apex, www, portal or email DNS records.

## Configured identity and destination

- Worker: `elderindex-private-cms`
- Custom domain: `cms.elderindex.co.uk`
- Cloudflare account: `c27156f8f3cc29038495bf64fbf2bae7`
- Access issuer: `https://blue-hill-f7a1.cloudflareaccess.com`
- Application audience: owner-supplied public AUD tag, stored in `wrangler.jsonc`
- Allowed emails: `josh@elderindex.co.uk`, `joshfrasershaw@gmail.com`

The Cloudflare Access application and Josh Only policy were created by the owner through the dashboard. Those settings do not deploy the editor. The public identifiers above are not API credentials.

## Runtime

`hosted-build.mjs` builds the React editor, copies the existing website assets into its private asset directory, generates inert copies of public pages for contextual previews, and freezes the existing Website Design adapter. Public `dist/` and source files are untouched. Native Node filesystem access and Sharp are excluded from the Worker.

`worker.mjs` verifies the signed Cloudflare Access JWT before serving **any** API, preview, image, JavaScript or other asset. It checks signature, issuer, application audience, expiration, issue time, not-before time, subject and approved email. Missing configuration fails closed. It accepts a forwarded Access assertion or the Access session cookie only after complete cryptographic verification; it does not trust an email header alone. Signing-key requests use Workers-compatible manual redirect handling and reject redirects. Rejected sessions return a safe diagnostic code without exposing tokens, claims or raw internal errors. Writes also require the exact HTTPS Origin and a token-bound nonce. Responses are private/no-store and noindex. `run_worker_first` covers all assets; workers.dev and Cloudflare version preview URLs are disabled to prevent alternate public routes.

A single SQLite-backed Durable Object stores the current draft, the latest 30 saved versions, expiring preview snapshots and uploaded media. Atomic transactions reject stale saves. There is no shared local filesystem. Uploaded images are processed in the browser into a static WebP with maximum edge 1440 pixels. The server checks WebP headers/dimensions, limits individual files to 2 MB, and caps the hosted prototype library at 100 images / 20 MB. Media is stored in 64 KB chunks in the Durable Object. No R2 subscription or separate database service is required. Cloudflare usage limits and account eligibility still apply; no paid plan has been enabled by this code.

Backups export saved JSON and uploaded media. They can be downloaded through the authenticated editor. Hosted history retains the latest 30 versions. Source-fingerprint changes require a reviewed content migration; a backup can still be downloaded after a source mismatch.

## What the owner will get after deployment

Open `https://cms.elderindex.co.uk`, authenticate with either approved email using the Access login methods configured in Cloudflare, then edit Website Design. The other pages remain read-only. Save draft persists privately in Cloudflare. Preview includes unsaved edits without changing the public website. Image uploads work in supported browsers with Canvas WebP encoding. Site enquiries are disabled in previews.

**Publish remains unavailable.** This phase provides a hosted private editor and persistent drafts; it does not publish content into GitHub or Vercel. A reviewed GitHub publishing integration is still needed for that separate operation.

## Deployment handoff (no local commands needed by the owner)

First get this reviewed feature branch into GitHub. Do not merge it into `main` merely to deploy the editor: the public site's existing Cloudflare build uses that branch and a different Wrangler configuration.

In Cloudflare **Workers & Pages → Create application → Import a repository**, select this repository and the reviewed CMS branch. Create a **separate** Worker called `elderindex-private-cms`. Set:

| Setting | Value |
| --- | --- |
| Root directory | Repository root (`/`) |
| Build command | `npm ci && npm run cms:install && npm run cms:hosted:build` |
| Deploy command | `npx --prefix cms wrangler deploy --config cms/hosted/wrangler.jsonc` |
| Node version | 24, or another supported version >=22.12 |

The CMS package pins Wrangler. If the dashboard-generated build token is restricted to only one Worker, ensure it covers this new CMS Worker and creating its Durable Object namespace/migration. The initial deployment also needs permission to attach the custom domain in this account. Do not put an API token in repository files or browser settings. The custom domain route in the CMS Wrangler configuration connects only the `cms` hostname.

If Cloudflare requests a paid plan or any additional purchase, stop rather than accepting automatically. Confirm that the existing Access policy remains attached to the same hostname.

## Checks after deployment

1. Build and run all CMS tests. `npm run cms:hosted:browser` checks the compiled dashboard, the real Cloudflare static-assets handler and its redirects, signed test sessions, Media/Settings/Edit links, private media upload/reload, and editing/save/reload against local SQLite storage. Run `npm run cms:hosted:dry-run` to compile with Cloudflare's actual Wrangler bundler. A dry-run does not create resources or attach DNS.
2. Deploy using the separate CMS configuration. Verify that only the CMS hostname is attached; leave existing Vercel/email records unchanged.
3. Open a private browser window: the CMS must require Access authentication. An unapproved account must be denied.
4. Sign in with an approved account. Verify dashboard, images, inline text, section movement, mobile previews, upload, Save draft, page reload and download backup.
5. Verify direct `/api/pages/website-design`, `/assets/...`, `/preview/...` and `/cms-media/...` requests require Access. Test rejection of unauthorised writes and stale tabs.
6. Confirm edits remain drafts and the public website is unchanged. Confirm alternate workers.dev/version URLs are disabled.

Current validation covers JWT checks, draft/media state behavior, preview separation, browser conversion, existing local workflows, a successful Wrangler deployment dry-run, and a local workerd/SQLite Durable Object runtime smoke test (`npm run cms:hosted:runtime`). Live Access redirect behavior, account resource provisioning and the final custom-domain connection can only be verified after an authorised deployment.

## Publication status and current blocker

The review branch is `feature/puck-local-cms`; this document does not indicate a hosted deployment. Cloudflare CLI confirms that no deployment login is present in this execution environment. GitHub CLI reports its own token invalid, but the separate Git connection successfully passed a push dry-run and can be used for the review branch. The proposed deployment route is Cloudflare's dashboard Git integration. No passwords or API keys should be pasted into chat.
