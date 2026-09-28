import Image from "next/image"
import Link from "next/link"

import { SITE } from "@/lib/site-content"
import { GithubIcon } from "./icons"

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
  { href: SITE.docsUrl, label: "Docs", external: true },
]

export function Header() {
  return (
    <header
      data-material
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-sm font-semibold tracking-tight whitespace-nowrap text-neutral-100"
        >
          <Image
            src="/icon.svg"
            alt=""
            width={22}
            height={22}
            className="size-[22px]"
            priority
          />
          {SITE.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="hidden rounded-md px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-100 md:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Better Auth DevTools on GitHub"
            className="ml-2 grid size-8 place-items-center rounded-md text-neutral-400 transition-[background-color,color,scale] duration-(--duration-quick) ease-out hover:bg-white/[0.06] hover:text-neutral-100 active:scale-(--scale-medium)"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href="#install"
            className="ml-1 inline-flex h-8 items-center rounded-md bg-amber-300 px-3 text-sm font-medium text-neutral-950 transition-[background-color,scale] duration-(--duration-quick) ease-out hover:bg-amber-200 active:scale-(--scale-medium)"
          >
            Install
          </a>
        </nav>
      </div>
    </header>
  )
}
