# CSA@UVA HvZ Website

Official rules and resources site for Humans vs. Zombies at UVA, built with [Next.js](https://nextjs.org/).

## Pages

| Route         | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `/`           | Home — hero, countdown, quick links (kill/quest forms, quest board), explore |
| `/resources`  | All Google Sheets, Docs, and report forms                                    |
| `/rules`      | Full game rules with table of contents                                       |
| `/safe-zones` | Safe zone details by location                                                |

**Mobile:** sticky bottom nav for resources, rules, safe zones, kill form, and quest form. Search (FAB on mobile, nav link on desktop) finds text across rules and safe zones.

**PWA:** players can add the site to their home screen via the browser (see `public/manifest.json`).

## Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later (Node 20+ recommended)
- [pnpm](https://pnpm.io/installation) (this repo uses a `pnpm-lock.yaml`)

If you do not have pnpm installed:

```bash
npm install -g pnpm
```

## Run locally

1. Clone the repository and open the project folder:

   ```bash
   git clone <repository-url>
   cd hvz-website
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The dev server reloads automatically when you edit files.

## Other commands

| Command      | Description                                         |
| ------------ | --------------------------------------------------- |
| `pnpm dev`   | Start the development server                        |
| `pnpm build` | Create a production build                           |
| `pnpm start` | Serve the production build (run `pnpm build` first) |
| `pnpm lint`  | Run ESLint                                          |

## Updating content (for Comm)

Most game-week edits are a few config files — no need to touch layout code.

### Site-wide settings — `lib/site-config.ts`

| Field           | Purpose                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `gameYear`      | Season year (footer, countdown, “Game ON” banner)                                        |
| `tagline`       | Hero subtitle (from the active event theme)                                              |
| `signupFormUrl` | Join-game button link (via `content/links.ts`; button label comes from the active theme) |
| `contactEmail`  | Shown in rules                                                                           |
| `commChairs`    | Named in safe zone section                                                               |
| `url`           | Used for Open Graph / social previews                                                    |

### Game start countdown — `lib/game-start.ts`

Controls the hero countdown before the game goes live:

```ts
export const GAME_START = {
  month: 10, // 1–12
  day: 26,
  hour: 0, // 0 = midnight, 12 = noon
  minute: 0,
  utcOffsetHours: -4, // -4 = EDT, -5 = EST
};
```

The year is taken from `gameYear` in `lib/site-config.ts`. After the start time passes, the countdown switches to a “Game ON” message.

### External links — `content/links.ts`

Google Forms, Sheets, Docs, and the Quest Board Slides URL. High-priority items (Kill Report, Quest Report) appear first on the home page and in the mobile nav.

### Event theme — `content/themes/`

The site supports swappable event themes (colors, copy, hero effects, and UI styling). Components read from the active theme via `content/theme.ts`, which re-exports the current theme’s values.

**To switch themes**, change one line in `content/themes/index.ts`:

```ts
export const ACTIVE_THEME_ID: ThemeId = "default"
```

| Theme ID  | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `default` | Baseline purple HvZ — plain hero, no event effects               |
| `fnaf`    | Night-shift / security-office event theme (CRT static, desk UI) |

Each theme file under `content/themes/` defines:

| Export area       | What it controls                                              |
| ----------------- | ------------------------------------------------------------- |
| `copy`            | Tagline, join button text, section headings, countdown labels |
| `tailwind`        | Accent, alarm, monitor, and button class groups               |
| `pixel`           | Border, surface, and section background classes               |
| `hero`            | Background layers, logo style, and event hero effects         |
| `office` / `desk` | Light/dark shell palette tokens                               |
| `themeColor`      | PWA / browser chrome color                                    |

Matching CSS variables and hero-specific styles live in `app/themes/<id>.css`, scoped with `[data-site-theme="<id>"]`. The root layout sets `data-site-theme` on `<html>` from `ACTIVE_THEME_ID`.

**After an event**, set `ACTIVE_THEME_ID` to `"default"` (or swap in a new theme for the next game week).

**To add a new theme:**

1. Create `content/themes/my-theme.ts` implementing `SiteTheme` (see `types.ts`).
2. Register it in `content/themes/index.ts`.
3. Add `app/themes/my-theme.css` with `[data-site-theme="my-theme"]` selectors.
4. Import the CSS file in `app/themes/index.css`.
5. Set `ACTIVE_THEME_ID = "my-theme"`.

### Rule text — `content/`

| File                        | Contents                                 |
| --------------------------- | ---------------------------------------- |
| `content/heads-up.ts`       | Latest rule tweaks (banner + rules page) |
| `content/things-to-note.ts` | Warnings and honor code block            |
| `content/rules.ts`          | Basic and specific rules                 |
| `content/safe-zones.ts`     | Safe zone sections                       |

Rule search on the site indexes this same content.

## Project structure

```
app/
  page.tsx              Home
  rules/page.tsx        Game rules
  safe-zones/page.tsx   Safe zones
  resources/page.tsx    All external links
  layout.tsx            Root layout, metadata, analytics
  themes/               Per-theme CSS variables and hero styling
components/
  game-countdown.tsx    Hero countdown (client)
  site-nav.tsx          Desktop + mobile navigation
  site-shell.tsx        Shared layout shell
  rules-content.tsx     Rules page renderer
  safe-zones-content.tsx
  resource-link-card.tsx
  heads-up-banner.tsx
content/
  themes/               Event theme definitions (default, fnaf, …)
  theme.ts              Re-exports active theme for components
  heads-up.ts           Latest rule tweaks (banner + rules page)
  things-to-note.ts     Warnings and honor code block
  rules.ts              Basic and specific rules
  safe-zones.ts         Safe zone sections
  links.ts              External form/sheet URLs
lib/
  site-config.ts        Site constants
  game-start.ts         Countdown date/time
  public-resources.ts   Resource labels/icons (URLs from content/links.ts)
  theme-gate.ts         Optional exec preview gate for event themes
```

## Using npm instead of pnpm

You can use npm if you prefer, but pnpm is recommended to match the lockfile:

```bash
npm install
npm run dev
```

## Deploy

The site is configured for [Vercel](https://vercel.com/) (Analytics, standard Next.js build). Push to your connected branch and Vercel runs `pnpm build`.

After changing config or content, commit and push — or redeploy from the Vercel dashboard.
