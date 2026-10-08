"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Home,
  Shield,
} from "lucide-react";
import { getFormResources, getResource } from "@/lib/public-resources";
import { RuleSearch } from "@/components/rule-search";
import { THEME } from "@/content/theme";
import { PIXEL_NAV_BG, PIXEL_SECTION_BORDER, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPaths?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home, matchPaths: ["/"] },
  {
    label: "Resources",
    href: "/resources",
    icon: FolderOpen,
    matchPaths: ["/resources"],
  },
  { label: "Rules", href: "/rules", icon: BookOpen, matchPaths: ["/rules"] },
  {
    label: "Safe Zones",
    href: "/safe-zones",
    icon: Shield,
    matchPaths: ["/safe-zones"],
  },
];

function isActive(pathname: string, item: NavItem) {
  return (
    item.matchPaths?.some((p) =>
      p === "/" ? pathname === "/" : pathname.startsWith(p),
    ) ?? false
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "flex min-h-11 items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors",
        active
          ? `${THEME.accent.link} border-b-2 border-current`
          : `${PIXEL_TEXT_MUTED} ${THEME.accent.textHover} dark:text-[#a89580]`,
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

export function DesktopSiteNav() {
  const pathname = usePathname();
  const forms = getFormResources();

  return (
    <nav
      aria-label="Site navigation"
      className={["hidden border-b-4", PIXEL_SECTION_BORDER, PIXEL_NAV_BG, "md:block"].join(" ")}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RuleSearch variant="desktop" />
          {forms.filter((form) => form.href).map((form) => (
            <a
              key={form.href}
              href={form.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide ${THEME.alarm.nav}`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {form.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function MobileSiteNav() {
  const pathname = usePathname();
  const killReport = getResource("killReport");

  return (
    <nav
      aria-label="Mobile navigation"
      className={["fixed inset-x-0 bottom-0 z-40 border-t-4", PIXEL_SECTION_BORDER, PIXEL_NAV_BG, "pb-[env(safe-area-inset-bottom)] md:hidden"].join(" ")}
    >
      <div className={killReport.href ? "grid grid-cols-4" : "grid grid-cols-3"}>
        {NAV_ITEMS.filter((item) => item.href !== "/resources").map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 font-mono text-xs font-bold uppercase leading-tight",
                active
                  ? `${THEME.accent.bgSubtle} ${THEME.accent.navActive}`
                  : `${PIXEL_TEXT_MUTED} dark:text-[#a89580]`,
              ].join(" ")}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="text-center">{item.label}</span>
            </Link>
          );
        })}
        {killReport.href ? (
        <a
          href={killReport.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={killReport.label}
          className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-center font-mono text-xs font-bold uppercase leading-tight ${THEME.alarm.nav}`}
        >
          <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{killReport.label}</span>
        </a>
        ) : null}
      </div>
    </nav>
  );
}
