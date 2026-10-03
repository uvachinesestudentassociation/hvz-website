# Plan 004: Withhold the site until game start or a signed exec-preview cookie

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8edbae0..HEAD -- app/layout.tsx app/globals.css lib/theme-gate.ts hooks/use-theme-gate.ts components/theme-gate.tsx components/site-shell.tsx app/api/exec-preview/route.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.
>
> **Prerequisite**: `pnpm test` exists (`plans/001-verification-baseline.md`). If it does not, stop and do plan 001 first.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-verification-baseline.md
- **Category**: security
- **Planned at**: commit `8edbae0`, 2026-09-11

## Why this matters

The overlay is not a lock. `SiteShell` is a client component. When it decides to hide `children`, Next has already serialized the page. The root layout always sets `data-site-theme` from `ACTIVE_THEME_ID` (`"fnaf"` today), and `app/globals.css` always imports the event CSS. Unlock is `localStorage` key `hvz-exec-preview-unlocked` set to `"1"`. The preview API returns `{ ok: true }` and sets no cookie, so the browser, not the server, decides. Players who look at the page source can read the event theme before game start. After this plan, a locked request does not render the site or the event theme, and the only pre-game unlock is an httpOnly cookie the server sets after checking `EXEC_PREVIEW_CODE`.

This is defensive maintenance. Do not add a demo of how to bypass the current overlay. Do not print or log the preview code.

## Current state

- `lib/theme-gate.ts` — `THEME_GATE.enabled` is `true`. `isSiteUnlocked(now)` is `!THEME_GATE.enabled || isGameLive(now)`. It does not look at a cookie. Keep `enabled` as the season kill-switch. Do not set it to `false`.
- `hooks/use-theme-gate.ts` — reads/writes `localStorage` key `hvz-exec-preview-unlocked`. Comment says a successful code unlock persists there. The hook ignores the dev live override on purpose (forcing "pre-game" must not re-lock). Preserve that idea: the dev panel must not be required for the lock, and must not be a production bypass.
- `components/site-shell.tsx` — if `showGate`, it returns `<ThemeGate onUnlock={grantBypass} />` and does not render `children`. That is the bug. The lock decision has to move to a **server** layout so `children` are not passed into a client component at all.
- `app/layout.tsx` — always renders `<html data-site-theme={ACTIVE_THEME_ID}>` and always mounts `SiteShell` around `children`. `ACTIVE_THEME_ID` is `"fnaf"` in `content/themes/index.ts`.
- `app/globals.css` line 4 — `@import "./themes/index.css";` which imports `fnaf.css` and `default.css` on every response.
- `app/api/exec-preview/route.ts` — `codesMatch` returns false immediately when buffer lengths differ, then `timingSafeEqual`. On success it returns `{ ok: true }` with no `Set-Cookie`. No throttle. Missing `EXEC_PREVIEW_CODE` returns 503 `{ error: "not_configured" }`. `.env.example` documents the variable name only. Never copy a code value into a file, test, or log.
- `components/theme-gate.tsx` — countdown plus a password form that POSTs `{ code }` to `/api/exec-preview`. It imports `getGameStartLabel` / `getTimeUntilGameStart` and `SITE_CONFIG` (year only). It does **not** import `@/content/theme`. Keep that. On `data.ok` it calls `onUnlock()`.
- `components/game-live-dev-panel.tsx` — renders only when `NODE_ENV === "development"`. Do not use that panel, or `?live=`, as the exec preview bypass. Leave the panel in the unlocked shell.
- Distinctive theme string that must not appear in a locked document: `Start Night Shift` (`content/themes/fnaf.ts`, `copy.joinButton`). Tagline that must also be absent: `Survive your shift. Don't let them reach you.`
- `public/hero-zombie-silhouette.svg` is a public file. Do not delete public assets. The locked page must not reference that path. Guessing a public URL is out of scope for this plan.

Repo conventions: TypeScript strict, `@/` imports, pnpm, Next.js 15 App Router (`cookies()` from `next/headers` is async). Client components that need hooks stay `"use client"`. The lock screen countdown already exists; reuse it rather than inventing a new visual.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Production build | `pnpm build` | exit 0 |

Do not run `pnpm lint`. It has no ESLint config.

## Scope

**In scope**:
- `lib/preview-cookie.ts` (create)
- `lib/preview-cookie.test.ts` (create)
- `lib/theme-gate.ts`
- `app/api/exec-preview/route.ts`
- `app/layout.tsx`
- `app/globals.css` (move the theme CSS import out)
- `components/unlocked-site.tsx` (create — server wrapper that imports theme CSS and renders the existing shell)
- `components/site-shell.tsx` (remove the client gate)
- `components/theme-gate.tsx` (reload after success; no localStorage callback)
- `hooks/use-theme-gate.ts` (delete if nothing imports it)
- `plans/README.md` (status row only)

**Out of scope**:
- Changing `ACTIVE_THEME_ID`, theme copy, `GAME_START`, or `THEME_GATE.enabled`
- `hooks/game-live-override.tsx`, `components/game-live-dev-panel.tsx` (dev-only live preview; not the lock)
- Bounty reveal (plan 003)
- Search, anime.js, Compacta / cdnfonts
- A new data store or rate-limit SaaS. See the in-memory limit in step 2 and the ceiling comment.
- Deleting files under `public/`

## Git workflow

- Suggested branch if asked: `advisor/004-theme-lock`
- Message style if asked: `fix: withhold the site until game start or a signed preview cookie`
- Do NOT commit, push, or open a PR unless the operator instructed it.

## Steps

### Step 1: Signed cookie and equal-length compare

Create `lib/preview-cookie.ts` using `node:crypto`. Cookie name: `hvz-exec-preview`.

- `previewCookieValue(secret: string, gameYear: number): string` — HMAC-SHA256 of `hvz-exec-preview:${gameYear}` (use `SITE_CONFIG.gameYear`), keyed by the secret, digest `base64url`. A cookie from another year must not unlock this season.
- `previewCookieMatches(cookieValue: string | undefined, secret: string, gameYear: number): boolean` — false if either side is missing. Compare HMAC outputs with `timingSafeEqual`. Both sides are the same length, so do not return early on the raw cookie string length in a way that skips the compare of the HMACs (if lengths of the two HMAC buffers differ, return false — that only happens for a truncated cookie, and the HMAC length is fixed).
- `codesMatch(input: string, secret: string): boolean` — SHA-256 of `input.trim().toUpperCase()` and SHA-256 of `secret.trim().toUpperCase()`, then `timingSafeEqual` on the two digests. Do not compare the raw code buffers. Do not branch on input length before hashing.

Cookie options when setting: `httpOnly: true`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`, `path: "/"`. `maxAge` is seconds until `getGameEndDate()`, with a floor of one day. Do not use a flat 14-day expiry — game start is 26 Oct 2026, so a short cookie dies before the week if an exec unlocks in September.

Create `lib/preview-cookie.test.ts` using a fixture secret defined in the test file only (a short literal used solely as a test key — do not read `EXEC_PREVIEW_CODE`, do not reuse a real code). Assert:

- `codesMatch` is true for the fixture regardless of case and surrounding spaces
- `codesMatch` is false for a different string of the same length and of a different length
- `previewCookieMatches` is true for `previewCookieValue(secret, gameYear)` and false for a different same-length string and for `undefined`
- A cookie value of `"1"` does not match
- A value produced with a different `gameYear` does not match

**Verify**: `pnpm test -- lib/preview-cookie.test.ts` → exit 0

### Step 2: API sets the cookie and slows mismatches

Update `app/api/exec-preview/route.ts` to use `codesMatch` from `lib/preview-cookie.ts` (delete the local copy).

On success, set the preview cookie to `previewCookieValue(secret, SITE_CONFIG.gameYear)` and return `{ ok: true }`.

On mismatch, wait 400ms, then return 401 `{ ok: false }`. Do not include which check failed.

Add a process-local failure window so a single instance stops answering a flood of wrong codes:

- Key: first hop of `x-forwarded-for`, or `"unknown"` if missing
- Window: 10 minutes, max 8 mismatches, then 429 `{ ok: false }`
- Mark the comment exactly: `ponytail: per-instance only on serverless; upgrade path is a shared store`

Do not log the request body. When `THEME_GATE.enabled` is false, keep the current `{ ok: true }` response and do not set a cookie. Missing secret stays 503.

**Verify**: `pnpm test` → exit 0 and `pnpm typecheck` → exit 0

### Step 3: Server decides unlock

In `lib/theme-gate.ts`, add a server-only helper (it may import `next/headers`):

```ts
export async function isRequestUnlocked(now = Date.now()): Promise<boolean>
```

True when `!THEME_GATE.enabled` or `isGameLive(now)`. Otherwise true only when `previewCookieMatches` the `hvz-exec-preview` cookie against `process.env.EXEC_PREVIEW_CODE`. If the env var is missing, return false (site stays locked; the API already returns 503).

Do not treat `NODE_ENV === "development"` as unlocked. Local preview uses the same code path and `.env.local`.

**Verify**: `pnpm typecheck` → exit 0

### Step 4: Locked layout does not render the site

This is the load-bearing step. A client `if (showGate) return <ThemeGate />` is not enough.

In `app/layout.tsx`:

- Make the default export `async`.
- Call `isRequestUnlocked()`.
- If locked, return `<html lang="en" data-site-theme="locked">` and a body that renders `ThemeGate` only. Do not render `{children}`. Do not render `SiteShell`, `ThemeProvider`, or `Analytics`. Do not set `data-site-theme` to `ACTIVE_THEME_ID`.
- If unlocked, keep the current tree (theme provider, skip link, `SiteShell`, analytics) with `data-site-theme={ACTIVE_THEME_ID}`.

Move `@import "./themes/index.css"` out of `app/globals.css`. Import that CSS from `components/unlocked-site.tsx`, which is imported only by the unlocked branch of the layout. `unlocked-site.tsx` can re-export or wrap `SiteShell`.

`ThemeGate` must not import `@/content/theme` or `@/content/themes`. It already does not. After a successful POST, stop calling an unlock callback that writes `localStorage`. Call `window.location.assign(window.location.pathname)` so the next document is rendered by the server with the cookie. Keep the countdown and the existing form UI.

Remove the client gate from `components/site-shell.tsx` (`useThemeGate`, `ThemeGate`, the resolving black screen). Always render the shell body. Delete `hooks/use-theme-gate.ts` if no imports remain.

Do not read `localStorage` for unlock anywhere. Grep at the end.

**Verify**: `pnpm typecheck` → exit 0 and `pnpm build` → exit 0

### Step 5: Locked document check

With the production build available, prove the lock does not embed the event theme. Pick one:

- A small node test that imports `getBountyDisplay`-style... no, do not add a browser runner.
- After `pnpm build`, start `pnpm start` on a port, request `/` with no cookie while `THEME_GATE.enabled` is true and game start is in the future, save the HTML, and assert it does not contain `data-site-theme="fnaf"`, `Start Night Shift`, or `Survive your shift. Don't let them reach you.` Then stop the server.

If you cannot bind a port, do not skip the check silently. Report that the HTML assertion was not run, and still satisfy the static greps in done criteria.

Do not put the preview code in the request. A locked request has no cookie; that is the case you are checking.

**Verify**: the saved HTML does not contain those three strings, or you stopped under the STOP conditions.

## Test plan

- `lib/preview-cookie.test.ts` — case folding, length-independent mismatch, cookie `"1"` rejected, missing cookie rejected
- Do not add a test that calls `fetch` against production or that embeds a real `EXEC_PREVIEW_CODE`
- Existing `lib/game-start.test.ts` must still pass. Do not change expected UTC instants.

## Done criteria

- [ ] `pnpm test` exits 0
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm build` exits 0
- [ ] `rg -n "hvz-exec-preview-unlocked|localStorage" hooks components app` returns no matches (quote paths as needed)
- [ ] `rg -n "data-site-theme=\{ACTIVE_THEME_ID\}" app/layout.tsx` is not the only branch — the locked return uses `data-site-theme="locked"`
- [ ] `app/globals.css` does not contain `themes/index.css`
- [ ] `components/theme-gate.tsx` does not import `@/content/theme`
- [ ] `app/api/exec-preview/route.ts` sets the `hvz-exec-preview` cookie on success and uses `codesMatch` from `lib/preview-cookie.ts`
- [ ] No files outside the in-scope list are modified
- [ ] `plans/README.md` status row for 004 is `DONE`

## STOP conditions

Stop and report back (do not improvise) if:

- The excerpts in "Current state" do not match (gate already server-side, or `THEME_GATE.enabled` is already false).
- Next still emits the event theme stylesheet on the locked document after the CSS import move (the unlocked wrapper is statically pulled into the locked route). Report that and do not paper over it by only renaming `data-site-theme` while leaving `SiteShell` in the locked tree.
- Implementing the lock requires setting `THEME_GATE.enabled` to false, or adding a `NODE_ENV` bypass, to make local dev work. Document that `.env.local` needs `EXEC_PREVIEW_CODE` instead. Do not weaken production.
- A step would require printing, committing, or snapshotting `EXEC_PREVIEW_CODE`.
- `cookies()` from `next/headers` is not async in this Next version and the plan's `await` fails typecheck twice. Report the signature you see. Do not guess a second API.

## Maintenance notes

- After game week, Comm can set `THEME_GATE.enabled` to `false` or leave it true; once `isGameLive` is true the cookie is unnecessary. Do not delete the cookie helper just because the week started.
- The failure window does not survive a new serverless instance. Do not pretend it is a global lockout. If the code is short, prefer rotating `EXEC_PREVIEW_CODE` over building a store.
- Reviewer: the locked branch of `app/layout.tsx` must not render `children`. That is the whole fix. A cookie without that early return is still an overlay.
- Future themes: the locked page stays on `data-site-theme="locked"` and must not import the new theme module. Unlock still happens at `GAME_START` with no code.
