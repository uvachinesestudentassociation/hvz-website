import { PIXEL as themePixel } from "@/content/theme";

/** Coffee ring — opt-in on one panel, not on every card */
export const DESK_RING = "desk-prop-ring desk-prop-ring--br";

/** Slight paper tilt — use on some panels only, not every card */
export const DESK_TILT = {
  left: "desk-prop-tilt desk-prop-tilt--left",
  right: "desk-prop-tilt desk-prop-tilt--right",
} as const;

/** Stapled manila folder cues — section backgrounds only */
const DESK_PROP_MANILA = "desk-prop-manila";

export const PIXEL_FRAME = themePixel.frame;

export const PIXEL_GRID_BG = themePixel.gridBg;

export const PIXEL_HERO_SURFACE = themePixel.heroSurface;

export const PIXEL_STAMP = themePixel.stamp;

export const PIXEL_SURFACE = themePixel.surface;

export const PIXEL_TEXT = themePixel.text;

export const PIXEL_TEXT_MUTED = themePixel.textMuted;

export const PIXEL_TEXT_SUBTLE = themePixel.textSubtle;

export const PIXEL_NAV_BG = themePixel.navBg;

export const PIXEL_SECTION_BORDER = themePixel.sectionBorder;

export const PIXEL_SECTION_PRIMARY = `${themePixel.sectionPrimary} ${DESK_PROP_MANILA}`;

export const PIXEL_SECTION_SECONDARY = themePixel.sectionSecondary;

export const RULE_BODY_CLASS = "font-mono text-base md:text-sm leading-relaxed break-words";
