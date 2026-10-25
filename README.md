<p align="center">
  <img src="public/images/csa_square_logo.png" alt="CSA at UVA" width="140" />
</p>

# CSA@UVA HvZ

The site players open during game week. Rules, safe zones, and the forms, dressed up as a night-shift security office.

**Play it:** [hvz.csaatuva.com](https://hvz.csaatuva.com)

A wide screen gets the 3D desk. A phone gets the simpler page, with the nav glued to the bottom. Same info either way.

## Pages

- [Home](https://hvz.csaatuva.com/) is the desk. Click an object and it opens that sheet or form in a new tab.
- [Rules](https://hvz.csaatuva.com/rules) is the full rulebook, searchable.
- [Safe zones](https://hvz.csaatuva.com/safe-zones) is where you cannot get tagged.
- [Resources](https://hvz.csaatuva.com/resources) is every link in one grid.

The outside links themselves (kill form, quest form, quest board, lists) live in [`content/links.ts`](content/links.ts). Blank a URL and that button hides.

## Changing the game

You usually do not need to touch layout code.

| Change this | File |
| --- | --- |
| Year, email, comm names | [`lib/site-config.ts`](lib/site-config.ts) |
| When the countdown hits zero | [`lib/game-start.ts`](lib/game-start.ts) (`month`, `day`, `hour`, `minute`, Eastern offset) |
| Forms, sheets, quest board | [`content/links.ts`](content/links.ts) |
| Rule text | [`content/rules.ts`](content/rules.ts), [`content/things-to-note.ts`](content/things-to-note.ts), [`content/heads-up.ts`](content/heads-up.ts) |
| Safe zones | [`content/safe-zones.ts`](content/safe-zones.ts) |
| Who the bounty is | [`content/bounty.ts`](content/bounty.ts) |

The look is the `fnaf` theme. To go back to the plain purple site after game week, set `ACTIVE_THEME_ID` to `"default"` in [`content/themes/index.ts`](content/themes/index.ts). A new theme is a file in `content/themes/` plus a matching `app/themes/<id>.css`.

## Run it locally

Node 20 and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

Then open [localhost:3000](http://localhost:3000). `pnpm build` is the production check. Push the branch and Vercel ships it.
