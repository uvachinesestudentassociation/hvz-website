"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ClipboardList,
  FileText,
  FolderOpen,
  Home,
  Shield,
} from "lucide-react";
import { getFormResources } from "@/lib/public-resources";
import { RuleSearch } from "@/components/rule-search";
import { MobileThemeToggle } from "@/components/theme-toggle";
import { PIXEL_NAV_BG, PIXEL_SECTION_BORDER } from "@/components/hvz/pixel-styles";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
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

function NavLink({
  item,
  pathname,
  className,
}: {
  item: NavItem;
  pathname: string;
  className?: string;
}) {
  const active = isActive(pathname, item);
  const Icon = item.icon;
  const baseClass = [
    "flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors",
    active ? "text-emerald-700 dark:text-emerald-400" : "text-neutral-700 hover:text-emerald-600 dark:text-neutral-300 dark:hover:text-emerald-400",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <Link href={item.href} className={baseClass}>
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
          {forms.map((form) => (
            <a
              key={form.href}
              href={form.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-rose-700 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
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
  const forms = getFormResources();

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className={["fixed inset-x-0 bottom-0 z-40 border-t-4", PIXEL_SECTION_BORDER, PIXEL_NAV_BG, "pb-[env(safe-area-inset-bottom)] md:hidden"].join(" ")}
      >
        <div className="grid grid-cols-6 gap-0">
          {NAV_ITEMS.slice(0, 4).map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 font-mono text-[9px] font-bold uppercase tracking-tight",
                  active
                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                    : "text-neutral-700 dark:text-neutral-300",
                ].join(" ")}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
          {forms.map((form) => (
            <a
              key={form.href}
              href={form.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 font-mono text-[9px] font-bold uppercase tracking-tight text-rose-700 dark:text-rose-400"
            >
              <ClipboardList className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="leading-none">
                {form.label.replace(" Report", "")}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-center gap-2 md:hidden">
        <MobileThemeToggle />
        <RuleSearch variant="mobile" />
      </div>
    </>
  );
}

/** @deprecated Use DesktopSiteNav + MobileSiteNav via SiteShell */
export function SiteNav() {
  return (
    <>
      <DesktopSiteNav />
      <MobileSiteNav />
    </>
  );
}
