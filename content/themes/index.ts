import { defaultTheme } from "./default";
import { fnafTheme } from "./fnaf";
import type { SiteTheme, ThemeId } from "./types";

/**
 * Switch the active event theme here — one line change.
 *
 * 1. Set ACTIVE_THEME_ID to the theme you want.
 * 2. Optionally add a new file under content/themes/ and register it below.
 * 3. Add matching CSS in app/themes/<id>.css (scoped with [data-site-theme="<id>"]).
 */
export const ACTIVE_THEME_ID: ThemeId = "fnaf";

const THEMES: Record<ThemeId, SiteTheme> = {
  fnaf: fnafTheme,
  default: defaultTheme,
};

export const ACTIVE_THEME = THEMES[ACTIVE_THEME_ID];

export function getTheme(id: ThemeId): SiteTheme {
  return THEMES[id];
}

export type { SiteTheme, ThemeId, ThemeCopy } from "./types";
