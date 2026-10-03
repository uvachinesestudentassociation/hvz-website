# Plan 003: Do not render sealed bounty fields

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8edbae0..HEAD -- content/bounty.ts components/bounty-card.tsx app/page.tsx app/resources/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.
>
> **Prerequisite**: `pnpm test` exists (`plans/001-verification-baseline.md`). If it does not, stop and do plan 001 first.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-verification-baseline.md
- **Category**: bug
- **Planned at**: commit `8edbae0`, 2026-09-11

## Why this matters

`content/bounty.ts` tells Comm to fill in a name and photo, then set `BOUNTY_REVEALED` to true when players should see it. The card does not honor that. While the flag is false it still renders `name`, `reward`, `note`, and the image into the page (only blurred and `aria-hidden`). Today's values are placeholders (`CLASSIFIED`), so this is not a live spoiler. The next real bounty would be readable via view-source the moment someone follows the file's own instructions. After this plan, a sealed poster shows only the public sealed copy.

## Current state

- `content/bounty.ts` — `BOUNTY_REVEALED` is `false`. `ACTIVE_BOUNTY` is a placeholder with `name: "CLASSIFIED"`, empty `imageSrc`, `reward: "See Comm for details"`, and a note. Do not change those values. Do not invent a real bounty.
- `components/bounty-card.tsx` — no `"use client"` (server component). When `ACTIVE_BOUNTY` is set and `BOUNTY_REVEALED` is false, it still renders `target.name`, `target.reward`, `target.note`, and `target.imageSrc` inside a `blur-md` wrapper (`aria-hidden={!revealed}` around line 80). The sealed overlay uses `bounty.sealed` from theme copy, which is the public string.
- Call sites: `app/page.tsx` (inside `ScrollReveal`) and `app/resources/page.tsx`. Do not change those pages unless a STOP condition says the card can no longer be a server component.
- Theme copy for the vacant/sealed poster (`THEME_COPY.bounty.headline`, `vacant`, `sealed`) is public and should still show. Do not edit theme copy files.
- `README.md` does not mention bounty. Do not edit the README. It is existing editor documentation.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Sealed-field check | see done criteria | no sealed field interpolation |

## Scope

**In scope**:
- `lib/bounty-display.ts` (create)
- `lib/bounty-display.test.ts` (create)
- `components/bounty-card.tsx`
- `plans/README.md` (status row only)

**Out of scope**:
- `content/bounty.ts` values and comments, except if you must add a one-line import-safe note. Prefer not to edit it.
- `content/themes/**`, `app/page.tsx`, `app/resources/page.tsx`
- Tying reveal to `isGameLive`. That is a product choice, not this bug. A sealed bounty stays sealed until `BOUNTY_REVEALED` is true.
- `README.md`
- Theme gate / exec preview

## Git workflow

- Suggested branch if asked: `advisor/003-sealed-bounty`
- Message style if asked: `fix: keep sealed bounty fields out of the page`
- Do NOT commit, push, or open a PR unless the operator instructed it.

## Steps

### Step 1: Display helper

Create `lib/bounty-display.ts`. This is the only place that reads bounty secret fields for the UI.

```ts
import type { BountyTarget } from "@/content/bounty"

export type BountyDisplay =
  | { kind: "vacant" }
  | { kind: "sealed" }
  | {
      kind: "revealed"
      name: string
      imageSrc: string
      reward: string
      note?: string
      href?: string
    }

export function getBountyDisplay(
  target: BountyTarget | null,
  revealed: boolean,
): BountyDisplay {
  if (!target) return { kind: "vacant" }
  if (!revealed) return { kind: "sealed" }
  return {
    kind: "revealed",
    name: target.name,
    imageSrc: target.imageSrc,
    reward: target.reward,
    note: target.note,
    href: target.href,
  }
}
```

Create `lib/bounty-display.test.ts`:

- `getBountyDisplay(null, true)` is `{ kind: "vacant" }`
- `getBountyDisplay(null, false)` is `{ kind: "vacant" }`
- A target with `name: "SECRET NAME"` and `BOUNTY_REVEALED` false returns `{ kind: "sealed" }` and the result object has no `name` field (assert `"name" in display` is false)
- The same target with `revealed: true` returns `kind: "revealed"` and `name === "SECRET NAME"`
- Use a local object in the test. Do not import `ACTIVE_BOUNTY` into the test in a way that would fail when Comm changes the placeholder. Importing the type is fine.

**Verify**: `pnpm test -- lib/bounty-display.test.ts` → exit 0

### Step 2: Card reads the helper only

In `components/bounty-card.tsx`:

- Keep it a server component. Do not add `"use client"`.
- Call `getBountyDisplay(ACTIVE_BOUNTY, BOUNTY_REVEALED)` once.
- `kind: "vacant"` — keep the existing vacant poster (headline + `bounty.vacant`).
- `kind: "sealed"` — render the poster chrome (headline, sealed label from theme copy). Do not render a name, reward, note, image `src`, or link. A `?` placeholder is fine. Do not use `blur` to hide still-present text.
- `kind: "revealed"` — keep the current revealed layout (name, reward, note, optional image, optional link with `target="_blank"` and `rel="noopener noreferrer"`).
- Do not change theme class names, headline styling, or call sites.

**Verify**: `pnpm typecheck` → exit 0 and `pnpm test` → exit 0

## Test plan

- `lib/bounty-display.test.ts` as in step 1
- No React render test. The card must not read `target.name` / `target.reward` / `target.note` / `target.imageSrc` / `target.href` except by passing `ACTIVE_BOUNTY` into `getBountyDisplay`.

## Done criteria

- [ ] `pnpm test` exits 0
- [ ] `pnpm typecheck` exits 0
- [ ] `rg -n "target\\.(name|reward|note|imageSrc|href)" components/bounty-card.tsx` returns no matches
- [ ] `rg -n "blur-md" components/bounty-card.tsx` returns no matches
- [ ] `components/bounty-card.tsx` does not contain `"use client"`
- [ ] `content/bounty.ts` still has `BOUNTY_REVEALED = false` and the placeholder name `CLASSIFIED` (do not replace it with a real target)
- [ ] No files outside the in-scope list are modified
- [ ] `plans/README.md` status row for 003 is `DONE`

## STOP conditions

Stop and report back (do not improvise) if:

- `BountyCard` is imported by a file that starts with `"use client"`. Passing server-rendered children into `ScrollReveal` is OK (that is the current home page). Adding `"use client"` to the card is not the fix.
- The sealed poster cannot be built without interpolating `ACTIVE_BOUNTY` fields. Report what is missing from theme copy (`bounty.sealed`, `bounty.headline`). Do not copy secret fields into theme files.
- You are about to unseal automatically at game start. That is a different decision.

## Maintenance notes

- Comm still edits `content/bounty.ts` and flips `BOUNTY_REVEALED`. The source file will contain the name. That is fine: the name must not appear in the HTML while the flag is false. Server source is not the player-facing page.
- If someone later adds `"use client"` to `bounty-card.tsx` or passes `ACTIVE_BOUNTY` as a prop into a client component, the withhold breaks. Reviewers should reject that.
- README still does not list bounty in the Comm table. That doc update was deliberately left out of this plan.
