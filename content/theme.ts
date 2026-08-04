/**
 * Active event theme — re-exported for backward compatibility.
 *
 * To swap themes, change ACTIVE_THEME_ID in content/themes/index.ts.
 * Components should import from here or from @/content/themes directly.
 */
import { ACTIVE_THEME } from "./themes";

export const THEME_COLOR = ACTIVE_THEME.themeColor;
export const THEME_COLOR_LIGHT = ACTIVE_THEME.themeColorLight;

export const OFFICE = ACTIVE_THEME.office;
export const DESK = ACTIVE_THEME.desk;
export const THEME = ACTIVE_THEME.tailwind;
export const THEME_COPY = ACTIVE_THEME.copy;
export const PIXEL = ACTIVE_THEME.pixel;
export const HERO = ACTIVE_THEME.hero;

export { ACTIVE_THEME, ACTIVE_THEME_ID } from "./themes";
