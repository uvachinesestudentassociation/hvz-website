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

| Field           | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `gameYear`      | Season year (footer, countdown, “Game ON” banner) |
| `tagline`       | Hero subtitle (from `content/theme.ts`)           |
| `signupFormUrl` | “Start Night Shift” button link (via `content/links.ts`) |
| `contactEmail`  | Shown in rules                                    |
| `commChairs`    | Named in safe zone section                        |
| `url`           | Used for Open Graph / social previews             |

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

### Event theme (colors + copy) — `content/theme.ts`

FNAF night-shift styling and UI labels. Edit `THEME_COPY` for tagline, button text, and section headings. Edit `THEME_COLOR` for PWA/browser chrome. Revert to default HvZ values after the event.

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
components/
  game-countdown.tsx    Hero countdown (client)
  site-nav.tsx          Desktop + mobile navigation
  site-shell.tsx        Shared layout shell
  rules-content.tsx     Rules page renderer
  safe-zones-content.tsx
  resource-link-card.tsx
  heads-up-banner.tsx
content/                Editable rule copy + links + theme
lib/
  site-config.ts        Site constants
  game-start.ts         Countdown date/time
  public-resources.ts   Resource labels/icons (URLs from content/links.ts)
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
