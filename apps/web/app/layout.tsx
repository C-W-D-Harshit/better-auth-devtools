import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const siteTitle = "Better Auth DevTools";
const siteUrl = "https://www.better-auth-devtools.com";

export const metadata: Metadata = {
  title: {
    default:
      "Better Auth DevTools — Dev Tools for Debugging & Testing Better Auth",
    template: `%s | ${siteTitle}`,
  },
  description:
    "Better Auth DevTools (better auth dev tools) — the official dev tools for Better Auth. Create test users, switch sessions, inspect auth state, and patch session fields from a React panel.",
  applicationName: siteTitle,
  keywords: [
    "better auth devtools",
    "better auth dev tools",
    "Better Auth",
    "better auth debugging",
    "better auth testing",
    "better auth session",
    "better auth react",
    "auth devtools",
    "auth dev tools",
    "auth testing tools",
    "managed test users",
    "session switching",
    "session inspection",
    "React devtools panel",
    "Next.js auth devtools",
  ],
  authors: [{ name: "Harshit", url: "https://github.com/C-W-D-Harshit" }],
  creator: "Harshit",
  publisher: "Harshit",
  category: "developer tools",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Better Auth DevTools — Dev Tools for Better Auth",
    description:
      "Better Auth DevTools — create test users, switch sessions, inspect auth state, and patch session fields from a React panel. The dev tools built for Better Auth.",
    siteName: siteTitle,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Better Auth DevTools — dev tools for debugging and testing Better Auth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Better Auth DevTools — Dev Tools for Better Auth",
    description:
      "Better Auth DevTools — create test users, switch sessions, inspect auth state, and patch session fields. The dev tools built for Better Auth.",
    images: [
      {
        url: "/og.png",
        alt: "Better Auth DevTools — dev tools for debugging and testing Better Auth",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1117",
  colorScheme: "dark",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "bg-[#0D1117] antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="bg-[#0D1117]">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
