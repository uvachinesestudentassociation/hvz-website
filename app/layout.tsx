import type { Metadata, Viewport } from "next";
import { ThemeGate } from "@/components/theme-gate";
import { ACTIVE_THEME_ID } from "@/content/theme";
import { SITE_CONFIG } from "@/lib/site-config";
import { isRequestUnlocked } from "@/lib/theme-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.title}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/og-image.svg"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: SITE_CONFIG.title,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const unlocked = await isRequestUnlocked();

  if (!unlocked) {
    return (
      <html lang="en" data-site-theme="locked" suppressHydrationWarning>
        <body className="font-sans">
          <ThemeGate gameYear={SITE_CONFIG.gameYear} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-site-theme={ACTIVE_THEME_ID} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
