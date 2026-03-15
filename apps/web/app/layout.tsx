import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const siteTitle = "Better Auth DevTools";
const siteDescription =
  "Unofficial, development-only tooling for Better Auth. Create managed test users, switch sessions, inspect auth state, and patch approved session fields from a React panel.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    "Better Auth",
    "Better Auth DevTools",
    "auth testing",
    "managed test users",
    "session switching",
    "session inspection",
    "React devtools",
    "development tooling",
  ],
  authors: [{ name: "Harshit" }],
  creator: "Harshit",
  publisher: "Harshit",
  category: "developer tools",
  metadataBase: new URL("https://better-auth-devtools.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Better Auth DevTools preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
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
      </body>
    </html>
  )
}
