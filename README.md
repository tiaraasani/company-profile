# Suitmedia company profile (redesign)

Company profile website built for Purwadhika Code Challenge 2: eight pages, login and a
Markdown blog on Backendless, with every page prerendered to static HTML for PageSpeed.
Student project, not affiliated with Suitmedia.

| Route | Page | Data | Prerendered | Auth |
|---|---|---|---|---|
| `/` | Home | static (`src/data`) | yes | public |
| `/about` | About Us | static | yes | public |
| `/services` | Services | static | yes | public |
| `/teams` | Teams | randomuser.me (seeded, cached in sessionStorage) | yes (skeleton) | public |
| `/blog` | Blog list | Backendless `Blog` | yes, revalidated on load | public |
| `/blog/<slug>` | Blog detail (Markdown) | Backendless `Blog` | yes for posts that exist at build time, client-rendered otherwise | public |
| `/blog/new` | Write a post | `POST /data/Blog` | no | **login required** |
| `/login` | Log in | `POST /users/login` | yes | anonymous only (signed-in users are redirected) |
| `*` | 404 | – | no | public |

## Run locally

```powershell
npm install
Copy-Item .env.example .env.local     # set VITE_BACKENDLESS_API_URL (see below)
npm run dev                            # http://localhost:5173
```

Production build and a Vercel-like preview (prerendered pages + `app.html` fallback):

```powershell
npm run build
npm run preview                        # http://localhost:4173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b`, client build, SSR build, then `scripts/prerender.mjs` writes one HTML file per route (and per published post) plus `dist/app.html` |
| `npm run preview` | Serves `dist` the way Vercel does (`/about` → `about/index.html`, unknown URLs → `app.html`) |
| `npm run typecheck` | `tsc -p tsconfig.app.json --noEmit` |
| `npm run lint` | ESLint (react-hooks v7 rules) |
| `npm run lint:a11y` | oxlint with the jsx-a11y plugin |

`.env.local` (git-ignored):

```
VITE_BACKENDLESS_API_URL=https://<subdomain>.backendless.app/api
VITE_SITE_URL=                          # production URL; enables canonical/og:url/sitemap
```

## Reviewer account

| | |
|---|---|
| Email | `demo@example.com` |
| Password | `Suitmedia123!` |

The login page has a "Fill in the reviewer account" button. Suggested walk-through:

1. Signed out, open **Write a post** in the header → redirected to `/login`.
2. Wrong password → inline alert ("Incorrect email or password") and focus moves to it.
3. Log in → sent back to `/blog/new`. Reload the page: still signed in, no flash (the stored token is validated with `GET /users/isvalidusertoken`).
4. Publish a post (Markdown, Write/Preview tabs, tags) → redirected to `/blog/<slug>` with a "published" notice; the post is first on `/blog`; the row in Backendless has `ownerId`.
5. Type in the editor, reload: the draft is restored (localStorage `cp:blog-draft`).
6. Filter by tag on `/blog` (`?tag=…`), open an unknown slug → inline 404.
7. Log out from the header → **Write a post** redirects to login again.

## Backendless setup

REST only, no SDK: `src/lib/backendless.ts` is a 100-line `fetch` wrapper that adds the
`user-token` header and maps errors (`3003` bad credentials, `3036` locked, `3064` dead
token → automatic sign-out).

### Tables

**Users** (built-in). Register accounts in Console → Data → Users, or with
`POST /users/register` (`email`, `password`, `name`). Registration and login must be
enabled under Users → Registration / Login (email confirmation off).

**Blog** (created by the app's first write through dynamic schema):

| Column | Type | Notes |
|---|---|---|
| `title` | STRING | 8–120 chars |
| `slug` | STRING | URL id; tick **Unique** + **Indexed** in the schema editor |
| `excerpt` | STRING | ≤200 chars |
| `content` | **TEXT** | Markdown body. Dynamic schema creates it as STRING(500); change the type to TEXT in Data → Blog → Schema or long articles fail with HTTP 413 |
| `tags` | STRING | stored as `,tag-one,tag-two,` so `LIKE '%,tag,%'` matches whole tags |
| `authorName` | STRING | copied from the user's `name` at publish time |
| `published` | BOOLEAN | the public queries filter on `published=true` |
| `ownerId`, `created`, `updated`, `objectId` | system | set by Backendless |

Turn dynamic schema off (Manage → App Settings) once the columns exist.

### Permissions (Data → table → Permissions tab)

Green check = allow, red cross = deny, grey = inherit from the global defaults, which
allow everything. So every operation the app does not need must be a red cross, not grey.
Set the three user roles; leave the API-key roles (RestUser, JSUser, …) grey.

| Table | Role | RETRIEVE (Find) | CREATE | UPDATE | REMOVE |
|---|---|---|---|---|---|
| Blog | NotAuthenticatedUser, GuestUser | ✅ | ❌ | ❌ | ❌ |
| Blog | AuthenticatedUser | ✅ | ✅ | ❌ | ❌ |
| Users | NotAuthenticatedUser, GuestUser, AuthenticatedUser | ❌ | ❌ | ❌ | ❌ |

The app never edits or deletes posts, so UPDATE/REMOVE stay denied for everyone. If an
edit/delete feature is added later, open them through the table's **Owner Policy** tab
(only the row owner), never through the AuthenticatedUser row. Denying RETRIEVE on
`Users` stops visitors from listing accounts; denying UPDATE/REMOVE there stops anyone
from changing another account's password or email. Login and logout keep working
because they are separate endpoints.

Also in the console:

- **Users → Registration**: disable public registration. The site has no sign-up page,
  so an open `POST /users/register` only hands write access to strangers. Create accounts
  in Data → Users instead.
- **Users → Login**: enable the account lockout (for example 5 failed attempts, 15 minutes;
  the app already shows the matching error 3036) and set a session timeout.
- **Data → Blog → Schema**: sizes and validators so the server enforces what the form
  enforces: `title` STRING(120), `excerpt` STRING(200), `authorName` STRING(80),
  `content` TEXT, `slug` STRING(80) with validator `^[a-z0-9]+(-[a-z0-9]+)*$` and
  **Unique**, `tags` with validator `^(,[a-z0-9-]{2,20}){0,5},?$`.

Verify from PowerShell (the reviewer account is public, so its token proves nothing
beyond "login works"):

```powershell
$base = 'https://<subdomain>.backendless.app/api'
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/users/login" -H 'Content-Type: application/json' -d '{\"login\":\"demo@example.com\",\"password\":\"Suitmedia123!\"}'   # 200
curl.exe -s -o NUL -w '%{http_code}' "$base/data/Users"                                                     # 403
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/data/Blog" -H 'Content-Type: application/json' -d '{\"title\":\"x\"}'   # 403 (no token)
curl.exe -s -o NUL -w '%{http_code}' -X POST "$base/users/register" -H 'Content-Type: application/json' -d '{\"email\":\"a@b.co\",\"password\":\"x\"}'   # not 200
curl.exe -s "$base/data/Blog?where=published%3Dtrue&pageSize=1"                                              # one post
```

## Security notes

- **Response headers** live in `vercel.json` and are also applied by `npm run preview`:
  a Content-Security-Policy (`script-src 'self'` plus one SHA-256 per inline script,
  `frame-ancestors 'none'`, `connect-src` limited to Backendless and randomuser.me),
  `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy`. `Cross-Origin-Opener-Policy: same-origin`
  was tried and dropped: it forces a browsing-context-group swap on navigation, which
  raised TBT by 50-120 ms in Lighthouse and made about one run in five fail with
  `NO_NAVSTART`; the site opens no popups, so the header bought nothing here.
- **Inline scripts and the CSP**: the theme script in `index.html` and the app loader in
  `vite.config.ts` are the only inline scripts. `scripts/check-csp.mjs` runs at the end of
  `npm run build` and fails with the new hash whenever one of them changes; paste that hash
  into the `script-src` directive. Markdown images may come from any `https:` host; fetches
  may only go to Backendless (any `*.backendless.app` subdomain or `api.backendless.com`)
  and randomuser.me.
- **Where clauses** are built with `quote()` (single quotes doubled, SQL-92 style) and only
  after the value passed an allowlist (`SLUG_PATTERN`, `TAG_PATTERN` in
  `src/features/blog/slugify.ts`), so URL input never reaches Backendless unchecked.
- **Build-time data**: `scripts/prerender.mjs` only prerenders posts whose slug matches
  `SLUG_PATTERN`, escapes the slug before writing it into HTML, and refuses to write
  outside `dist/`, so a malicious row cannot alter other pages during the build.
- **Reviewer account**: the credentials are intentionally public for grading. After grading,
  change the password in the console, delete `src/features/auth/demoAccount.ts`, and remove
  the two places that use it (`LoginPage.tsx`, `LoginForm.tsx`) plus the table above.
- **Session**: the Backendless token is kept in localStorage (`cp:auth`) and sent only to the
  configured API URL; `GET /users/logout` invalidates it server-side and the blog draft is
  cleared on logout.

## State management map

| State | Where | Mechanism |
|---|---|---|
| Auth session (`status`, `user`, `login`, `logout`) | `src/features/auth/AuthProvider.tsx` | Context; session in localStorage `cp:auth` read through `useSyncExternalStore`; token validated once per token; `3064` responses clear it |
| Route protection | `src/features/auth/ProtectedRoute.tsx` | `restoring` → skeleton, `anonymous` → `<Navigate state={{from}}>` |
| Theme | `src/context/ThemeProvider.tsx` | Context + localStorage `cp:theme`, pre-paint script in `index.html` |
| Remote data (team, posts, one post) | `src/lib/resource.ts` | `useResource(key, fetcher)` store: `useSyncExternalStore`, primed from build-time JSON, optional sessionStorage cache, revalidation, `reload()` |
| Blog draft | `src/features/blog/useBlogDraft.ts` | react-hook-form `watch` → debounced localStorage `cp:blog-draft`; restore banner + discard |
| Forms | `LoginForm.tsx`, `BlogForm.tsx` | react-hook-form + zod 4 (`z.input`/`z.output` for the tags transform), shadcn `Field` |
| URL state | `BlogListPage.tsx`, `LoginPage.tsx` | `useSearchParams` (`?tag=`), `location.state.from` |
| Local UI | Header, carousel, tabs | `useState`, adjust-state-during-render for route changes |

## Performance approach

- **Prerender per route** (`src/entry-server.tsx` + `scripts/prerender.mjs`): the HTML of
  every page is in the response, so LCP is a static `h1`. Blog data fetched at build
  time is embedded as `<script id="__RESOURCES__" type="application/json">` and primed
  into the store before hydration, so server and client markup match. The list
  revalidates after hydration so posts published after the deploy still show up.
- **Client-only URLs** (`/blog/new`, posts newer than the build, 404) get `dist/app.html`
  through the `vercel.json` rewrite; `main.tsx` preloads the page chunk before the first
  render (`src/lib/lazyWithPreload.ts`) so there is no skeleton-to-page layout shift.
- **Deferred app script**: the module script and its preloads are injected after the
  first frame (`deferAppScript` in `vite.config.ts`), keeping JavaScript off the LCP path.
- **Chunks**: `vendor` (router, radix, lucide), `forms` (react-hook-form + zod, Login and
  editor only), `MarkdownRenderer` (react-markdown + remark-gfm, article and preview only).
- Self-hosted Plus Jakarta Sans with `font-display: optional` and a metric-matched fallback.

Local Lighthouse 13 (`npm run preview`, Chrome headless, mobile / desktop):

| Route | Mobile P/A/BP/SEO | Desktop |
|---|---|---|
| `/` | 99 / 100 / 100 / 100 | 100 ×4 |
| `/about`, `/services`, `/teams` | 99 / 100 / 100 / 100 | 100 ×4 |
| `/blog` | 99 / 100 / 100 / 100 | 100 ×4 |
| `/blog/welcome-to-the-suitmedia-blog` | 99 / 100 / 100 / 100 | 100 ×4 |
| `/login` | 99 / 100 / 100 / 100 | 100 ×4 |
| `/blog/new` (redirects to login) | 98 / 100 / 100 / 100 | 100 ×4 |

## Deploy (Vercel)

1. Import the repo, set **Root Directory** to `company-profile` (framework preset Vite).
2. Environment variables: `VITE_BACKENDLESS_API_URL`, `VITE_SITE_URL=https://<project>.vercel.app`.
3. `vercel.json` already rewrites unknown URLs to `/app.html` and sets long cache headers for `/assets`, `/fonts`, `/images`.
4. Measure on the production alias (preview deployments inject the Vercel toolbar and `noindex`).

Posts published after the last deploy are served client-side until the next build; a
Vercel Deploy Hook triggered from the console (or a manual redeploy) prerenders them.
