# CSA@UVA HvZ Website

Official rules and resources site for Humans vs. Zombies at UVA, built with [Next.js](https://nextjs.org/).

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, quick links, explore |
| `/resources` | All Google Sheets, Docs, and report forms |
| `/rules` | Full game rules with table of contents |
| `/safe-zones` | Safe zone details by location |

Mobile users get a sticky bottom nav for quick access to resources, rules, safe zones, and report forms. Use the search button to find specific rules.

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

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build (run `pnpm build` first) |
| `pnpm lint` | Run ESLint |

## Project structure

- `app/page.tsx` — home page
- `app/rules/page.tsx` — game rules
- `app/safe-zones/page.tsx` — safe zone rules
- `app/resources/page.tsx` — external resource links
- `content/` — rule text and structured content
- `lib/public-resources.ts` — Google Forms/Sheets links
- `lib/site-config.ts` — site-wide constants
- `components/site-nav.tsx` — desktop + mobile navigation

## Using npm instead of pnpm

You can use npm if you prefer, but pnpm is recommended to match the lockfile:

```bash
npm install
npm run dev
```
