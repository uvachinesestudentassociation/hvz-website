import { PIXEL as themePixel } from "@/content/theme";

/** Coffee ring — opt-in per panel; pair with a DESK_RING position class */
export const DESK_RING_BASE = "desk-prop-ring";

/** Coffee ring positions — use at most one per surface, not on every panel */
export const DESK_RING = {
  br: `${DESK_RING_BASE} desk-prop-ring--br`,
  bl: `${DESK_RING_BASE} desk-prop-ring--bl`,
  tr: `${DESK_RING_BASE} desk-prop-ring--tr`,
  tl: `${DESK_RING_BASE} desk-prop-ring--tl`,
} as const;

/** Stapled manila folder cues — section backgrounds only */
export const DESK_PROP_MANILA = "desk-prop-manila";

export const PIXEL_BORDER = themePixel.border;

export const PIXEL_FRAME = themePixel.frame;

export const PIXEL_GRID_BG = themePixel.gridBg;

export const PIXEL_HERO_SURFACE = themePixel.heroSurface;

export const PIXEL_SURFACE = themePixel.surface;

export const PIXEL_TEXT = themePixel.text;

export const PIXEL_TEXT_MUTED = themePixel.textMuted;

export const PIXEL_TEXT_SUBTLE = themePixel.textSubtle;

export const PIXEL_NAV_BG = themePixel.navBg;

export const PIXEL_SECTION_BORDER = themePixel.sectionBorder;

export const PIXEL_SECTION_PRIMARY = `${themePixel.sectionPrimary} ${DESK_PROP_MANILA}`;

export const PIXEL_SECTION_SECONDARY = themePixel.sectionSecondary;

/** @deprecated Use PIXEL_SECTION_PRIMARY */
export const PIXEL_SECTION_EMERALD = PIXEL_SECTION_PRIMARY;

/** @deprecated Use PIXEL_SECTION_SECONDARY */
export const PIXEL_SECTION_AMBER = PIXEL_SECTION_SECONDARY;

export const RULE_BODY_CLASS = "font-mono text-base md:text-sm leading-relaxed break-words";
