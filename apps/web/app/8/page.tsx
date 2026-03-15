"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { Instrument_Sans } from "next/font/google";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Terminal,
  Users,
  Zap,
  Eye,
  Settings,
  Shield,
  Lock,
  Code,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

/* ═══════════════════ ANIMATION VARIANTS ═══════════════════ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ═══════════════════ COMPONENTS ═══════════════════ */

function GradientBorderCard({
  children,
  className = "",
  hoverGlow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-xl bg-gradient-to-b from-white/[0.12] to-white/[0.03] p-px ${hoverGlow ? "transition-shadow duration-300 hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.15)]" : ""}`}
    >
      <div
        className={`rounded-[11px] bg-[#09090B] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.1)] ${className}`}
    >
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

function GradientBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs font-medium">
      <GradientText>{children}</GradientText>
    </span>
  );
}

/* ═══════════════════ PAGE ═══════════════════ */

export default function Page() {
  const [activeTab, setActiveTab] = useState<"server" | "client">("server");

  const serverCode = `import { betterAuth } from "better-auth";
import { devTools } from "better-auth-devtools";

export const auth = betterAuth({
  plugins: [
    devTools({
      templates: [
        { name: "Admin", role: "admin" },
        { name: "Editor", role: "editor" },
        { name: "Viewer", role: "viewer" },
      ],
    }),
  ],
});`;

  const clientCode = `import { createAuthClient } from "better-auth/react";
import { devToolsClient } from "better-auth-devtools/client";

export const authClient = createAuthClient({
  plugins: [devToolsClient()],
});

// Switch to any test user instantly
authClient.devTools.switchUser("admin-template");`;

  const features = [
    {
      icon: Users,
      title: "Managed Test Users",
      description:
        "Create disposable test users from pre-defined templates. Admin, Editor, Viewer — ready in milliseconds.",
    },
    {
      icon: Zap,
      title: "Instant Session Switching",
      description:
        "Switch between test users with one click. No credentials, no login forms, no friction.",
    },
    {
      icon: Eye,
      title: "Session Inspection",
      description:
        "View all current session data in real-time. Every token, every field, always visible.",
    },
    {
      icon: Settings,
      title: "Session Patching",
      description:
        "Edit approved session fields on-the-fly. Change roles, tweak permissions, test edge cases instantly.",
    },
    {
      icon: Shield,
      title: "Role-Based Testing",
      description:
        "Multiple user templates with different roles and permissions. Test your entire RBAC matrix.",
    },
    {
      icon: Lock,
      title: "Development-Only Safety",
      description:
        "Only activates when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk in production.",
    },
  ];

  return (
    <div
      className={`relative min-h-screen bg-[#09090B] text-white ${instrumentSans.variable}`}
    >
      {/* ── Noise Texture Overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Dot Grid Background ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Hero Glow ── */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
        <div className="h-[600px] w-[900px] rounded-full bg-gradient-to-b from-violet-500/[0.07] via-blue-500/[0.04] to-transparent blur-[120px]" />
      </div>

      {/* ══════════════ NAV ══════════════ */}
      <nav className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
            <Layers className="size-4" />
            <span>Better Auth DevTools</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/C-W-D-Harshit/better-auth-devtools"
              target="_blank"
              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              <Github className="size-4" />
            </Link>
            <Link href="https://www.npmjs.com/package/better-auth-devtools" target="_blank">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <Terminal className="size-3.5" />
                npm
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative z-10 overflow-hidden pb-16 pt-20 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Version Badge */}
            <motion.div variants={fadeUp}>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs backdrop-blur-sm"
              >
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-white/50">v0.1.1-alpha</span>
                <ChevronRight className="size-3 text-white/30" />
              </motion.div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-[family-name:var(--font-instrument)] text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl"
            >
              <span className="text-white">Better Auth</span>
              <br />
              <GradientText>DevTools</GradientText>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 md:text-lg"
            >
              The authentication testing toolkit for{" "}
              <span className="text-white/70">Better Auth</span>. Managed test
              users, instant session switching, and real-time inspection — all in
              your dev environment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                <button className="group relative inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 px-5 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(139,92,246,0.4)]">
                  Get Started
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </Link>
              <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white">
                  <Github className="size-4" />
                  View on GitHub
                </button>
              </Link>
            </motion.div>

            {/* Install Command */}
            <motion.div variants={fadeUp} className="mt-8">
              <div className="inline-flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-sm">
                <Terminal className="size-4 text-white/30" />
                <span className="text-white/50">npm install</span>{" "}
                <span className="text-white/80">better-auth-devtools</span>
                <CopyButton text="npm install better-auth-devtools" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ SOCIAL PROOF BAR ══════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeIn}
        className="relative z-10 border-y border-white/[0.04] py-8"
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <span className="text-xs uppercase tracking-widest text-white/25">
              Built for
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GradientBadge>TypeScript</GradientBadge>
              <GradientBadge>React</GradientBadge>
              <GradientBadge>Next.js</GradientBadge>
              <GradientBadge>Better Auth</GradientBadge>
              <GradientBadge>Open Source</GradientBadge>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-widest text-white/30"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 font-[family-name:var(--font-instrument)] text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Everything you need for{" "}
              <GradientText>auth testing</GradientText>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/40"
            >
              Stop wasting time with manual login flows. DevTools gives you
              complete control over authentication state during development.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <GlassCard className="relative h-full overflow-hidden p-6">
                  {/* Gradient top border accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                  <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-2.5">
                    <feature.icon className="size-5 text-violet-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ BENTO GRID ══════════════ */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-widest text-white/30"
            >
              Workflows
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 font-[family-name:var(--font-instrument)] text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Built for <GradientText>speed</GradientText>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="mt-14 grid gap-4 md:grid-cols-2"
          >
            {/* Card 1: Create Users — Large */}
            <motion.div variants={scaleIn}>
              <GradientBorderCard hoverGlow className="h-full p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-white/50">
                  <Users className="size-3.5 text-violet-400" />
                  Create Test Users
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/30">
                  Spin up disposable test accounts from templates in one click.
                </p>
                {/* Mini UI Mockup */}
                <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0A0A0C]">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                    <div className="size-2 rounded-full bg-white/10" />
                    <div className="size-2 rounded-full bg-white/10" />
                    <div className="size-2 rounded-full bg-white/10" />
                    <span className="ml-2 text-[10px] text-white/30">
                      DevTools Panel
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    {["Admin", "Editor", "Viewer"].map((role, i) => (
                      <div
                        key={role}
                        className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`size-6 rounded-full ${
                              i === 0
                                ? "bg-gradient-to-br from-violet-500/30 to-violet-500/10"
                                : i === 1
                                  ? "bg-gradient-to-br from-blue-500/30 to-blue-500/10"
                                  : "bg-gradient-to-br from-cyan-500/30 to-cyan-500/10"
                            } flex items-center justify-center`}
                          >
                            <span className="text-[9px] font-bold text-white/60">
                              {role[0]}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-white/70">
                              {role}
                            </span>
                            <span className="ml-2 text-[10px] text-white/25">
                              {role.toLowerCase()}@test.dev
                            </span>
                          </div>
                        </div>
                        <button className="rounded-md bg-gradient-to-r from-violet-500/20 to-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-300 transition-colors hover:from-violet-500/30 hover:to-blue-500/30">
                          Create
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </GradientBorderCard>
            </motion.div>

            {/* Card 2: Switch Sessions */}
            <motion.div variants={scaleIn}>
              <GradientBorderCard hoverGlow className="h-full p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-white/50">
                  <RefreshCw className="size-3.5 text-blue-400" />
                  Switch Sessions
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/30">
                  One-click session switching between any test user. No
                  credentials needed.
                </p>
                {/* Mini UI Mockup */}
                <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0A0A0C]">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                    <div className="size-2 rounded-full bg-white/10" />
                    <div className="size-2 rounded-full bg-white/10" />
                    <div className="size-2 rounded-full bg-white/10" />
                    <span className="ml-2 text-[10px] text-white/30">
                      Active Sessions
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between rounded-md border border-violet-500/20 bg-violet-500/[0.05] px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-violet-500/10">
                          <span className="text-[9px] font-bold text-white/60">
                            A
                          </span>
                        </div>
                        <span className="text-xs font-medium text-white/70">
                          Admin
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-400">
                          active
                        </span>
                      </div>
                      <Zap className="size-3 text-violet-400" />
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {["Editor", "Viewer"].map((role) => (
                        <div
                          key={role}
                          className="flex cursor-pointer items-center justify-between rounded-md border border-white/[0.04] px-3 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-6 items-center justify-center rounded-full bg-white/[0.05]">
                              <span className="text-[9px] font-bold text-white/40">
                                {role[0]}
                              </span>
                            </div>
                            <span className="text-xs text-white/40">
                              {role}
                            </span>
                          </div>
                          <span className="text-[10px] text-white/20">
                            Switch →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GradientBorderCard>
            </motion.div>

            {/* Card 3: Inspect Session */}
            <motion.div variants={scaleIn}>
              <GradientBorderCard hoverGlow className="h-full p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-white/50">
                  <Eye className="size-3.5 text-cyan-400" />
                  Inspect Session
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/30">
                  Real-time session data viewer. Every token, field, and
                  permission at a glance.
                </p>
                {/* Mini UI Mockup */}
                <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0A0A0C] font-mono text-[11px]">
                  <div className="border-b border-white/[0.06] px-4 py-2.5">
                    <span className="text-[10px] text-white/30">
                      Session Data
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-1 text-white/40">
                      <div>
                        <span className="text-violet-400">{`{`}</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">&quot;user&quot;</span>
                        <span className="text-white/20">: </span>
                        <span className="text-emerald-400">
                          &quot;admin@test.dev&quot;
                        </span>
                        <span className="text-white/20">,</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">&quot;role&quot;</span>
                        <span className="text-white/20">: </span>
                        <span className="text-emerald-400">
                          &quot;admin&quot;
                        </span>
                        <span className="text-white/20">,</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">
                          &quot;permissions&quot;
                        </span>
                        <span className="text-white/20">: </span>
                        <span className="text-amber-400">[</span>
                        <span className="text-emerald-400">
                          &quot;read&quot;, &quot;write&quot;, &quot;delete&quot;
                        </span>
                        <span className="text-amber-400">]</span>
                        <span className="text-white/20">,</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">
                          &quot;expiresAt&quot;
                        </span>
                        <span className="text-white/20">: </span>
                        <span className="text-orange-400">
                          1710547200
                        </span>
                      </div>
                      <div>
                        <span className="text-violet-400">{`}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GradientBorderCard>
            </motion.div>

            {/* Card 4: Patch Session */}
            <motion.div variants={scaleIn}>
              <GradientBorderCard hoverGlow className="h-full p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-white/50">
                  <Settings className="size-3.5 text-emerald-400" />
                  Patch Session
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/30">
                  Edit session fields live. Change roles, permissions, and
                  metadata instantly.
                </p>
                {/* Mini UI Mockup */}
                <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0A0A0C]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                    <span className="text-[10px] text-white/30">
                      Edit Session
                    </span>
                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-400">
                      modified
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <label className="mb-1 block text-[10px] text-white/25">
                        Role
                      </label>
                      <div className="flex gap-1.5">
                        {["admin", "editor", "viewer"].map((role, i) => (
                          <button
                            key={role}
                            className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${
                              i === 1
                                ? "bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-violet-300 ring-1 ring-violet-500/30"
                                : "bg-white/[0.03] text-white/30 hover:bg-white/[0.06]"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] text-white/25">
                        Permissions
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {["read", "write", "delete", "manage"].map(
                          (perm, i) => (
                            <span
                              key={perm}
                              className={`rounded-md px-2 py-0.5 text-[10px] ${
                                i < 2
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-white/[0.03] text-white/25"
                              }`}
                            >
                              {perm}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <button className="w-full rounded-md bg-gradient-to-r from-violet-500/20 to-blue-500/20 py-1.5 text-[10px] font-medium text-violet-300 transition-colors hover:from-violet-500/30 hover:to-blue-500/30">
                      Apply Changes
                    </button>
                  </div>
                </div>
              </GradientBorderCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CODE SECTION ══════════════ */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-widest text-white/30"
            >
              Integration
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 font-[family-name:var(--font-instrument)] text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Setup in <GradientText>minutes</GradientText>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-md text-sm text-white/40"
            >
              Add the plugin to your Better Auth config and you&apos;re ready to
              go.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mt-12"
          >
            <GradientBorderCard className="overflow-hidden">
              {/* Tab Header */}
              <div className="flex border-b border-white/[0.06]">
                {(["server", "client"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative flex items-center gap-2 px-5 py-3 text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? "text-white/80"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    {tab === "server" ? (
                      <Code className="size-3.5" />
                    ) : (
                      <Layers className="size-3.5" />
                    )}
                    {tab === "server" ? "auth.ts" : "auth-client.ts"}
                    {activeTab === tab && (
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />
                    )}
                  </button>
                ))}
                <div className="ml-auto flex items-center pr-3">
                  <CopyButton
                    text={activeTab === "server" ? serverCode : clientCode}
                  />
                </div>
              </div>
              {/* Code Content */}
              <div className="relative">
                {/* Left gradient accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/30 to-transparent" />
                <pre className="overflow-x-auto p-6 pl-8 font-mono text-[13px] leading-6">
                  <code>
                    {(activeTab === "server" ? serverCode : clientCode)
                      .split("\n")
                      .map((line, i) => (
                        <div key={i} className="flex">
                          <span className="mr-6 inline-block w-5 text-right text-white/15 select-none">
                            {i + 1}
                          </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightSyntax(line),
                            }}
                          />
                        </div>
                      ))}
                  </code>
                </pre>
              </div>
            </GradientBorderCard>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="relative z-10 py-24 md:py-32">
        {/* CTA Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[300px] w-[500px] rounded-full bg-gradient-to-b from-violet-500/[0.05] to-blue-500/[0.03] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp}>
              <Sparkles className="mb-4 size-6 text-violet-400/60" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-[family-name:var(--font-instrument)] text-3xl font-semibold tracking-tight md:text-5xl"
            >
              Stop wasting time on{" "}
              <GradientText>auth testing</GradientText>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-md text-sm leading-relaxed text-white/40"
            >
              Install the plugin, define your templates, and get back to
              building what matters.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                <button className="group inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 px-6 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_32px_-4px_rgba(139,92,246,0.4)]">
                  Get Started
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <div className="inline-flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-sm">
                <Terminal className="size-4 text-white/30" />
                <span className="text-white/50">npm install</span>{" "}
                <span className="text-white/80">better-auth-devtools</span>
                <CopyButton text="npm install better-auth-devtools" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>Better Auth DevTools</span>
            <span className="text-white/10">|</span>
            <span>MIT License</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/C-W-D-Harshit/better-auth-devtools"
              target="_blank"
              className="text-xs text-white/25 transition-colors hover:text-white/50"
            >
              GitHub
            </Link>
            <Link
              href="https://www.npmjs.com/package/better-auth-devtools"
              target="_blank"
              className="text-xs text-white/25 transition-colors hover:text-white/50"
            >
              npm
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════ SYNTAX HIGHLIGHTING ═══════════════════ */

function highlightSyntax(line: string): string {
  if (!line.trim()) return "&nbsp;";

  let result = line
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Strings
  result = result.replace(
    /(&quot;|"|')((?:(?!\1).)*)\1/g,
    '<span class="text-emerald-400">$1$2$1</span>'
  );

  // Comments
  result = result.replace(
    /(\/\/.*)/g,
    '<span class="text-white/20">$1</span>'
  );

  // Keywords
  const keywords =
    /\b(import|from|export|const|let|var|function|return|if|else|new|type|interface|async|await)\b/g;
  result = result.replace(
    keywords,
    '<span class="text-violet-400">$1</span>'
  );

  // Brackets, braces, parens
  result = result.replace(
    /([{}[\]()])/g,
    '<span class="text-white/30">$1</span>'
  );

  return result;
}
