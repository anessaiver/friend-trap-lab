import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { siteUrl } from "@/lib/env";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Friend Trap Lab — send your friend a tiny brain trap",
    template: "%s — Friend Trap Lab",
  },
  description:
    "Arm a science-backed brain trap, send it to a friend, and find out whose neurons flinch first. A Distilled Science experiment.",
  openGraph: {
    title: "Friend Trap Lab",
    description:
      "Send your friend a tiny brain trap. If they fall for it, science gets a point. If they escape, they get revenge.",
    url: "/",
    siteName: "Friend Trap Lab",
    images: [{ url: "/api/og/home", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Friend Trap Lab",
    description: "Send your friend a tiny brain trap.",
    images: ["/api/og/home"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${grotesk.variable} ${jbmono.variable} flex min-h-dvh flex-col font-sans`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
