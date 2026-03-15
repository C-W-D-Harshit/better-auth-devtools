"use client";

import { motion } from "motion/react";
import { Bebas_Neue, Work_Sans } from "next/font/google";
import Link from "next/link";
import {
  Triangle,
  Hexagon,
  Shield,
  Users,
  Zap,
  Eye,
  Settings,
  Terminal,
  Github,
  ArrowRight,
  Code,
  Layers,
  ChevronRight,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
});

/* ─────────────────── GEOMETRIC DECORATORS ─────────────────── */

function DiamondBullet({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block size-2.5 rotate-45 border-2 border-amber-400 ${className}`}
    />
  );
}

function GeometricSeparator() {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <div className="h-[2px] w-16 bg-amber-400/60" />
      <div className="size-3 rotate-45 border-2 border-amber-400" />
      <div className="h-[2px] w-16 bg-amber-400/60" />
      <div className="size-2 rotate-45 bg-amber-400" />
      <div className="h-[2px] w-16 bg-amber-400/60" />
      <div className="size-3 rotate-45 border-2 border-amber-400" />
      <div className="h-[2px] w-16 bg-amber-400/60" />
    </div>
  );
}

/* ─────────────────── FEATURES DATA ─────────────────── */

const features = [
  {
    num: "01",
    title: "Managed Test Users",
    desc: "Create disposable test users from pre-defined templates — Admin, Editor, Viewer — ready in milliseconds.",
    icon: Users,
    accent: "border-amber-400 text-amber-400",
    bg: "bg-amber-400/5",
  },
  {
    num: "02",
    title: "Instant Session Switching",
    desc: "Switch between test users with one click. No credentials needed. No login forms. Pure speed.",
    icon: Zap,
    accent: "border-blue-500 text-blue-500",
    bg: "bg-blue-500/5",
  },
  {
    num: "03",
    title: "Session Inspection",
    desc: "View all current session data in real-time. Every token, every claim, every field — laid bare.",
    icon: Eye,
    accent: "border-emerald-500 text-emerald-500",
    bg: "bg-emerald-500/5",
  },
  {
    num: "04",
    title: "Session Patching",
    desc: "Edit approved session fields on-the-fly. Change roles, permissions, metadata — no re-authentication.",
    icon: Settings,
    accent: "border-amber-400 text-amber-400",
    bg: "bg-amber-400/5",
  },
  {
    num: "05",
    title: "Role-Based Testing",
    desc: "Multiple user templates with different roles. Test every permission boundary in your app.",
    icon: Shield,
    accent: "border-blue-500 text-blue-500",
    bg: "bg-blue-500/5",
  },
  {
    num: "06",
    title: "Development-Only Safety",
    desc: "Only works when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk in production.",
    icon: Lock,
    accent: "border-emerald-500 text-emerald-500",
    bg: "bg-emerald-500/5",
  },
];

const steps = [
  {
    num: "1",
    title: "Install the package",
    code: "npm install better-auth-devtools",
  },
  {
    num: "2",
    title: "Add the plugin",
    code: `import { devTools } from "better-auth-devtools";

export const auth = betterAuth({
  plugins: [
    devTools({
      enabled: process.env.NODE_ENV === "development",
    }),
  ],
});`,
  },
  {
    num: "3",
    title: "Start developing",
    code: `DEV_AUTH_ENABLED=true npm run dev`,
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <div
      className={`${bebasNeue.variable} ${workSans.variable} min-h-screen bg-[#0D1117] text-white`}
      style={{ fontFamily: "var(--font-work), sans-serif" }}
    >
      {/* ── NAV BAR ── */}
      <nav className="relative z-50 border-b-2 border-white/10 bg-[#0D1117]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-amber-400"
          >
            <ArrowRight className="size-4 rotate-180" />
            View All Variations
          </Link>
          <div className="flex items-center gap-3">
            <DiamondBullet />
            <span
              className="text-lg tracking-[0.3em] text-white/80"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              BETTER AUTH DEVTOOLS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/C-W-D-Harshit/better-auth-devtools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-colors hover:text-white"
            >
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: HERO
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Chevron/zigzag background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                120deg,
                transparent,
                transparent 40px,
                rgba(245,158,11,0.3) 40px,
                rgba(245,158,11,0.3) 41px
              ),
              repeating-linear-gradient(
                60deg,
                transparent,
                transparent 40px,
                rgba(245,158,11,0.3) 40px,
                rgba(245,158,11,0.3) 41px
              )
            `,
          }}
        />

        {/* Sunburst / conic deco in top-right */}
        <div
          className="absolute -top-40 -right-40 size-[600px] opacity-[0.03]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #F59E0B 10deg, transparent 20deg, transparent 30deg, #F59E0B 40deg, transparent 50deg, transparent 60deg, #F59E0B 70deg, transparent 80deg, transparent 90deg, #F59E0B 100deg, transparent 110deg, transparent 120deg, #F59E0B 130deg, transparent 140deg, transparent 150deg, #F59E0B 160deg, transparent 170deg, transparent 180deg, #F59E0B 190deg, transparent 200deg, transparent 210deg, #F59E0B 220deg, transparent 230deg, transparent 240deg, #F59E0B 250deg, transparent 260deg, transparent 270deg, #F59E0B 280deg, transparent 290deg, transparent 300deg, #F59E0B 310deg, transparent 320deg, transparent 330deg, #F59E0B 340deg, transparent 350deg, transparent 360deg)",
          }}
        />

        {/* Diagonal stripe accent */}
        <div
          className="absolute top-0 left-0 h-full w-1 bg-amber-400"
          style={{ marginLeft: "calc(50% - 560px)" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="mb-8 flex items-center gap-3">
              <Badge className="border-2 border-amber-400/30 bg-amber-400/10 text-amber-400 rounded-none px-3 py-1 text-xs tracking-widest uppercase">
                Open Source
              </Badge>
              <div className="h-[2px] w-12 bg-amber-400/40" />
              <span className="text-sm tracking-wider text-white/40">
                Dev-Only Authentication Tooling
              </span>
            </div>

            {/* Main heading */}
            <h1
              className="mb-6 leading-[0.85]"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              <motion.span
                className="block text-[clamp(3.5rem,10vw,8rem)] tracking-[0.02em] text-white"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                BETTER AUTH
              </motion.span>
              <motion.span
                className="block text-[clamp(4rem,12vw,10rem)] tracking-[0.04em] text-amber-400"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                DEVTOOLS
              </motion.span>
            </h1>

            {/* Subheading */}
            <motion.p
              className="mb-10 max-w-xl text-lg leading-relaxed text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              A dev-only DevTools panel for Better Auth. Managed test users,
              instant session switching, real-time inspection, and on-the-fly
              patching. Install as a plugin — ship faster.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-12 rounded-none border-2 border-amber-400 bg-amber-400 px-8 text-sm font-semibold tracking-wider text-[#0D1117] uppercase hover:bg-amber-300 transition-colors">
                  <Github className="mr-2 size-4" />
                  View on GitHub
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </a>
              <div className="flex items-center gap-3 rounded-none border-2 border-white/20 bg-white/5 px-5 py-2.5">
                <Terminal className="size-4 text-amber-400" />
                <code className="text-sm text-white/70">
                  npm i better-auth-devtools
                </code>
              </div>
            </motion.div>
          </motion.div>

          {/* Geometric shapes floating */}
          <motion.div
            className="absolute top-32 right-20 hidden lg:block"
            initial={{ opacity: 0, rotate: -15 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Hexagon className="size-48 text-amber-400" strokeWidth={0.5} />
          </motion.div>
          <motion.div
            className="absolute right-60 bottom-20 hidden lg:block"
            initial={{ opacity: 0, rotate: 15 }}
            animate={{ opacity: 0.08, rotate: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Triangle className="size-32 text-blue-500" strokeWidth={0.5} />
          </motion.div>
        </div>

        {/* Bottom angled divider */}
        <div
          className="h-20 bg-[#161B22]"
          style={{ transform: "skewY(-2deg)", marginTop: "-2.5rem" }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: FEATURES
          ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#161B22]">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-24">
          {/* Section header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="mb-2 block text-sm tracking-[0.4em] text-amber-400/60 uppercase"
              style={{ fontFamily: "var(--font-work)" }}
            >
              Capabilities
            </span>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[0.03em] text-white"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              EVERYTHING YOU NEED
            </h2>
          </motion.div>

          {/* Features Grid */}
          <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                className={`group relative border-2 border-white/[0.06] p-8 transition-colors hover:border-white/[0.12] ${f.bg} ${
                  i === 0
                    ? "lg:translate-y-4"
                    : i === 1
                      ? "lg:-translate-y-2"
                      : i === 2
                        ? "lg:translate-y-6"
                        : i === 3
                          ? "lg:translate-y-2"
                          : i === 4
                            ? "lg:-translate-y-4"
                            : "lg:translate-y-0"
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Large background number */}
                <span
                  className="absolute top-4 right-6 text-[5rem] leading-none text-white/[0.03] select-none"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {f.num}
                </span>

                {/* Icon + Number row */}
                <div className="relative mb-6 flex items-start justify-between">
                  <div className={`border-2 p-3 ${f.accent}`}>
                    <f.icon className="size-6" />
                  </div>
                  <span
                    className={`text-3xl tracking-wider ${f.accent}`}
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {f.num}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="mb-3 text-2xl tracking-wider text-white"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {f.title.toUpperCase()}
                </h3>

                {/* Divider */}
                <div className="mb-4 flex items-center gap-2">
                  <div className={`h-[2px] w-8 ${f.accent.includes("amber") ? "bg-amber-400" : f.accent.includes("blue") ? "bg-blue-500" : "bg-emerald-500"}`} />
                  <DiamondBullet className={f.accent.includes("amber") ? "border-amber-400" : f.accent.includes("blue") ? "border-blue-500" : "border-emerald-500"} />
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-white/40">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <GeometricSeparator />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: BUILT FOR DEVELOPERS — CODE EXAMPLE
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0D1117]">
        {/* Striped background */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              #F59E0B 0px,
              #F59E0B 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <span
                className="mb-2 text-sm tracking-[0.4em] text-amber-400/60 uppercase"
                style={{ fontFamily: "var(--font-work)" }}
              >
                Developer Experience
              </span>
              <h2
                className="mb-6 text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[0.03em] text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                BUILT FOR
                <br />
                <span className="text-amber-400">DEVELOPERS</span>
              </h2>

              <div className="space-y-5">
                {[
                  "Works as a Better Auth plugin — just install and configure",
                  "Zero configuration for standard setups",
                  "Automatic safety: disabled in production",
                  "Full TypeScript support with autocomplete",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <DiamondBullet className="mt-1.5 shrink-0" />
                    <span className="text-sm leading-relaxed text-white/50">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right code block */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="border-2 border-white/10 bg-[#161B22]">
                {/* Code header */}
                <div className="flex items-center justify-between border-b-2 border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Code className="size-4 text-amber-400" />
                    <span
                      className="text-sm tracking-wider text-white/60"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      AUTH.CONFIG.TS
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-white/10" />
                    <div className="size-2.5 rounded-full bg-white/10" />
                    <div className="size-2.5 rounded-full bg-amber-400/50" />
                  </div>
                </div>

                {/* Code content */}
                <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
                  <code>
                    <span className="text-blue-400">import</span>
                    <span className="text-white/70">{" { "}</span>
                    <span className="text-amber-400">betterAuth</span>
                    <span className="text-white/70">{" } "}</span>
                    <span className="text-blue-400">from</span>
                    <span className="text-emerald-400">
                      {' "better-auth"'}
                    </span>
                    <span className="text-white/30">;</span>
                    {"\n"}
                    <span className="text-blue-400">import</span>
                    <span className="text-white/70">{" { "}</span>
                    <span className="text-amber-400">devTools</span>
                    <span className="text-white/70">{" } "}</span>
                    <span className="text-blue-400">from</span>
                    <span className="text-emerald-400">
                      {' "better-auth-devtools"'}
                    </span>
                    <span className="text-white/30">;</span>
                    {"\n\n"}
                    <span className="text-blue-400">export const</span>
                    <span className="text-white/70"> auth = </span>
                    <span className="text-amber-400">betterAuth</span>
                    <span className="text-white/70">{"({"}</span>
                    {"\n"}
                    <span className="text-white/70">{"  plugins: ["}</span>
                    {"\n"}
                    <span className="text-white/70">{"    "}</span>
                    <span className="text-amber-400">devTools</span>
                    <span className="text-white/70">{"({"}</span>
                    {"\n"}
                    <span className="text-white/50">
                      {"      "}
                    </span>
                    <span className="text-white/70">users: </span>
                    <span className="text-white/70">{"["}</span>
                    {"\n"}
                    <span className="text-white/70">
                      {'        { name: '}
                    </span>
                    <span className="text-emerald-400">{'"Admin"'}</span>
                    <span className="text-white/70">{", role: "}</span>
                    <span className="text-emerald-400">{'"admin"'}</span>
                    <span className="text-white/70">{" },"}</span>
                    {"\n"}
                    <span className="text-white/70">
                      {'        { name: '}
                    </span>
                    <span className="text-emerald-400">{'"Editor"'}</span>
                    <span className="text-white/70">{", role: "}</span>
                    <span className="text-emerald-400">{'"editor"'}</span>
                    <span className="text-white/70">{" },"}</span>
                    {"\n"}
                    <span className="text-white/70">
                      {'        { name: '}
                    </span>
                    <span className="text-emerald-400">{'"Viewer"'}</span>
                    <span className="text-white/70">{", role: "}</span>
                    <span className="text-emerald-400">{'"viewer"'}</span>
                    <span className="text-white/70">{" },"}</span>
                    {"\n"}
                    <span className="text-white/70">{"      ],"}</span>
                    {"\n"}
                    <span className="text-white/70">{"    }),"}</span>
                    {"\n"}
                    <span className="text-white/70">{"  ],"}</span>
                    {"\n"}
                    <span className="text-white/70">{"});"}</span>
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: ARCHITECTURE OVERVIEW
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#161B22]">
        {/* Angled top divider */}
        <div
          className="absolute top-0 left-0 right-0 h-20 bg-[#0D1117]"
          style={{ transform: "skewY(2deg)", transformOrigin: "top left" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="mb-2 block text-sm tracking-[0.4em] text-amber-400/60 uppercase"
              style={{ fontFamily: "var(--font-work)" }}
            >
              How It Works
            </span>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[0.03em] text-white"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              ARCHITECTURE
            </h2>
          </motion.div>

          {/* Flow diagram */}
          <motion.div
            className="flex flex-col items-center gap-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            {/* Row of boxes */}
            <div className="grid w-full max-w-4xl gap-6 md:grid-cols-4">
              {[
                {
                  icon: Terminal,
                  label: "YOUR APP",
                  sub: "Next.js / Express",
                  color: "border-amber-400 text-amber-400",
                },
                {
                  icon: Layers,
                  label: "BETTER AUTH",
                  sub: "Auth Framework",
                  color: "border-blue-500 text-blue-500",
                },
                {
                  icon: Code,
                  label: "DEVTOOLS PLUGIN",
                  sub: "better-auth-devtools",
                  color: "border-emerald-500 text-emerald-500",
                },
                {
                  icon: Eye,
                  label: "DEVTOOLS PANEL",
                  sub: "Browser UI",
                  color: "border-amber-400 text-amber-400",
                },
              ].map((box, i) => (
                <motion.div
                  key={box.label}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div
                    className={`border-2 bg-[#0D1117] p-6 text-center ${box.color}`}
                  >
                    <box.icon className="mx-auto mb-3 size-8" />
                    <span
                      className="block text-lg tracking-wider"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {box.label}
                    </span>
                    <span className="mt-1 block text-xs text-white/30">
                      {box.sub}
                    </span>
                  </div>

                  {/* Connector arrow */}
                  {i < 3 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:flex items-center z-10">
                      <ChevronRight className="size-5 text-white/20" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Connector details below */}
            <div className="mt-12 grid w-full max-w-3xl gap-4 md:grid-cols-3">
              {[
                "Plugin hooks into Better Auth's session lifecycle",
                "Manages ephemeral test users & session overrides",
                "Exposes real-time panel in browser (dev only)",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-center">
                  <div className="mx-auto flex items-start gap-2">
                    <DiamondBullet className="mt-1 shrink-0" />
                    <span className="text-xs leading-relaxed text-white/40">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: QUICK START
          ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0D1117]">
        {/* Striped background */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #F59E0B 0px,
              #F59E0B 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="mb-2 block text-sm tracking-[0.4em] text-amber-400/60 uppercase"
              style={{ fontFamily: "var(--font-work)" }}
            >
              Get Started
            </span>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[0.03em] text-white"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              THREE STEPS.{" "}
              <span className="text-amber-400">THAT&apos;S IT.</span>
            </h2>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="flex gap-6">
                  {/* Oversized number */}
                  <div className="relative shrink-0">
                    <span
                      className="text-[6rem] leading-none text-amber-400/10"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {step.num}
                    </span>
                    {/* Geometric progress line */}
                    {i < steps.length - 1 && (
                      <div className="absolute bottom-0 left-1/2 h-8 w-[2px] -translate-x-1/2 bg-amber-400/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-4">
                    <h3
                      className="mb-3 text-2xl tracking-wider text-white"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {step.title.toUpperCase()}
                    </h3>
                    <div className="border-2 border-white/10 bg-[#161B22] p-5">
                      <pre className="overflow-x-auto text-sm leading-relaxed">
                        <code className="text-amber-400/80">{step.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <GeometricSeparator />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6: FOOTER CTA
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#161B22]">
        {/* Art deco fan motif */}
        <div
          className="absolute bottom-0 left-1/2 size-[800px] -translate-x-1/2 translate-y-1/2 opacity-[0.03]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, transparent 0deg, #F59E0B 5deg, transparent 10deg, transparent 20deg, #F59E0B 25deg, transparent 30deg, transparent 40deg, #F59E0B 45deg, transparent 50deg, transparent 60deg, #F59E0B 65deg, transparent 70deg, transparent 80deg, #F59E0B 85deg, transparent 90deg, transparent 100deg, #F59E0B 105deg, transparent 110deg, transparent 120deg, #F59E0B 125deg, transparent 130deg, transparent 140deg, #F59E0B 145deg, transparent 150deg, transparent 160deg, #F59E0B 165deg, transparent 170deg, transparent 180deg)",
            borderRadius: "50%",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="mb-4 text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-[0.03em] text-white"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              STOP TESTING WITH
              <br />
              <span className="text-amber-400">REAL CREDENTIALS</span>
            </h2>

            <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-white/40">
              Install better-auth-devtools and start building with managed test
              users, instant session switching, and development-only safety
              guards.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-14 rounded-none border-2 border-amber-400 bg-amber-400 px-10 text-base font-bold tracking-wider text-[#0D1117] uppercase hover:bg-amber-300 transition-colors">
                  <Github className="mr-2 size-5" />
                  Get Started
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </a>

              <a
                href="https://www.npmjs.com/package/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-14 rounded-none border-2 border-white/20 bg-transparent px-10 text-base tracking-wider text-white/70 uppercase hover:border-white/40 hover:text-white transition-colors">
                  <RefreshCw className="mr-2 size-4" />
                  npm Package
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Bottom footer */}
          <div className="mt-24 border-t-2 border-white/[0.06] pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <DiamondBullet />
                <span
                  className="text-lg tracking-[0.2em] text-white/30"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  BETTER AUTH DEVTOOLS
                </span>
              </div>

              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-white/30 transition-colors hover:text-amber-400"
                >
                  <Github className="size-3.5" />
                  GitHub
                </a>
                <a
                  href="https://www.npmjs.com/package/better-auth-devtools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-white/30 transition-colors hover:text-amber-400"
                >
                  <Terminal className="size-3.5" />
                  npm
                </a>
              </div>

              <span className="text-xs text-white/20">
                Open Source &middot; MIT License
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
