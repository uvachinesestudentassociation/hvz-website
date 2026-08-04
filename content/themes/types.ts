/** Identifiers for swappable event themes — add new themes here and in the registry. */
export type ThemeId = "fnaf" | "default";

export interface HeroBackgroundLayer {
  gradient: string;
  grid: string;
  scanline: string;
  vignette: string;
  floorLight: string;
  floorDark: string;
  floorBase: string;
  noiseOpacity: number;
}

export interface HeroBackgroundDark {
  baseColor: string;
  scanlineFine: string;
  scanlineCoarse: string;
  vignette: string;
}

export interface ThemeCopy {
  tagline: string;
  joinButton: string;
  joinButtonDisabled: string;
  guardBadgeActive: (badgeNumber: string) => string;
  guardBadgeAwaiting: string;
  nightCheckIn: (hour: 12 | 3 | 6) => string;
  missingPoster: {
    headline: string;
    subline: string;
    cta: string;
  };
  headsUp: {
    title: string;
    footer: string;
    searchSection: string;
    searchTitle: string;
  };
  sections: {
    quickLinks: string;
    alsoCheck: string;
    explore: string;
    countdown: string;
    gameOn: (year: number) => string;
  };
}

export interface SiteTheme {
  id: ThemeId;
  /** Human-readable label (for docs / tooling). */
  name: string;
  themeColor: string;
  themeColorLight: string;
  hero: {
    background: {
      light: HeroBackgroundLayer;
      dark: HeroBackgroundDark;
    };
    /** FNAF-style hanging sign + wired logo, or a plain heading. */
    logoStyle: "fnaf-sign" | "plain";
    showSignMount: boolean;
    showTvStatic: boolean;
    showZombieSilhouette: boolean;
  };
  office: {
    laminate: string;
    laminateLight: string;
    paper: string;
    manila: string;
    border: string;
    text: string;
    textMuted: string;
    fluorescent: string;
    windowGlow: string;
  };
  desk: {
    wood: string;
    woodLight: string;
    paper: string;
    manila: string;
    border: string;
    text: string;
    textMuted: string;
    lamp: string;
    monitorGlow: string;
  };
  tailwind: {
    accent: {
      text: string;
      textDark: string;
      textHover: string;
      bg: string;
      bgSubtle: string;
      border: string;
      ring: string;
      link: string;
      linkUnderline: string;
      navActive: string;
    };
    alarm: {
      text: string;
      textStrong: string;
      bg: string;
      bgLight: string;
      border: string;
      nav: string;
    };
    monitor: {
      text: string;
      bg: string;
      border: string;
    };
    warning: {
      text: string;
      bg: string;
      border: string;
    };
    button: {
      bg: string;
      border: string;
    };
  };
  pixel: {
    border: string;
    frame: string;
    gridBg: string;
    heroSurface: string;
    surface: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    navBg: string;
    sectionBorder: string;
    sectionPrimary: string;
    sectionSecondary: string;
  };
  copy: ThemeCopy;
}
