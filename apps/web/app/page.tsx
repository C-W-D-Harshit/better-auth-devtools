"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "motion/react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  ArrowRightLeft,
  Eye,
  Pencil,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ArrowUpRight,
  Github,
  Terminal,
} from "lucide-react"

import { HOME_PAGE, SITE } from "@/lib/site-content"

// ─── Motion + design tokens ──────────────────────────────────────────

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const GITHUB_URL = SITE.githubUrl
const INSTALL = HOME_PAGE.installCommand

// ─── Primitives ──────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  y = 14,
  scale = 1,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  scale?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <m.div
      initial={{
        opacity: 0,
        y: reduce ? 0 : y,
        scale: reduce ? 1 : scale,
        filter: reduce ? "blur(0px)" : "blur(6px)",
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </m.div>
  )
}

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-amber-400/90 uppercase">
      {children}
    </span>
  )
}

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return { copied, copy }
}

function CopyPill({ command }: { command: string }) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      onClick={() => copy(command)}
      className="group flex w-full min-w-0 items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-3 transition-[transform,border-color,background-color] duration-150 ease-out hover:border-white/20 hover:bg-white/[0.04] active:scale-[0.98] sm:w-auto sm:gap-3 sm:px-4"
    >
      <span className="shrink-0 font-mono text-sm text-amber-400/70 select-none">
        $
      </span>
      <code className="min-w-0 flex-1 truncate text-left font-mono text-[13px] text-neutral-200 sm:flex-none sm:text-sm">
        {command}
      </code>
      <span className="relative ml-auto grid h-4 w-4 shrink-0 place-items-center sm:ml-1">
        <Copy
          className={`absolute h-4 w-4 text-neutral-500 transition-[transform,opacity,filter,color] duration-200 ease-out group-hover:text-neutral-300 ${
            copied
              ? "scale-90 opacity-0 blur-[2px]"
              : "blur-0 scale-100 opacity-100"
          }`}
        />
        <Check
          className={`absolute h-4 w-4 text-amber-400 transition-[transform,opacity,filter,color] duration-200 ease-out ${
            copied
              ? "blur-0 scale-100 opacity-100"
              : "scale-90 opacity-0 blur-[2px]"
          }`}
        />
      </span>
    </button>
  )
}

function PrimaryButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-white px-5 text-sm font-medium text-neutral-950 transition-transform duration-150 ease-out active:scale-[0.98] sm:w-auto"
    >
      {/* sheen */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  )
}

// ─── Magnetic wrapper (pointer-follow, independent X/Y springs) ──────

function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <m.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={className}
    >
      {children}
    </m.div>
  )
}

// ─── Cursor-spotlight card ───────────────────────────────────────────

function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const [hovering, setHovering] = useState(false)
  const bg = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(245,158,11,0.10), transparent 70%)`

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        mx.set(e.clientX - rect.left)
        my.set(e.clientY - rect.top)
      }}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] transition-colors duration-300 hover:border-white/15 ${className}`}
    >
      <m.div
        aria-hidden
        style={{ background: bg }}
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-0"
      />
      {/* top hairline highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  )
}

// ─── The product mockup (live session switcher) ──────────────────────

const MOCK_USERS = [
  { initials: "AD", email: "admin@acme.test", role: "admin" },
  { initials: "ED", email: "editor@acme.test", role: "editor" },
  { initials: "VW", email: "viewer@acme.test", role: "viewer" },
]

function DevtoolsPanelMock() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const id = setInterval(
      () => setActive((a) => (a + 1) % MOCK_USERS.length),
      2600
    )
    return () => clearInterval(id)
  }, [reduce, paused])

  const cur = MOCK_USERS[active]

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0e13] shadow-2xl shadow-black/60"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/60" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          <span className="font-mono text-[13px] font-medium tracking-tight text-neutral-200">
            Auth DevTools
          </span>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-500">
          dev
        </span>
      </div>

      {/* Current session — crossfades as the active user changes */}
      <div className="border-b border-white/[0.07] p-4">
        <p className="mb-2.5 font-mono text-[10px] tracking-[0.14em] text-neutral-500 uppercase">
          Current session
        </p>
        <div className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-amber-400/20 bg-amber-400/[0.05] p-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={cur.email}
              initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", y: -4 }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400/15 font-mono text-xs font-semibold text-amber-300">
                {cur.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-neutral-100">
                  {cur.email}
                </p>
                <p className="font-mono text-[11px] text-neutral-500">
                  role: {cur.role}
                </p>
              </div>
            </m.div>
          </AnimatePresence>
          <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-1 font-mono text-[10px] font-medium text-amber-300">
            active
          </span>
        </div>
      </div>

      {/* Test users — click to switch, active highlight slides between rows */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.14em] text-neutral-500 uppercase">
            Test users
          </p>
          <span className="font-mono text-[10px] text-neutral-600">
            {MOCK_USERS.length}
          </span>
        </div>
        <div className="space-y-1">
          {MOCK_USERS.map((u, i) => {
            const isActive = i === active
            return (
              <button
                key={u.email}
                type="button"
                onClick={() => setActive(i)}
                className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.03]"
              >
                {isActive && (
                  <m.span
                    layoutId="active-row"
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.04]"
                  />
                )}
                <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06] font-mono text-[11px] font-medium text-neutral-300">
                  {u.initials}
                </div>
                <div className="relative min-w-0 flex-1">
                  <p className="truncate text-[13px] text-neutral-200">
                    {u.email}
                  </p>
                  <p className="font-mono text-[10px] text-neutral-600">
                    {u.role}
                  </p>
                </div>
                <span className="relative shrink-0">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-400">
                      <Check className="h-3 w-3" />
                      current
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-neutral-400 transition-colors group-hover:border-white/20">
                      switch
                      <ArrowRightLeft className="h-2.5 w-2.5" />
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Feature visuals ─────────────────────────────────────────────────

function ManagedUsersVisual() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[
        "admin@acme.test",
        "editor@acme.test",
        "viewer@acme.test",
        "qa@acme.test",
      ].map((e, i) => (
        <div
          key={e}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-3 pl-1"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] font-mono text-[9px] text-neutral-300">
            {e.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-mono text-[11px] text-neutral-400">{e}</span>
          {i === 0 && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          )}
        </div>
      ))}
    </div>
  )
}

function SwitchVisual() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] font-mono text-[11px] text-neutral-400">
        ED
      </div>
      <m.div
        animate={reduce ? undefined : { x: [0, 3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRightLeft className="h-4 w-4 text-amber-400" />
      </m.div>
      <div className="grid h-10 w-10 place-items-center rounded-lg border border-amber-400/30 bg-amber-400/10 font-mono text-[11px] text-amber-300">
        AD
      </div>
    </div>
  )
}

function InspectVisual() {
  return (
    <pre className="overflow-hidden rounded-lg border border-white/[0.07] bg-black/30 p-3 font-mono text-[10px] leading-relaxed">
      <span className="text-neutral-600">{"{"}</span>
      {"\n  "}
      <span className="text-sky-300/80">&quot;user&quot;</span>
      <span className="text-neutral-600">: {"{"}</span>
      {"\n    "}
      <span className="text-sky-300/80">&quot;role&quot;</span>
      <span className="text-neutral-600">: </span>
      <span className="text-amber-300">&quot;admin&quot;</span>
      {"\n  "}
      <span className="text-neutral-600">{"}"}</span>
      {"\n"}
      <span className="text-neutral-600">{"}"}</span>
    </pre>
  )
}

function PatchVisual() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="font-mono text-[11px] text-neutral-500">role</span>
        <span className="rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] text-amber-300">
          editor ▾
        </span>
      </div>
      <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
        <Pencil className="h-3.5 w-3.5 text-neutral-400" />
      </div>
    </div>
  )
}

function PersonaVisual() {
  return (
    <div className="flex flex-col gap-1.5">
      {["Admin", "Editor", "Viewer"].map((p, i) => (
        <div
          key={p}
          className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              i === 0 ? "bg-amber-400" : "bg-neutral-600"
            }`}
          />
          <span className="font-mono text-[11px] text-neutral-400">{p}</span>
        </div>
      ))}
    </div>
  )
}

function SafetyVisual() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span className="font-mono text-[11px] text-amber-300">
          development · on
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 opacity-60">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
        <span className="font-mono text-[11px] text-neutral-500">
          production · off
        </span>
      </div>
    </div>
  )
}

const featurePresentation = [
  {
    icon: Users,
    span: "md:col-span-2",
    visual: <ManagedUsersVisual />,
  },
  {
    icon: ArrowRightLeft,
    span: "",
    visual: <SwitchVisual />,
  },
  {
    icon: Eye,
    span: "",
    visual: <InspectVisual />,
  },
  {
    icon: Pencil,
    span: "md:col-span-2",
    visual: <PatchVisual />,
  },
  {
    icon: ShieldCheck,
    span: "",
    visual: <PersonaVisual />,
  },
  {
    icon: Lock,
    span: "md:col-span-2",
    visual: <SafetyVisual />,
  },
]

const features = HOME_PAGE.features.items.map((feature, index) => ({
  ...feature,
  ...featurePresentation[index],
}))

// ─── Syntax-highlighted code block ───────────────────────────────────

type Tok = { t: string; c: string }

function tokenize(code: string): Tok[] {
  const re =
    /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|const|return|function|default|new|await|async)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([{}()[\];,.<>/=]+)/g
  const out: Tok[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) out.push({ t: code.slice(last, m.index), c: "plain" })
    const c = m[1]
      ? "comment"
      : m[2]
        ? "string"
        : m[3]
          ? "keyword"
          : m[4]
            ? "fn"
            : "punct"
    out.push({ t: m[0], c })
    last = re.lastIndex
  }
  if (last < code.length) out.push({ t: code.slice(last), c: "plain" })
  return out
}

const TOKEN_CLASS: Record<string, string> = {
  plain: "text-neutral-200",
  comment: "text-neutral-600",
  string: "text-amber-300",
  keyword: "text-violet-300",
  fn: "text-sky-300",
  punct: "text-neutral-500",
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  const { copied, copy } = useCopy()
  const tokens = tokenize(code)
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0b0e13]">
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-2 font-mono text-[11px] text-neutral-500">
            {filename}
          </span>
        </div>
        <button
          type="button"
          onClick={() => copy(code)}
          className="grid h-6 w-6 place-items-center rounded-md text-neutral-500 transition-colors duration-150 hover:text-neutral-300 active:scale-90"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {tokens.map((tok, i) => (
            <span key={i} className={TOKEN_CLASS[tok.c]}>
              {tok.t}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

// ─── Scroll-aware nav ────────────────────────────────────────────────

const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "install", label: "Install" },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-5">
        <nav
          className={`mt-3 flex h-14 items-center justify-between rounded-xl border px-4 transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? "border-white/10 bg-[#0D1117]/80 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "border-white/[0.06] bg-[#0D1117]/50 backdrop-blur-md"
          }`}
        >
          <Link href="#top" className="flex items-center gap-2">
            <Image
              src="/icon.svg"
              alt="Better Auth DevTools"
              width={24}
              height={24}
              className="h-6 w-6 rounded-md"
            />
            <span className="text-sm font-semibold tracking-tight text-neutral-100">
              Better Auth DevTools
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.id}
                href={`#${l.id}`}
                className="relative hidden rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-100 sm:block"
              >
                {activeSection === l.id && (
                  <m.span
                    layoutId="nav-active"
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    className="absolute inset-0 rounded-lg bg-white/[0.06]"
                  />
                )}
                <span
                  className={`relative ${
                    activeSection === l.id ? "text-neutral-100" : ""
                  }`}
                >
                  {l.label}
                </span>
              </Link>
            ))}
            <Link
              href={GITHUB_URL}
              target="_blank"
              className="ml-1 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm font-medium text-neutral-200 transition-[transform,border-color,background-color] duration-150 ease-out hover:border-white/20 hover:bg-white/[0.05] active:scale-[0.98]"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

// ─── Page ────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <LazyMotion features={domAnimation}>
      <div
        id="top"
        className="min-h-screen overflow-x-hidden bg-[#0D1117] text-neutral-200 antialiased"
      >
        <Nav />

        {/* Hero */}
        <section className="relative overflow-hidden px-5 pt-36 pb-20 md:pt-44 md:pb-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
              }}
            />
            <div className="absolute top-[-15%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[130px]" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <Link
                href={GITHUB_URL}
                target="_blank"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-2 pl-3 text-xs text-neutral-300 transition-colors hover:border-white/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px] shadow-amber-400" />
                <span>{HOME_PAGE.releaseLabel}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
                {HOME_PAGE.headlineLines.map((line, index) => (
                  <React.Fragment key={line}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
                {HOME_PAGE.description}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Magnetic className="w-full sm:w-auto">
                  <PrimaryButton href={GITHUB_URL}>
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </PrimaryButton>
                </Magnetic>
                <CopyPill command={INSTALL} />
              </div>
            </Reveal>
          </div>

          <Reveal
            delay={0.26}
            y={28}
            scale={0.97}
            className="mx-auto mt-16 max-w-md md:mt-20"
          >
            <div className="relative">
              <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-full bg-amber-500/10 blur-3xl" />
              <DevtoolsPanelMock />
              <p className="mt-4 text-center font-mono text-[11px] text-neutral-600">
                live preview · click a user to switch
              </p>
            </div>
          </Reveal>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <EyebrowLabel>Features</EyebrowLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {HOME_PAGE.features.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-400">
                {HOME_PAGE.features.description}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 0.05} className={f.span}>
                  <SpotlightCard className="flex h-full flex-col p-6">
                    <div className="mb-6 flex min-h-[68px] items-center">
                      {f.visual}
                    </div>
                    <div className="mt-auto">
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] transition-[transform,background-color,border-color] duration-200 group-hover:scale-105 group-hover:border-amber-400/30 group-hover:bg-amber-400/[0.08]">
                          <f.icon className="h-4 w-4 text-amber-400" />
                        </div>
                        <h3 className="text-[15px] font-medium text-neutral-100">
                          {f.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-400">
                        {f.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Install / integration */}
        <section id="install" className="scroll-mt-24 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <EyebrowLabel>Install</EyebrowLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {HOME_PAGE.integration.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-400">
                {HOME_PAGE.integration.description}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Reveal className="min-w-0">
                <div className="flex items-center gap-2 pb-3">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-white/[0.06] font-mono text-[10px] text-neutral-400">
                    1
                  </span>
                  <span className="text-sm font-medium text-neutral-200">
                    {HOME_PAGE.integration.server.label}
                  </span>
                </div>
                <CodeBlock
                  filename={HOME_PAGE.integration.server.filename}
                  code={HOME_PAGE.integration.server.code}
                />
              </Reveal>
              <Reveal delay={0.06} className="min-w-0">
                <div className="flex items-center gap-2 pb-3">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-white/[0.06] font-mono text-[10px] text-neutral-400">
                    2
                  </span>
                  <span className="text-sm font-medium text-neutral-200">
                    {HOME_PAGE.integration.client.label}
                  </span>
                </div>
                <CodeBlock
                  filename={HOME_PAGE.integration.client.filename}
                  code={HOME_PAGE.integration.client.code}
                />
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="mt-4 flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                    <Terminal className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    <span className="font-medium text-neutral-200">
                      {HOME_PAGE.integration.note.lead}
                    </span>{" "}
                    {HOME_PAGE.integration.note.safety}{" "}
                    {HOME_PAGE.integration.note.migrationPrefix}{" "}
                    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-neutral-300">
                      {HOME_PAGE.integration.note.migrationCommand}
                    </code>{" "}
                    {HOME_PAGE.integration.note.migrationSuffix}
                  </p>
                </div>
                <div className="shrink-0">
                  <CopyPill command={INSTALL} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center md:px-12 md:py-20">
                <div className="pointer-events-none absolute inset-x-0 -top-1/2 h-full bg-amber-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                <div className="relative">
                  <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-white md:text-5xl">
                    {HOME_PAGE.callToAction.title}
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400">
                    {HOME_PAGE.callToAction.description}
                  </p>
                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Magnetic className="w-full sm:w-auto">
                      <PrimaryButton href={GITHUB_URL}>
                        <Github className="h-4 w-4" />
                        View on GitHub
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </PrimaryButton>
                    </Magnetic>
                    <CopyPill command={INSTALL} />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.07] px-5 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/icon.svg"
                alt="Better Auth DevTools"
                width={20}
                height={20}
                className="h-5 w-5 rounded-md"
              />
              <span className="text-sm font-medium text-neutral-300">
                Better Auth DevTools
              </span>
            </div>
            <p className="text-sm text-neutral-500">
              Built by{" "}
              <Link
                href="https://x.com/cwd_harshit"
                target="_blank"
                className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-amber-400 hover:decoration-amber-400/50"
              >
                Harshit
              </Link>
              . Unofficial, dev-only tooling.
            </p>
          </div>
        </footer>
      </div>
    </LazyMotion>
  )
}
