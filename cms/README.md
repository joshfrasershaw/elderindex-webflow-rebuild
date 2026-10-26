# ElderIndex local visual editor

This is a working **local prototype**, on branch `feature/puck-local-cms`. It uses the open-source Puck editor inside a separate React application. It does not require a Puck account, subscription, cloud service or AI credits.

The **Website Design** page is editable. All 22 existing pages appear in the searchable dashboard; the other 21 remain read-only. Nothing here publishes to GitHub, Cloudflare or the live website.

## Start it on your computer

1. Install **Node.js 22.12 or newer** (the current Node LTS is suitable).
2. Unzip the supplied project archive. Open the resulting `elderindex-webflow-rebuild` folder.
3. Open a terminal **in that folder**. On Windows, right-click inside the folder and choose **Open in Terminal**. On macOS, open Terminal, type `cd `, drag the folder onto the terminal window, and press Return.
4. Enter these commands, one at a time:

```sh
npm ci
npm run cms:install
npm run cms:dev
```

5. Leave that terminal open. Open **http://127.0.0.1:4321** in your browser.

That address works on the computer running the commands. A server running in a Codex cloud workspace is not accessible through your own computer's `127.0.0.1`. No public preview address or `cms.elderindex.co.uk` deployment has been created.

To stop the editor, return to the terminal and press **Ctrl+C**. To start it again, run `npm run cms:dev` in the same folder. Your saved drafts and uploaded images remain there. If port 4321 is occupied, stop the other local editor first.

No browser-test download is needed to use the editor. Internet access is needed for the initial npm installations; subsequent editing uses local assets and local storage.

## Use the editor

- Open **Pages**, search for Website Design, and select **Edit page**.
- Click a heading or paragraph in the canvas to edit it. The right-hand panel also contains text fields, rich-text controls, button labels and button destinations.
- Select an image's section. In the right-hand panel, choose **Choose image** to reuse a website image, or **Upload image** for PNG, JPEG or WebP, up to 8 MB. Enter a meaningful image description (alt text). Uploads are converted into responsive WebP files.
- Drag a predefined block from **Blocks** into the page: content, text and image, feature grid, gallery, call to action, benefits or FAQs. Drag existing sections to change their order; **Outline** helps locate them. Select a section to use Puck's duplicate/delete controls. The original hero cannot be duplicated or deleted, and the enquiry form cannot be duplicated.
- Choose approved background and text colours, heading/body fonts, text alignment and image position where supported. Contrast choices adapt to the background. These controls retain the site's responsive layout instead of permitting arbitrary CSS.
- Use the **Desktop**, **Tablet** and **Mobile** icons above the canvas. Use **Undo** and **Redo** in the top bar while editing.
- Click **Page SEO settings** to review title, description, canonical and social-sharing metadata. The existing page address is locked. Indexing preferences are stored for a future publishing integration; all local previews are always `noindex, nofollow`.
- **Save draft** writes to this computer. A reload or server restart retains saved changes. Unsaved changes are not automatically saved; the browser warns before leaving.
- **Preview draft** opens a standalone preview of the current edits, including unsaved edits. It does not save or publish. Preview links to other pages open local, unchanged versions of those pages. Enquiry submissions are disabled, so testing cannot send a real Formspree enquiry.
- **Draft history** restores an earlier saved version as a new draft version. **Download backup** exports the saved draft and locally uploaded media as a ZIP. Save first to include your latest changes.

**Publish unavailable** is deliberately disabled. There is no publish shortcut and no GitHub credential in this app.

## Integration and files

The public site remains a static HTML build from `src/data.mjs`, `src/editorial.mjs`, `src/template.mjs` and `scripts/build.mjs`. Its URLs, metadata, content, internal links, Formspree integration, CSS and JavaScript have not been migrated or rewritten. Its existing Cloudflare configuration deploys **Workers static assets**, rather than a Cloudflare Pages project.

`cms/lib/model.mjs` adapts the rendered Website Design page into seven editable section types. It extracts typed content bindings while retaining original element structure, classes, images and styling. The React canvas and local HTML preview use those same immutable section definitions. Header, footer, navigation and form mechanics stay locked in this first prototype. Additional reusable blocks use the same ElderIndex design language.

| File | Purpose |
| --- | --- |
| `cms/server.mjs` | Loopback-only local server, draft/media/preview/backup API and Vite integration |
| `cms/src/main.jsx` | Page dashboard, media library, save/preview/history flows |
| `cms/src/editor.jsx` | Puck configuration, inline editing, section rendering and media picker |
| `cms/src/style.css` | CMS interface styling, isolated from public-site styling |
| `cms/lib/model.mjs` | Existing-page import, safe editable fields, validation and HTML preview |
| `cms/lib/storage.mjs` | Atomic draft storage, optimistic revision checking and history |
| `cms/content/website-design.json` | Portable initial Puck content snapshot |
| `cms/test/`, `cms/browser/` | Model, API and actual browser interaction tests |

The editor application is separate from `dist/`. `npm run build` still builds only the public website. `npm run cms:build` verifies the React production bundle; it does not make this development server suitable for public hosting.

## Content ownership, storage and backups

Content uses ordinary Puck JSON. No third-party content database is required.

- Saved draft: `cms/.local/website-design/draft.json`
- Previous saved drafts: `cms/.local/website-design/history/NUMBER.json`
- Uploaded files and their library index: `cms/.local/media/`
- Initial content: `cms/content/website-design.json`

The `.local` directory is ignored by Git, as are generated CMS bundles and test output. The archive supplied with this prototype excludes private drafts, uploads, environment files and dependencies.

Drafts contain a fingerprint of the original rendered page. If that source changes, the editor refuses to silently apply an incompatible saved draft. Back up the `.local` directory before updating the website source. A developer must then adapt the saved data to the changed section definitions.

To restore a downloaded backup, stop the editor, preserve a copy of the current `.local` folder, and extract the backup's `website-design` and `media` directories into `cms/.local/`. Restart the editor. The original project assets must also remain in `public/assets/`. The backup's current draft is portable; the backup does not include all historical draft versions. Copy the entire `.local` directory if you need that full history.

To deliberately regenerate the initial snapshot from the current static page, a developer can run `node cms/scripts/import.mjs`. This does not overwrite saved local drafts. Review the resulting JSON diff before accepting a source update.

Two tabs cannot silently overwrite each other: a stale save is rejected and requests a reload. This prototype is intended for one local editor process, not shared multi-user storage.

## Access and security boundary

This prototype has **no production login**. It binds only to `127.0.0.1`, checks the request Host, and requires a same-origin request plus a per-start CSRF nonce for writes. These checks protect a local development workflow; they are not an administrator authentication system. Other users/programs on the same computer can access the local server. Do not expose it through a public tunnel or bind it to a public interface.

The server validates section data, permitted colours, paths and links; sanitises edited rich text; rejects active upload formats such as SVG; verifies and re-encodes raster uploads; limits request and image sizes; uses atomic draft writes; and keeps all secrets out of browser content and exports. Local previews disable real enquiry submissions and analytics and are marked not for indexing. Production authentication, durable storage, authorisation and security review remain required.

## What comes next before a private production CMS

1. **Authentication:** protect `cms.elderindex.co.uk` using an approved identity solution, such as Cloudflare Access with owner-specific access rules and MFA. The CMS server must verify Access JWTs and authorised identities on every API and asset request; a hidden URL or front-end password is insufficient. Configure the domain and deployment only after approval.
2. **Production server and storage:** replace the Node/Vite local development host with a separately deployed authenticated CMS backend and production React assets. Use durable draft/media/version storage; Cloudflare Workers cannot rely on this prototype's local filesystem or native Sharp package. Adapt image processing/storage for the chosen hosting environment.
3. **GitHub publishing:** install a narrowly scoped server-side GitHub App for this repository. Keep private credentials in server-side secrets. An explicit Publish action should validate a complete draft, stage JSON and approved media, create a reviewable commit/PR, and run public build, accessibility, link and metadata checks. It must not write directly from a browser token. Distinguish draft rollback from published rollback.
4. **Static build integration:** teach the public build to consume approved CMS content through the shared section definitions. Currently public builds intentionally ignore local drafts. Preserve canonical URLs, schema, social tags, sitemap entries, meaningful internal links and existing primary page intent during this integration.
5. **Page management:** map remaining existing page types, then add page creation, duplication, deletion, slug validation, navigation changes, redirects and sitemap support with review safeguards. Keep service-specific SEO and enquiry routes intact. Website Design is the only editable page today.
6. **Full rollout:** test authenticated access, ownership/permissions, production preview separation, publishing failures, backups, rollback and responsive rendering before enabling the owner's live publishing flow.

For future clients, replicate the app/configuration with a separate repository, identity policy, storage and deployment per client. Keep content and media exportable and leave each client an independently buildable static website. No multi-tenant SaaS platform is introduced here.

## Validation

```sh
npm run cms:test
npm run cms:build
npm run build
npm run check
npm test
```

CMS browser tests use a separate temporary data directory and port 4322; API tests use port 4323. They do not touch your working drafts. On a machine without system Chromium, run `npx playwright install chromium`. You can override the executable with `CHROMIUM_PATH`. Browser testing is optional when simply using the editor.

Package choice was checked against the official Puck GitHub quickstart and API documentation: the maintained package is `@puckeditor/core`, pinned here to 0.23.0 with React 19. The documentation website returned HTTP 403 in this environment, so the official upstream documentation source was consulted instead: https://github.com/puckeditor/puck/tree/47a1050c1203f38bfdcb2dcb91c4abf03873ad74/apps/docs . No Puck cloud functionality is used.

## Hosted adapter update

A Cloudflare Workers adapter is now prepared separately under [hosted/](hosted/README.md), with Access JWT verification and durable cloud drafts/media. The owner has deployed the hosted adapter through Cloudflare; login/dashboard corrections are being verified. The local commands above continue to run the local editor; the hosted guide describes the separate browser-based deployment and its remaining account-access requirements. Public-site publishing remains disconnected in both modes.
