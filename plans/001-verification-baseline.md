# Plan 001: Add a typecheck script and tests for game-start, search hrefs, and links

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8edbae0..HEAD -- package.json lib/game-start.ts lib/theme-gate.ts lib/search-index.ts content/links.ts lib/public-resources.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `8edbae0`, 2026-09-11

## Why this matters

There is no test script, no typecheck script, and no CI. The clock in `lib/game-start.ts` decides when the site unlocks and the countdown hits zero. Comm edits that file each season. Search hrefs and Google Form URLs are the other two things a bad edit silently breaks. This plan adds a one-command check so later plans (search deep links, sealed bounty, theme lock) can prove they did not break the clock or the link list. It does not change those behaviors.

## Current state

- `package.json` scripts are only `build`, `dev`, `lint`, and `start`. There is no `test` or `typecheck` script. `pnpm lint` runs `next lint`, but the repo has no ESLint config and no `eslint` / `eslint-config-next` dependency. Do not treat lint as a gate in this plan.
- `lib/game-start.ts` — start instant and live check. Year comes from `SITE_CONFIG.gameYear` (`2026` in `lib/site-config.ts`).

```34:55:lib/game-start.ts
export function getGameStartDate(): Date {
  const { month, day, hour, minute, utcOffsetHours } = GAME_START
  const year = SITE_CONFIG.gameYear
  const utcHour = hour - utcOffsetHours
  return new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0, 0))
}

export function getGameStartLabel(): string {
  const { month, day, hour, minute } = GAME_START
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const ampm = hour < 12 ? "AM" : "PM"
  const minuteStr = minute.toString().padStart(2, "0")
  return `${MONTH_NAMES[month - 1]} ${day}, ${hour12}:${minuteStr} ${ampm} Eastern`
}

export function getTimeUntilGameStart(now = Date.now()): number {
  return getGameStartDate().getTime() - now
}

export function isGameLive(now = Date.now()): boolean {
  return getTimeUntilGameStart(now) <= 0
}
```

Current constants: `month: 10`, `day: 26`, `hour: 0`, `minute: 0`, `utcOffsetHours: -4`. Midnight Eastern on that date is `2026-10-26T04:00:00.000Z` because `utcHour = 0 - (-4) = 4`.

- `lib/theme-gate.ts` — `isSiteUnlocked` is `!THEME_GATE.enabled || isGameLive(now)`. `THEME_GATE.enabled` is `true`. Do not change that flag in this plan.
- `lib/search-index.ts` — `buildSearchIndex()` / `searchRules(query)`. Heads-up hits use `href: "#heads-up"`. Every other hit uses `/rules#…` or `/safe-zones#…`. Empty/whitespace query returns `[]`. This plan characterizes the current hrefs; it does not fix `#heads-up` (that is plan 002).
- `content/links.ts` — `LINKS` object of Google URLs. `lib/public-resources.ts` maps every link except `signupForm` onto `PUBLIC_RESOURCES`.
- Package manager is pnpm (`pnpm-lock.yaml`). Node 20 is the documented recommendation (`README.md`).
- Commit messages look like `feat: …`, `fix: …`, `refactor: …`. Do not commit unless the operator asked.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install test runner | `pnpm add -D vitest` | exit 0, lockfile updated |
| Typecheck | `pnpm typecheck` | exit 0 |
| Tests | `pnpm test` | exit 0, all tests pass |
| Build (sanity) | `pnpm build` | exit 0 |

`pnpm lint` is **not** a success gate. It has no config. Do not add ESLint in this plan.

## Scope

**In scope** (the only files you should modify):
- `package.json` (scripts only, plus the vitest devDependency the install adds)
- `pnpm-lock.yaml` (whatever `pnpm add -D vitest` changes)
- `vitest.config.ts` (create)
- `lib/game-start.test.ts` (create)
- `lib/search-index.test.ts` (create)
- `lib/public-resources.test.ts` (create)
- `.github/workflows/ci.yml` (create)
- `plans/README.md` (status row only)

**Out of scope** (do NOT touch, even though they look related):
- `lib/game-start.ts`, `lib/theme-gate.ts`, `lib/search-index.ts`, `content/links.ts`, `lib/public-resources.ts` — characterization only; do not "fix" the clock, the `#heads-up` href, or the theme gate here.
- ESLint, `next lint`, `components/ui/**` — unused shadcn kit is not this plan.
- App components, CSS, theme files, API routes.
- `README.md` — it is existing editor documentation; do not rewrite it.

## Git workflow

- Suggested branch if the operator asks for one: `advisor/001-verification-baseline`
- Message style if they ask for a commit: `test: add typecheck and characterization tests for game start and links`
- Do NOT commit, push, or open a PR unless the operator instructed it.

## Steps

### Step 1: Add scripts and vitest

Add to `package.json` scripts (keep the existing scripts):

```json
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

Install vitest as a devDependency: `pnpm add -D vitest`.

Create `vitest.config.ts`:

```ts
import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

Do not add `jsdom`, Playwright, or React testing libraries. These tests import pure modules only.

**Verify**: `pnpm typecheck` → exit 0

### Step 2: Characterize game-start and the unlock clock

Create `lib/game-start.test.ts`. Import `getGameStartDate`, `getGameStartLabel`, `isGameLive`, `getGameEndDate` from `./game-start` and `isSiteUnlocked` from `./theme-gate`.

Assert the **current** constants, not a redesigned timezone library:

- `getGameStartDate().toISOString()` is `"2026-10-26T04:00:00.000Z"`
- `isGameLive(getGameStartDate().getTime() - 1)` is `false`
- `isGameLive(getGameStartDate().getTime())` is `true`
- `getGameStartLabel()` is `"October 26, 12:00 AM Eastern"` (hour `0` formats as 12 AM)
- `getGameEndDate().getTime() - getGameStartDate().getTime()` is `7 * 24 * 60 * 60 * 1000`
- `isSiteUnlocked(getGameStartDate().getTime() - 1)` is `false` while `THEME_GATE.enabled` is true
- `isSiteUnlocked(getGameStartDate().getTime())` is `true`

Do not mock `Date`. Pass `now` explicitly. Do not change `utcOffsetHours` or switch to `America/New_York`.

**Verify**: `pnpm test -- lib/game-start.test.ts` → exit 0

### Step 3: Characterize search hrefs and link URLs

Create `lib/search-index.test.ts`:

- `searchRules("")` and `searchRules("   ")` are `[]`
- `searchRules("stun")` has length > 0, and at least one result's `snippet` contains `"stun"` case-insensitively
- Import `SPECIFIC_RULES` from `@/content/rules` and `SAFE_ZONE_SECTIONS` from `@/content/safe-zones`. Every `rule.id` appears in some `buildSearchIndex()` href as `/rules#${rule.id}`. Every `zone.id` appears as `/safe-zones#${zone.id}`.
- Heads-up results (`id` starting with `heads-up-`) have `href === "#heads-up"` today. Every other href starts with `/`.

That last assertion is a characterization of a bug. Plan 002 changes it. Do not fix the href in this plan.

Create `lib/public-resources.test.ts`:

- Every value in `LINKS` (`@/content/links`) starts with `https://` and is non-empty
- Every `PUBLIC_RESOURCES` entry has `href` starting with `https://`
- No `PUBLIC_RESOURCES` entry has `id === "signupForm"`
- `getResource("killReport").href` equals `LINKS.killReport` (same for `questReport`)

Do not snapshot the full Google URLs as the thing that must never change. "present and https" is the contract.

**Verify**: `pnpm test` → exit 0, including the new files

### Step 4: CI

Create `.github/workflows/ci.yml` that runs on `push` and `pull_request`:

- checkout
- pnpm 9 (`pnpm/action-setup@v4`)
- Node 20 with pnpm cache
- `pnpm install --frozen-lockfile`
- `pnpm typecheck`
- `pnpm test`

Do not add `pnpm lint` or `pnpm build` to CI in this plan. Lint has no config. Build is slow and not required to lock the clock.

**Verify**: the workflow file exists and mentions `pnpm typecheck` and `pnpm test`. Do not need a GitHub remote to pass this step locally. `pnpm typecheck` and `pnpm test` still exit 0.

## Test plan

The tests listed above are the deliverable. There is no existing test file to copy. Use `node:assert/strict` or vitest `expect` — pick one and use it in all three files.

Covered cases:

- Game start instant, T=0 boundary, midnight label, 7-day end offset, unlock clock before and at start
- Search empty query, a known word (`stun`), section id coverage, current heads-up href
- Link https contract, signup form excluded from public resources, kill/quest hrefs wired through

## Done criteria

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test` exits 0
- [ ] `package.json` has `"typecheck": "tsc --noEmit"` and `"test": "vitest run"`
- [ ] `lib/game-start.test.ts`, `lib/search-index.test.ts`, and `lib/public-resources.test.ts` exist
- [ ] `.github/workflows/ci.yml` runs `pnpm typecheck` and `pnpm test`
- [ ] `git diff --stat` shows no modifications under `lib/game-start.ts`, `lib/search-index.ts`, `content/`, `app/`, or `components/` (test files next to `lib/` are expected; source behavior files are not)
- [ ] `plans/README.md` status row for 001 is `DONE`

## STOP conditions

Stop and report back (do not improvise) if:

- `getGameStartDate().toISOString()` is not `2026-10-26T04:00:00.000Z`. The constants drifted. Do not "fix" the test to a new date and do not change `GAME_START`.
- `pnpm add -D vitest` fails, or vitest cannot resolve `@/` imports after the config above. Report the error. Do not switch to Playwright or rewrite the modules into plain JS to make tests run.
- A test can only pass by changing `lib/game-start.ts`, `THEME_GATE.enabled`, or search hrefs.
- You are about to edit `components/ui/**` or add ESLint "while you're here."

## Maintenance notes

- When Comm changes `GAME_START` or `gameYear`, update `lib/game-start.test.ts` to the new expected UTC instant in the same edit. A red test is the point.
- Plan 002 will change the heads-up href assertion from `"#heads-up"` to an absolute path. That is expected; do not revert plan 002 to keep this characterization.
- `pnpm lint` is still unconfigured. A later change should add ESLint non-interactively and must not lint-fix `components/ui/**` unless those files are already in scope.
- Do not add a test that reads `EXEC_PREVIEW_CODE` or prints env values.
