"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  Home,
  Shield,
} from "lucide-react";
import { getResource } from "@/lib/public-resources";
import { THEME } from "@/content/theme";
import { PIXEL_NAV_BG, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPaths?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home, matchPaths: ["/"] },
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

export function MobileSiteNav() {
  const pathname = usePathname();
  const killReport = getResource("killReport");

  return (
    <nav
      aria-label="Mobile navigation"
      className={["fixed inset-x-0 bottom-0 z-40 border-t-4 border-[var(--px-nav-edge)]", PIXEL_NAV_BG, "pb-[env(safe-area-inset-bottom)] md:hidden"].join(" ")}
    >
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
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
                  : PIXEL_TEXT_MUTED,
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
        ) : (
        <span
          aria-disabled="true"
          className={`flex min-h-16 cursor-not-allowed flex-col items-center justify-center gap-1 px-1 py-2 text-center font-mono text-xs font-bold uppercase leading-tight grayscale opacity-50 ${THEME.alarm.nav}`}
        >
          <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{killReport.label}</span>
        </span>
        )}
      </div>
    </nav>
  );
}
