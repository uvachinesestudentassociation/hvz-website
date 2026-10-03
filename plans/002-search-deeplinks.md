# Plan 002: Open the matching rule section from search, and make every search href absolute

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8edbae0..HEAD -- lib/search-index.ts components/hvz/pixel-disclosure.tsx components/heads-up-banner.tsx lib/search-index.test.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.
>
> **Prerequisite**: `plans/001-verification-baseline.md` is done and `pnpm test` exists. If `pnpm test` is not a script, stop and do plan 001 first.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-verification-baseline.md
- **Category**: bug
- **Planned at**: commit `8edbae0`, 2026-09-11

## Why this matters

Search is in the nav on every page (`components/site-nav.tsx` → `RuleSearch`). Result links point at section ids that live inside `hidden` panels. Nothing opens those panels on hash change, so the browser often never scrolls to the match and the player sees a closed section. Heads-up results use `href: "#heads-up"`, which is not a path. After this plan, every result href starts with `/`, and landing on a rules or safe-zone hash opens the disclosure that contains that id.

## Current state

- `lib/search-index.ts` — heads-up hits:

```37:44:lib/search-index.ts
  HEADS_UP_ITEMS.forEach((item, i) => {
    results.push({
      id: `heads-up-${i}`,
      section: headsUp.searchSection,
      title: headsUp.searchTitle,
      snippet: item,
      href: "#heads-up",
    })
  })
```

Other hrefs are already `/rules#${id}` or `/safe-zones#${id}`.

- `components/hvz/pixel-disclosure.tsx` — client component. Panel is `hidden={!open}`. `defaultOpen` is false. No `hashchange` listener. Inner section ids (for example `zombie-rules`, `residences`) are children of this panel, so a link to `#zombie-rules` targets a node inside a closed `hidden` panel.
- `components/heads-up-banner.tsx` — the element with `id="heads-up"` unmounts when dismissed (`if (!visible || isMobile === null) return null`). A hash link cannot find it after dismiss. The banner is mounted from `SiteShell` on every page.
- Plan 001 (if already landed) asserts heads-up hrefs are exactly `"#heads-up"`. You must update that assertion in this plan. If plan 001 has not landed, still fix the href and add the tests described below; do not invent a second test runner.
- Rule and safe-zone body text is existing game copy. Do not edit strings in `content/rules.ts`, `content/safe-zones.ts`, or `content/heads-up.ts`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `pnpm test` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Href check | `pnpm exec vitest run lib/search-index.test.ts` | exit 0 |

## Scope

**In scope**:
- `lib/search-index.ts` (heads-up href only)
- `lib/search-hash.ts` (create — pure helper)
- `lib/search-hash.test.ts` (create)
- `lib/search-index.test.ts` (update the heads-up assertion if the file exists)
- `components/hvz/pixel-disclosure.tsx`
- `components/heads-up-banner.tsx` (re-show when hash is `#heads-up`)
- `plans/README.md` (status row only)

**Out of scope**:
- Search ranking, result caps, or indexing resources. README limits search to rules and safe zones.
- Rewriting rule text, banner copy, or `components/rule-search.tsx` layout (the `Link` already uses `result.href`).
- Theme gate, bounty, anime.js motion on the chevron (keep the existing rotate effect).
- `components/ui/**`

## Git workflow

- Suggested branch if asked: `advisor/002-search-deeplinks`
- Message style if asked: `fix: open the matching section from search results`
- Do NOT commit, push, or open a PR unless the operator instructed it.

## Steps

### Step 1: Absolute heads-up href

In `lib/search-index.ts`, change heads-up `href` from `"#heads-up"` to `"/#heads-up"`.

The banner lives in the shell, so `/#heads-up` is the stable target from any page. Do not point heads-up hits at `/rules` unless a rules-page element with that id already exists (it does not).

Update `lib/search-index.test.ts` so **every** `buildSearchIndex()` href starts with `/`. Delete the characterization that allows `"#heads-up"`.

**Verify**: `pnpm exec vitest run lib/search-index.test.ts` → exit 0. If that file does not exist yet, add the absolute-href assertion in `lib/search-hash.test.ts` instead and still `grep` — see done criteria.

### Step 2: Pure "should this disclosure open?" helper

Create `lib/search-hash.ts`:

```ts
/** True when a URL hash names this disclosure or one of its descendant section ids. */
export function disclosureShouldOpen(
  hash: string,
  ownId: string | undefined,
  descendantIds: readonly string[],
): boolean {
  const id = hash.replace(/^#/, "")
  if (!id) return false
  if (ownId && id === ownId) return true
  return descendantIds.includes(id)
}
```

Create `lib/search-hash.test.ts` covering: empty hash false; `#zombie-rules` true when that id is a descendant; own id true; unrelated id false; hash without `#` still matches.

**Verify**: `pnpm test -- lib/search-hash.test.ts` → exit 0

### Step 3: Open the disclosure and scroll

In `components/hvz/pixel-disclosure.tsx`:

- Import `usePathname` from `next/navigation` and `disclosureShouldOpen` from `@/lib/search-hash`.
- After render, read `window.location.hash`. Collect descendant ids from the panel node (`document.getElementById(panelId)`), including nodes inside the `hidden` panel (`querySelectorAll("[id]")` — `hidden` does not remove nodes from the tree).
- If `disclosureShouldOpen` is true, `setOpen(true)`, then in `requestAnimationFrame` call `document.getElementById(hashId)?.scrollIntoView()`. The browser will not scroll to a `hidden` target on its own.
- Re-run on `hashchange` and when `usePathname()` changes (Next client navigation does not always fire `hashchange`).
- Do not change the chevron animation or `defaultOpen` default. Do not force every disclosure open.

Match the file's existing style (double quotes, the `PIXEL_*` classes already imported).

**Verify**: `pnpm typecheck` → exit 0

### Step 4: Re-show a dismissed heads-up banner for `/#heads-up`

In `components/heads-up-banner.tsx`, if `window.location.hash` is `#heads-up`, set `visible` to true. Listen for `hashchange` the same way. Do not change banner copy, colors, or the mobile portal markup.

When the banner is dismissed, the id unmounts. The listener must set `visible` true **before** you try to scroll, so the id exists again. After setting visible, scroll on the next frame if the hash is still `#heads-up`.

**Verify**: `pnpm typecheck` → exit 0 and `pnpm test` → exit 0

## Test plan

- `lib/search-hash.test.ts` — empty, own id, descendant, miss, hash with and without `#`
- Update `lib/search-index.test.ts` — no href may be `"#heads-up"`; every href starts with `/`
- The disclosure open/scroll behavior is the hook around that helper. Do not add a component test harness (no jsdom). The helper is the regression lock; the component must call it.

## Done criteria

- [ ] `pnpm test` exits 0
- [ ] `pnpm typecheck` exits 0
- [ ] `rg -n "href: \"#heads-up\"" lib/search-index.ts` returns no matches
- [ ] `rg -n "disclosureShouldOpen" components/hvz/pixel-disclosure.tsx` returns a match
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row for 002 is `DONE`

## STOP conditions

Stop and report back (do not improvise) if:

- Plan 001's test file asserts `"#heads-up"` and you cannot find it. Do not duplicate a second test runner.
- Opening the panel requires deleting `hidden={!open}` or always rendering rules expanded. That changes the page, not the search bug.
- A hash target is not a descendant of any `PixelDisclosure` and not `#heads-up`. Report the id. Do not add a second accordion system.
- Fixing this seems to require editing `content/rules.ts` text.

## Maintenance notes

- New rule subsections must keep a stable `id` on an element inside a `PixelDisclosure`. Search hrefs are `/rules#${id}` and `/safe-zones#${id}`.
- If the heads-up banner is removed from `SiteShell`, `/#heads-up` breaks. Point search at whatever element still has that id.
- Reviewer: confirm a search result for an inner rules id (not just the parent `basic-rules` id) opens the parent panel. The descendant-id test is the stand-in; a quick manual click on `/rules#zombie-rules` is the real check.
