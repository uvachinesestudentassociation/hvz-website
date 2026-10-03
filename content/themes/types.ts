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
  bounty: {
    headline: string;
    subline: string;
    cta: string;
    vacant: string;
    /** Overlay label while the poster is blurred / unrevealed */
    sealed: string;
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

export interface ThemeActionStyle {
  card: string;
  icon: string;
  label: string;
  badge: string;
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
    /** Home quick-action cards. One alarm, one warning, one monitor — not a second brand color. */
    actions: {
      kill: ThemeActionStyle;
      questBoard: ThemeActionStyle;
      questReport: ThemeActionStyle;
    };
  };
  pixel: {
    border: string;
    frame: string;
    gridBg: string;
    heroSurface: string;
    stamp: string;
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
