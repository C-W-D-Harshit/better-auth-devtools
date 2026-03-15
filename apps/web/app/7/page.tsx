"use client";

import { motion, type Variants } from "motion/react";
import { Archivo, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import {
  Users,
  Zap,
  Eye,
  Settings,
  Shield,
  Terminal,
  Github,
  ArrowRight,
  Lock,
  Package,
  Crosshair,
  FileCode2,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb",
});

/* ─────────────────── ANIMATION VARIANTS ─────────────────── */

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const drawLineH: Variants = {
  hidden: { width: 0 },
  visible: { width: "100%", transition: { duration: 1.2, ease: "easeInOut" } },
};

const drawLineV: Variants = {
  hidden: { height: 0 },
  visible: { height: "100%", transition: { duration: 1.0, ease: "easeInOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const plotIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ─────────────────── BLUEPRINT DECORATORS ─────────────────── */

function CornerMarks({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Top-left */}
      <div className="absolute -left-1 -top-1 h-4 w-4">
        <div className="absolute left-0 top-0 h-4 w-[1px] bg-[#A8D4FF]/50" />
        <div className="absolute left-0 top-0 h-[1px] w-4 bg-[#A8D4FF]/50" />
      </div>
      {/* Top-right */}
      <div className="absolute -right-1 -top-1 h-4 w-4">
        <div className="absolute right-0 top-0 h-4 w-[1px] bg-[#A8D4FF]/50" />
        <div className="absolute right-0 top-0 h-[1px] w-4 bg-[#A8D4FF]/50" />
      </div>
      {/* Bottom-left */}
      <div className="absolute -bottom-1 -left-1 h-4 w-4">
        <div className="absolute bottom-0 left-0 h-4 w-[1px] bg-[#A8D4FF]/50" />
        <div className="absolute bottom-0 left-0 h-[1px] w-4 bg-[#A8D4FF]/50" />
      </div>
      {/* Bottom-right */}
      <div className="absolute -bottom-1 -right-1 h-4 w-4">
        <div className="absolute bottom-0 right-0 h-4 w-[1px] bg-[#A8D4FF]/50" />
        <div className="absolute bottom-0 right-0 h-[1px] w-4 bg-[#A8D4FF]/50" />
      </div>
      {children}
    </div>
  );
}

function CrosshairMark({ className = "" }: { className?: string }) {
  return (
    <div className={`relative size-3 ${className}`}>
      <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#00E5FF]/40" />
      <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#00E5FF]/40" />
    </div>
  );
}

function DimensionLine({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <div className="h-3 w-[1px] bg-[#A8D4FF]/40" />
      <div className="h-[1px] flex-1 bg-[#A8D4FF]/40" />
      <span
        className={`${jetbrainsMono.className} mx-2 text-[9px] tracking-wider text-[#A8D4FF]/50 uppercase`}
      >
        {label}
      </span>
      <div className="h-[1px] flex-1 bg-[#A8D4FF]/40" />
      <div className="h-3 w-[1px] bg-[#A8D4FF]/40" />
    </div>
  );
}

function RefMarker({ num }: { num: string }) {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full border border-[#00E5FF]/60 text-[10px] text-[#00E5FF] font-medium">
      {num}
    </span>
  );
}

function SpecLabel({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`${jetbrainsMono.className} text-[9px] tracking-[0.2em] text-[#A8D4FF]/40 uppercase ${className}`}
    >
      {text}
    </span>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <CrosshairMark />
      <div className="h-[1px] flex-1 bg-[#A8D4FF]/15" />
      <SpecLabel text={label} />
      <div className="h-[1px] flex-1 bg-[#A8D4FF]/15" />
      <CrosshairMark />
    </div>
  );
}

/* ─────────────────── FEATURES DATA ─────────────────── */

const features = [
  {
    ref: "001",
    title: "Managed Test Users",
    desc: "Create disposable test users from pre-defined templates. Admin, Editor, Viewer -- ready in milliseconds.",
    icon: Users,
    module: "USER_MGMT",
  },
  {
    ref: "002",
    title: "Instant Session Switching",
    desc: "Switch between test users with one click. No credentials. No login forms. Zero friction.",
    icon: Zap,
    module: "SESSION_CTRL",
  },
  {
    ref: "003",
    title: "Session Inspection",
    desc: "View all current session data in real-time. Every token, every claim, every field -- exposed.",
    icon: Eye,
    module: "INSPECT_MOD",
  },
  {
    ref: "004",
    title: "Session Patching",
    desc: "Edit approved session fields on-the-fly. Change roles, permissions, metadata -- no re-auth needed.",
    icon: Settings,
    module: "PATCH_SYS",
  },
  {
    ref: "005",
    title: "Role-Based Testing",
    desc: "Multiple user templates with different roles. Test every permission boundary in your application.",
    icon: Shield,
    module: "ROLE_ENGINE",
  },
  {
    ref: "006",
    title: "Development-Only Safety",
    desc: "Only works when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk in production.",
    icon: Lock,
    module: "SAFETY_GATE",
  },
];

const installSteps = [
  { step: "01", cmd: "npm install better-auth-devtools", label: "Install package from npm registry" },
  { step: "02", cmd: "import { devTools } from 'better-auth-devtools'", label: "Import plugin module" },
  { step: "03", cmd: "plugins: [devTools()]", label: "Add to Better Auth plugin config" },
  { step: "04", cmd: "DEV_AUTH_ENABLED=true", label: "Set environment variable" },
];

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function BlueprintLanding() {
  return (
    <div
      className={`${archivo.variable} ${jetbrainsMono.variable} relative min-h-screen overflow-x-hidden`}
      style={{
        backgroundColor: "#0A1628",
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(168,212,255,0.03) 19px, rgba(168,212,255,0.03) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(168,212,255,0.03) 19px, rgba(168,212,255,0.03) 20px),
          repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(168,212,255,0.07) 99px, rgba(168,212,255,0.07) 100px),
          repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(168,212,255,0.07) 99px, rgba(168,212,255,0.07) 100px)
        `,
      }}
    >
      {/* ─── NAV ─── */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12"
      >
        <Link
          href="/"
          className={`${jetbrainsMono.className} flex items-center gap-2 text-xs text-[#A8D4FF]/60 hover:text-[#A8D4FF] transition-colors`}
        >
          <ArrowRight className="size-3 rotate-180" />
          RETURN TO INDEX
        </Link>
        <div className="flex items-center gap-3">
          <SpecLabel text="REV: 7.0" />
          <div className="h-3 w-[1px] bg-[#A8D4FF]/20" />
          <SpecLabel text="SCALE: 1:1" />
        </div>
      </motion.nav>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1: TITLE BLOCK HERO
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pb-24 pt-12 md:pt-20"
        >
          {/* Top dimension line */}
          <motion.div variants={fadeIn}>
            <DimensionLine label="960px" />
          </motion.div>

          {/* Title block outer frame */}
          <motion.div
            variants={plotIn}
            className="relative mt-6 border border-[#A8D4FF]/20 p-6 md:p-10"
          >
            {/* Corner markers */}
            <div className="absolute -left-[3px] -top-[3px] size-[6px] border border-[#00E5FF]/60" />
            <div className="absolute -right-[3px] -top-[3px] size-[6px] border border-[#00E5FF]/60" />
            <div className="absolute -bottom-[3px] -left-[3px] size-[6px] border border-[#00E5FF]/60" />
            <div className="absolute -bottom-[3px] -right-[3px] size-[6px] border border-[#00E5FF]/60" />

            {/* Floating annotation */}
            <motion.div
              variants={fadeUp}
              className="absolute -top-3 left-8"
            >
              <span
                className={`${jetbrainsMono.className} bg-[#0A1628] px-2 text-[10px] tracking-[0.25em] text-[#00E5FF]/70`}
              >
                TITLE_BLOCK
              </span>
            </motion.div>

            {/* Badge row */}
            <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center gap-3">
              <Badge className="rounded-none border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] tracking-wider font-mono px-3 py-1 hover:bg-[#00E5FF]/20">
                BETTER AUTH PLUGIN
              </Badge>
              <Badge className="rounded-none border border-[#A8D4FF]/30 bg-transparent text-[#A8D4FF]/70 text-[10px] tracking-wider font-mono px-3 py-1">
                DEV ENVIRONMENT ONLY
              </Badge>
            </motion.div>

            {/* Main title with dimension lines */}
            <div className="relative">
              <motion.div
                variants={staggerItem}
                className="flex items-start gap-4"
              >
                <div className="hidden md:flex flex-col items-center gap-1 pt-2">
                  <div className="h-[1px] w-6 bg-[#A8D4FF]/30" />
                  <SpecLabel text="A" className="text-[8px]" />
                </div>
                <div className="flex-1">
                  <h1
                    className={`${archivo.className} text-5xl md:text-7xl lg:text-8xl font-900 tracking-tight leading-[0.9] text-[#F0F4F8]`}
                    style={{ fontWeight: 900 }}
                  >
                    BETTER AUTH
                    <br />
                    <span className="text-[#00E5FF]">DEVTOOLS</span>
                  </h1>
                </div>
              </motion.div>

              {/* Dimension line under title */}
              <motion.div variants={fadeIn} className="mt-4">
                <DimensionLine label="TITLE_WIDTH" />
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className={`${jetbrainsMono.className} mt-6 max-w-xl text-sm leading-relaxed text-[#A8D4FF]/70`}
            >
              Authentication testing infrastructure for{" "}
              <span className="text-[#00E5FF]">Better Auth</span>. Manage test users,
              switch sessions instantly, inspect and patch auth state -- all from your
              dev environment.
            </motion.p>

            {/* Title block meta row */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-6 border-t border-[#A8D4FF]/10 pt-6"
            >
              <div className="flex items-center gap-2">
                <SpecLabel text="DWG NO:" />
                <span className={`${jetbrainsMono.className} text-xs text-[#F0F4F8]/80`}>
                  BA-DT-001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SpecLabel text="DATE:" />
                <span className={`${jetbrainsMono.className} text-xs text-[#F0F4F8]/80`}>
                  2026-03-15
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SpecLabel text="REV:" />
                <span className={`${jetbrainsMono.className} text-xs text-[#F0F4F8]/80`}>
                  1.0.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SpecLabel text="STATUS:" />
                <span className={`${jetbrainsMono.className} text-xs text-[#00E5FF]`}>
                  PRODUCTION READY
                </span>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link href="https://www.npmjs.com/package/better-auth-devtools" target="_blank">
                <Button className="h-11 rounded-none border border-[#00E5FF] bg-[#00E5FF]/10 px-8 text-[#00E5FF] font-mono text-sm tracking-wider hover:bg-[#00E5FF]/20 transition-colors">
                  <Package className="mr-2 size-4" />
                  NPM INSTALL
                </Button>
              </Link>
              <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                <Button className="h-11 rounded-none border border-[#A8D4FF]/30 bg-transparent px-8 text-[#A8D4FF]/80 font-mono text-sm tracking-wider hover:bg-[#A8D4FF]/10 transition-colors">
                  <Github className="mr-2 size-4" />
                  VIEW SOURCE
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom dimension line */}
          <motion.div variants={fadeIn} className="mt-6">
            <DimensionLine label="HERO_SECTION" />
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2: SPECIFICATION SHEET
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="pb-24"
        >
          <motion.div variants={fadeIn}>
            <SectionDivider label="SPECIFICATION SHEET // FEATURE_MODULES" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3"
          >
            <Crosshair className="size-4 text-[#00E5FF]/50" />
            <h2
              className={`${archivo.className} text-2xl md:text-3xl font-800 tracking-tight text-[#F0F4F8]`}
              style={{ fontWeight: 800 }}
            >
              TECHNICAL SPECIFICATIONS
            </h2>
            <SpecLabel text="SEC: 02" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className={`${jetbrainsMono.className} mt-3 text-xs text-[#A8D4FF]/50`}
          >
            REF: BA-DT-SPEC // All modules listed below are included in the standard package.
          </motion.p>

          {/* Feature spec rows */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-8 space-y-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.ref}
                variants={staggerItem}
                className="group relative border border-[#A8D4FF]/10 bg-[#0A1628]/80 transition-all hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/[0.02]"
              >
                <div className="flex items-start gap-4 p-4 md:p-5">
                  {/* Ref marker */}
                  <div className="flex flex-col items-center gap-1.5 pt-0.5">
                    <RefMarker num={f.ref} />
                    <div className="h-6 w-[1px] bg-[#A8D4FF]/10 group-hover:bg-[#00E5FF]/20 transition-colors" />
                  </div>

                  {/* Icon box */}
                  <div className="flex size-10 shrink-0 items-center justify-center border border-[#A8D4FF]/15 bg-[#A8D4FF]/[0.03]">
                    <f.icon className="size-4 text-[#00E5FF]/70" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`${archivo.className} text-sm md:text-base font-700 tracking-wide text-[#F0F4F8]`}
                        style={{ fontWeight: 700 }}
                      >
                        {f.title.toUpperCase()}
                      </h3>
                      <SpecLabel text={f.module} />
                    </div>
                    <p
                      className={`${jetbrainsMono.className} mt-1.5 text-xs leading-relaxed text-[#A8D4FF]/50`}
                    >
                      {f.desc}
                    </p>
                  </div>

                  {/* Right side dot indicator */}
                  <div className="hidden md:flex items-center gap-2 self-center">
                    <div className="h-[1px] w-8 bg-[#A8D4FF]/10 group-hover:bg-[#00E5FF]/30 transition-colors" />
                    <div className="size-2 border border-[#A8D4FF]/20 group-hover:border-[#00E5FF]/50 group-hover:bg-[#00E5FF]/20 transition-colors" />
                  </div>
                </div>

                {/* Corner marks */}
                <div className="absolute left-0 top-0 h-2 w-[1px] bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/40 transition-colors" />
                <div className="absolute left-0 top-0 h-[1px] w-2 bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/40 transition-colors" />
                <div className="absolute bottom-0 right-0 h-2 w-[1px] bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/40 transition-colors" />
                <div className="absolute bottom-0 right-0 h-[1px] w-2 bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/40 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3: SYSTEM DIAGRAM
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="pb-24"
        >
          <motion.div variants={fadeIn}>
            <SectionDivider label="SYSTEM DIAGRAM // ARCHITECTURE" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3"
          >
            <Layers className="size-4 text-[#00E5FF]/50" />
            <h2
              className={`${archivo.className} text-2xl md:text-3xl font-800 tracking-tight text-[#F0F4F8]`}
              style={{ fontWeight: 800 }}
            >
              SYSTEM ARCHITECTURE
            </h2>
            <SpecLabel text="SEC: 03" />
          </motion.div>

          <motion.div
            variants={plotIn}
            className="relative mt-8 border border-[#A8D4FF]/15 p-6 md:p-10"
          >
            {/* Floating label */}
            <div className="absolute -top-3 left-6">
              <span
                className={`${jetbrainsMono.className} bg-[#0A1628] px-2 text-[10px] tracking-[0.25em] text-[#00E5FF]/60`}
              >
                ARCH_DIAGRAM
              </span>
            </div>

            {/* Architecture flow */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Your App */}
              <CornerMarks>
                <div className="border border-[#A8D4FF]/20 p-5">
                  <SpecLabel text="LAYER: APPLICATION" />
                  <h3
                    className={`${archivo.className} mt-2 text-lg font-700 text-[#F0F4F8]`}
                    style={{ fontWeight: 700 }}
                  >
                    YOUR APP
                  </h3>
                  <p className={`${jetbrainsMono.className} mt-2 text-[11px] text-[#A8D4FF]/50 leading-relaxed`}>
                    Next.js / React application with Better Auth configured.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="size-1.5 bg-[#00E5FF]/60" />
                    <span className={`${jetbrainsMono.className} text-[10px] text-[#A8D4FF]/40`}>
                      AUTH_CLIENT
                    </span>
                  </div>
                </div>
              </CornerMarks>

              {/* DevTools Plugin */}
              <CornerMarks>
                <div className="border border-[#00E5FF]/30 bg-[#00E5FF]/[0.03] p-5">
                  <SpecLabel text="LAYER: PLUGIN" />
                  <h3
                    className={`${archivo.className} mt-2 text-lg font-700 text-[#00E5FF]`}
                    style={{ fontWeight: 700 }}
                  >
                    DEVTOOLS
                  </h3>
                  <p className={`${jetbrainsMono.className} mt-2 text-[11px] text-[#A8D4FF]/50 leading-relaxed`}>
                    Plugin layer that intercepts and manages auth sessions during
                    development.
                  </p>
                  <div className="mt-4 space-y-1.5">
                    {["TEST_USERS", "SESSION_MGR", "ROLE_ENGINE"].map((m) => (
                      <div key={m} className="flex items-center gap-2">
                        <div className="size-1.5 bg-[#00E5FF]/60" />
                        <span className={`${jetbrainsMono.className} text-[10px] text-[#00E5FF]/60`}>
                          {m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CornerMarks>

              {/* Better Auth */}
              <CornerMarks>
                <div className="border border-[#A8D4FF]/20 p-5">
                  <SpecLabel text="LAYER: AUTH_CORE" />
                  <h3
                    className={`${archivo.className} mt-2 text-lg font-700 text-[#F0F4F8]`}
                    style={{ fontWeight: 700 }}
                  >
                    BETTER AUTH
                  </h3>
                  <p className={`${jetbrainsMono.className} mt-2 text-[11px] text-[#A8D4FF]/50 leading-relaxed`}>
                    Core authentication framework. Sessions, users, database
                    adapters.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="size-1.5 bg-[#A8D4FF]/40" />
                    <span className={`${jetbrainsMono.className} text-[10px] text-[#A8D4FF]/40`}>
                      AUTH_CORE
                    </span>
                  </div>
                </div>
              </CornerMarks>
            </div>

            {/* Connection lines row */}
            <div className="mt-6 hidden md:grid grid-cols-3 items-center gap-6">
              <div className="flex items-center justify-end">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#00E5FF]/40" />
                <div className="size-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-[#00E5FF]/40" />
              </div>
              <div className="flex items-center justify-center">
                <SpecLabel text="DATA FLOW" />
              </div>
              <div className="flex items-center">
                <div className="size-0 border-y-[4px] border-r-[6px] border-y-transparent border-r-[#00E5FF]/40" />
                <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#00E5FF]/40" />
              </div>
            </div>

            {/* Safety gate note */}
            <div className="mt-6 flex items-start gap-3 border border-dashed border-[#A8D4FF]/10 p-4">
              <Lock className="mt-0.5 size-4 shrink-0 text-[#A8D4FF]/40" />
              <div>
                <span className={`${jetbrainsMono.className} text-[10px] tracking-wider text-[#A8D4FF]/40`}>
                  SAFETY_GATE // NOTE
                </span>
                <p className={`${jetbrainsMono.className} mt-1 text-xs text-[#A8D4FF]/50`}>
                  DevTools plugin automatically disables when NODE_ENV !== &quot;development&quot;
                  or DEV_AUTH_ENABLED !== &quot;true&quot;. Zero surface area in production builds.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4: CODE SPECIFICATION
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="pb-24"
        >
          <motion.div variants={fadeIn}>
            <SectionDivider label="CODE SPECIFICATION // IMPLEMENTATION" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3"
          >
            <FileCode2 className="size-4 text-[#00E5FF]/50" />
            <h2
              className={`${archivo.className} text-2xl md:text-3xl font-800 tracking-tight text-[#F0F4F8]`}
              style={{ fontWeight: 800 }}
            >
              CODE SPECIFICATION
            </h2>
            <SpecLabel text="SEC: 04" />
          </motion.div>

          <motion.div
            variants={plotIn}
            className="relative mt-8 border border-[#A8D4FF]/15 overflow-hidden"
          >
            {/* Code header bar */}
            <div className="flex items-center justify-between border-b border-[#A8D4FF]/10 px-5 py-3">
              <div className="flex items-center gap-3">
                <Terminal className="size-3.5 text-[#00E5FF]/60" />
                <span className={`${jetbrainsMono.className} text-[11px] text-[#A8D4FF]/50`}>
                  auth.config.ts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SpecLabel text="LANG: TypeScript" />
                <div className="h-3 w-[1px] bg-[#A8D4FF]/15" />
                <SpecLabel text="SPEC: CONFIG" />
              </div>
            </div>

            {/* Code content */}
            <div className="p-5 md:p-6">
              <pre className={`${jetbrainsMono.className} text-[12px] md:text-[13px] leading-relaxed overflow-x-auto`}>
                <code>
                  <span className="text-[#A8D4FF]/30">{"// "}REF: BA-DT-001 // Auth Configuration</span>
                  {"\n"}
                  <span className="text-[#A8D4FF]/60">import</span>
                  <span className="text-[#F0F4F8]">{" { "}</span>
                  <span className="text-[#00E5FF]">betterAuth</span>
                  <span className="text-[#F0F4F8]">{" } "}</span>
                  <span className="text-[#A8D4FF]/60">from</span>
                  <span className="text-[#F0F4F8]"> </span>
                  <span className="text-[#A8D4FF]/80">&quot;better-auth&quot;</span>
                  {"\n"}
                  <span className="text-[#A8D4FF]/60">import</span>
                  <span className="text-[#F0F4F8]">{" { "}</span>
                  <span className="text-[#00E5FF]">devTools</span>
                  <span className="text-[#F0F4F8]">{" } "}</span>
                  <span className="text-[#A8D4FF]/60">from</span>
                  <span className="text-[#F0F4F8]"> </span>
                  <span className="text-[#A8D4FF]/80">&quot;better-auth-devtools&quot;</span>
                  {"\n\n"}
                  <span className="text-[#A8D4FF]/60">export const</span>
                  <span className="text-[#F0F4F8]"> auth </span>
                  <span className="text-[#A8D4FF]/60">=</span>
                  <span className="text-[#F0F4F8]"> </span>
                  <span className="text-[#00E5FF]">betterAuth</span>
                  <span className="text-[#F0F4F8]">{"({"}</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"  "}</span>
                  <span className="text-[#A8D4FF]/80">plugins</span>
                  <span className="text-[#F0F4F8]">: [</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"    "}</span>
                  <span className="text-[#00E5FF]">devTools</span>
                  <span className="text-[#F0F4F8]">{"({"}</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"      "}</span>
                  <span className="text-[#A8D4FF]/80">templates</span>
                  <span className="text-[#F0F4F8]">: [</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"        "}</span>
                  <span className="text-[#F0F4F8]">{"{ "}</span>
                  <span className="text-[#A8D4FF]/80">name</span>
                  <span className="text-[#F0F4F8]">: </span>
                  <span className="text-[#A8D4FF]/80">&quot;Admin&quot;</span>
                  <span className="text-[#F0F4F8]">, </span>
                  <span className="text-[#A8D4FF]/80">role</span>
                  <span className="text-[#F0F4F8]">: </span>
                  <span className="text-[#A8D4FF]/80">&quot;admin&quot;</span>
                  <span className="text-[#F0F4F8]">{" },"}</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"        "}</span>
                  <span className="text-[#F0F4F8]">{"{ "}</span>
                  <span className="text-[#A8D4FF]/80">name</span>
                  <span className="text-[#F0F4F8]">: </span>
                  <span className="text-[#A8D4FF]/80">&quot;Editor&quot;</span>
                  <span className="text-[#F0F4F8]">, </span>
                  <span className="text-[#A8D4FF]/80">role</span>
                  <span className="text-[#F0F4F8]">: </span>
                  <span className="text-[#A8D4FF]/80">&quot;editor&quot;</span>
                  <span className="text-[#F0F4F8]">{" },"}</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"        "}</span>
                  <span className="text-[#F0F4F8]">{"{ "}</span>
                  <span className="text-[#A8D4FF]/80">name</span>
                  <span className="text-[#F0F4F8]">: </span>
                  <span className="text-[#A8D4FF]/80">&quot;Viewer&quot;</span>
                  <span className="text-[#F0F4F8]">, </span>
                  <span className="text-[#A8D4FF]/80">role</span>
                  <span className="text-[#F0F4F8]">: </span>
                  <span className="text-[#A8D4FF]/80">&quot;viewer&quot;</span>
                  <span className="text-[#F0F4F8]">{" },"}</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"      "}</span>
                  <span className="text-[#F0F4F8]">],</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"    "}</span>
                  <span className="text-[#F0F4F8]">{"})"}</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"  "}</span>
                  <span className="text-[#F0F4F8]">],</span>
                  {"\n"}
                  <span className="text-[#F0F4F8]">{"})"}</span>
                </code>
              </pre>
            </div>

            {/* Bottom annotation */}
            <div className="flex items-center justify-between border-t border-[#A8D4FF]/10 px-5 py-2.5">
              <SpecLabel text="3 user templates defined" />
              <SpecLabel text="REF: IMPLEMENTATION_SPEC" />
            </div>
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5: INSTALLATION PROCEDURE
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="pb-24"
        >
          <motion.div variants={fadeIn}>
            <SectionDivider label="INSTALLATION PROCEDURE // SETUP" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3"
          >
            <Terminal className="size-4 text-[#00E5FF]/50" />
            <h2
              className={`${archivo.className} text-2xl md:text-3xl font-800 tracking-tight text-[#F0F4F8]`}
              style={{ fontWeight: 800 }}
            >
              INSTALLATION PROCEDURE
            </h2>
            <SpecLabel text="SEC: 05" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-8 space-y-4"
          >
            {installSteps.map((s, i) => (
              <motion.div
                key={s.step}
                variants={staggerItem}
                className="relative flex items-stretch gap-4"
              >
                {/* Step number with vertical connection line */}
                <div className="flex flex-col items-center">
                  <div className="flex size-10 items-center justify-center border border-[#00E5FF]/40 bg-[#00E5FF]/[0.05]">
                    <span
                      className={`${archivo.className} text-sm font-700 text-[#00E5FF]`}
                      style={{ fontWeight: 700 }}
                    >
                      {s.step}
                    </span>
                  </div>
                  {i < installSteps.length - 1 && (
                    <div className="flex-1 w-[1px] bg-[#A8D4FF]/10 mt-1" />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 border border-[#A8D4FF]/10 p-4 pb-5">
                  <SpecLabel text={s.label} />
                  <div className="mt-2.5 flex items-center gap-2 bg-[#0A1628] border border-[#A8D4FF]/10 px-4 py-2.5">
                    <span className={`${jetbrainsMono.className} text-[11px] text-[#A8D4FF]/30`}>
                      $
                    </span>
                    <code className={`${jetbrainsMono.className} text-[12px] md:text-[13px] text-[#00E5FF]/80`}>
                      {s.cmd}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6: CTA / APPROVAL STAMP
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="pb-24"
        >
          <motion.div variants={fadeIn}>
            <SectionDivider label="APPROVAL // SIGN-OFF" />
          </motion.div>

          <motion.div
            variants={plotIn}
            className="relative mt-8 flex flex-col items-center"
          >
            {/* Approval stamp container */}
            <div className="relative w-full max-w-lg border-2 border-[#00E5FF]/30 p-8 md:p-12 text-center">
              {/* Double border effect */}
              <div className="absolute inset-2 border border-[#00E5FF]/15 pointer-events-none" />

              {/* Corner squares */}
              <div className="absolute -left-1.5 -top-1.5 size-3 border border-[#00E5FF]/50 bg-[#0A1628]" />
              <div className="absolute -right-1.5 -top-1.5 size-3 border border-[#00E5FF]/50 bg-[#0A1628]" />
              <div className="absolute -bottom-1.5 -left-1.5 size-3 border border-[#00E5FF]/50 bg-[#0A1628]" />
              <div className="absolute -bottom-1.5 -right-1.5 size-3 border border-[#00E5FF]/50 bg-[#0A1628]" />

              <motion.div variants={fadeUp}>
                <SpecLabel text="ENGINEERING APPROVAL" />
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className={`${archivo.className} mt-4 text-3xl md:text-4xl font-900 tracking-tight text-[#F0F4F8]`}
                style={{ fontWeight: 900 }}
              >
                APPROVED FOR
                <br />
                <span className="text-[#00E5FF]">DEVELOPMENT USE</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className={`${jetbrainsMono.className} mx-auto mt-4 max-w-sm text-xs leading-relaxed text-[#A8D4FF]/50`}
              >
                This tool has been verified for development environment use.
                Install now and accelerate your auth testing workflow.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="https://www.npmjs.com/package/better-auth-devtools" target="_blank">
                  <Button className="h-12 rounded-none border-2 border-[#00E5FF] bg-[#00E5FF]/10 px-10 text-[#00E5FF] font-mono text-sm tracking-widest hover:bg-[#00E5FF]/20 transition-colors">
                    <Package className="mr-2 size-4" />
                    INSTALL PACKAGE
                  </Button>
                </Link>
                <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                  <Button className="h-12 rounded-none border border-[#A8D4FF]/30 bg-transparent px-10 text-[#A8D4FF]/80 font-mono text-sm tracking-widest hover:bg-[#A8D4FF]/10 transition-colors">
                    <Github className="mr-2 size-4" />
                    SOURCE CODE
                  </Button>
                </Link>
              </motion.div>

              {/* Approval stamp meta */}
              <motion.div
                variants={fadeIn}
                className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-[#A8D4FF]/10 pt-6"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-[#00E5FF]/60" />
                  <SpecLabel text="VERIFIED" />
                </div>
                <div className="h-3 w-[1px] bg-[#A8D4FF]/15" />
                <SpecLabel text="DWG: BA-DT-001" />
                <div className="h-3 w-[1px] bg-[#A8D4FF]/15" />
                <SpecLabel text="DATE: 2026-03-15" />
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* ─── TITLE BLOCK FOOTER (Engineering drawing style) ─── */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="relative border-t border-[#A8D4FF]/10"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 border-x border-[#A8D4FF]/10">
            {[
              { label: "PROJECT", value: "BETTER AUTH DEVTOOLS" },
              { label: "PACKAGE", value: "better-auth-devtools" },
              { label: "LICENSE", value: "MIT" },
              { label: "STATUS", value: "PRODUCTION READY" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`border-b border-[#A8D4FF]/10 p-4 ${i < 3 ? "border-r border-r-[#A8D4FF]/10" : ""}`}
              >
                <SpecLabel text={item.label} />
                <p className={`${jetbrainsMono.className} mt-1 text-xs text-[#F0F4F8]/70`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between py-4">
            <SpecLabel text="ALL SPECIFICATIONS SUBJECT TO CHANGE WITHOUT NOTICE" />
            <SpecLabel text="SHEET 1 OF 1" />
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
