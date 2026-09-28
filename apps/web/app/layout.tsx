import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { cn } from "@/lib/utils"
import { HOME_PAGE, SITE } from "@/lib/site-content"

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "better auth devtools",
    "better-auth-devtools",
    "better auth",
    "better auth plugin",
    "better auth test users",
    "better auth impersonate user",
    "better auth switch user",
    "better auth roles testing",
    "better auth session",
    "auth devtools",
    "react auth devtools",
    "next.js auth testing",
  ],
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  category: "developer tools",
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": HOME_PAGE.markdownPath,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: "@cwd_harshit",
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
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
}

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark scroll-smooth bg-[#09090b] font-sans antialiased",
        fontSans.variable,
        fontMono.variable
      )}
    >
      <body className="min-h-screen overflow-x-hidden bg-[#09090b] text-neutral-200 selection:bg-amber-300/30 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
