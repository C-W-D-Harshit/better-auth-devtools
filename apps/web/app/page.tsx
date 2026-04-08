"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { Bebas_Neue, Work_Sans } from "next/font/google"
import {
  Users,
  ArrowRightLeft,
  Eye,
  Pencil,
  ShieldCheck,
  Lock,
  Terminal,
  Copy,
  Check,
  Github,
  Diamond,
  Hexagon,
  Triangle,
  ChevronRight,
} from "lucide-react"

import { Spotlight } from "@/components/ui/spotlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Timeline } from "@/components/ui/timeline"
import { Button as MovingBorderButton } from "@/components/ui/moving-border"
import { FloatingNav } from "@/components/ui/floating-navbar"
import DecryptedText from "@/components/ui/decrypted-text"

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
})

// ─── Geometric decorative components ────────────────────────────────

function DiamondBullet({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-2 w-2 rotate-45 bg-[#F59E0B] ${className}`}
    />
  )
}

function GeometricSeparator() {
  return (
    <div className="flex items-center justify-center gap-4 py-12">
      <div className="h-px flex-1 bg-white/[0.06]" />
      <DiamondBullet />
      <div className="h-[2px] w-8 bg-[#F59E0B]" />
      <DiamondBullet />
      <div className="h-px flex-1 bg-white/[0.06]" />
    </div>
  )
}

function SkewedDivider() {
  return (
    <div className="relative h-20 w-full overflow-hidden">
      <div className="absolute inset-0 -skew-y-2 bg-[#0D1117]" />
      <div className="absolute inset-0 -skew-y-2 border-b-2 border-white/[0.04]" />
    </div>
  )
}

// ─── Feature header patterns ─────────────────────────────────────────

function FeatureHeaderPattern({
  color,
  index,
}: {
  color: string
  index: number
}) {
  const patterns = [
    // Diagonal lines
    <div key="p1" className="relative h-full w-full overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-px origin-left rotate-45"
          style={{
            top: `${i * 14}%`,
            left: 0,
            right: 0,
            backgroundColor: color,
            opacity: 0.15,
          }}
        />
      ))}
      <div
        className="absolute right-0 bottom-0 h-16 w-16 opacity-10"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>,
    // Grid dots
    <div key="p2" className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />
    </div>,
    // Corner accent
    <div key="p3" className="relative h-full w-full overflow-hidden">
      <div
        className="absolute -top-4 -right-4 h-20 w-20 rotate-45 border-2 opacity-10"
        style={{ borderColor: color }}
      />
      <div
        className="absolute -bottom-2 -left-2 h-12 w-12 rotate-45 border-2 opacity-10"
        style={{ borderColor: color }}
      />
    </div>,
    // Horizontal bars
    <div key="p4" className="relative h-full w-full overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-[2px]"
          style={{
            top: `${20 + i * 15}%`,
            left: "10%",
            width: `${30 + i * 10}%`,
            backgroundColor: color,
            opacity: 0.08 + i * 0.03,
          }}
        />
      ))}
    </div>,
    // Concentric squares
    <div key="p5" className="relative h-full w-full overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute border opacity-10"
          style={{
            borderColor: color,
            top: `${20 + i * 10}%`,
            right: `${10 + i * 10}%`,
            width: `${40 - i * 10}px`,
            height: `${40 - i * 10}px`,
          }}
        />
      ))}
    </div>,
    // Cross pattern
    <div key="p6" className="relative h-full w-full overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 h-px w-full -translate-x-1/2 opacity-10"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-full w-px -translate-y-1/2 opacity-10"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute top-4 right-4 h-3 w-3 rotate-45 opacity-20"
        style={{ backgroundColor: color }}
      />
    </div>,
  ]
  return patterns[index % patterns.length]
}

// ─── Copy button hook ────────────────────────────────────────────────

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return { copied, copy }
}

// ─── Nav items ───────────────────────────────────────────────────────

const navItems = [
  {
    name: "Features",
    link: "#features",
    icon: <Diamond className="h-4 w-4" />,
  },
  {
    name: "How it Works",
    link: "#how-it-works",
    icon: <Triangle className="h-4 w-4" />,
  },
  { name: "Code", link: "#code", icon: <Terminal className="h-4 w-4" /> },
  {
    name: "GitHub",
    link: "https://github.com/C-W-D-Harshit/better-auth-devtools",
    icon: <Github className="h-4 w-4" />,
    target: "_blank",
  },
]

// ─── Features data ───────────────────────────────────────────────────

const installCommand = "pnpm add better-auth-devtools"

const devtoolsSetupSnippet = `import {
  createDevtoolsIntegration,
  defineDevtoolsConfig,
} from "better-auth-devtools/plugin";

export const devtools = createDevtoolsIntegration(defineDevtoolsConfig({
  templates: {
    admin: { label: "Admin", meta: { role: "admin" } },
    editor: { label: "Editor", meta: { role: "editor" } },
    viewer: { label: "Viewer", meta: { role: "viewer" } },
  },
  editableFields: [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: ["admin", "editor", "viewer"],
    },
  ],
  async createManagedUser(args) {
    // Create a real user in your app database and return the real ID.
    const user = await db.user.create({
      data: {
        email: args.email,
        name: args.template.label,
        role: String(args.template.meta?.role ?? "viewer"),
      },
    });

    return {
      userId: user.id,
      email: user.email,
      label: args.template.label,
    };
  },
  async getSessionView(args) {
    const user = await db.user.findUnique({ where: { id: args.userId } });

    return {
      userId: args.userId,
      email: user?.email,
      label: user?.name,
      fields: {
        sessionId: args.sessionId,
        role: user?.role ?? "viewer",
      },
      editableFields: ["role"],
    };
  },
  async patchSession(args) {
    await db.user.update({
      where: { id: args.userId },
      data: { role: String(args.patch.role ?? "viewer") },
    });

    return {
      userId: args.userId,
      fields: {
        sessionId: args.sessionId,
        role: String(args.patch.role ?? "viewer"),
      },
      editableFields: ["role"],
    };
  },
}), {
  position: "bottom-right",
  triggerLabel: "Auth DevTools",
});`

const serverSetupSnippet = `import { betterAuth } from "better-auth";
import { devtools } from "./devtools";

export const auth = betterAuth({
  database,
  plugins: [devtools.serverPlugin],
});`

const clientSetupSnippet = `"use client";

import { createAuthClient } from "better-auth/react";
import { BetterAuthDevtools } from "better-auth-devtools/react";
import type { BetterAuthDevtoolsProps } from "better-auth-devtools/react";
import { devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});

export function DevtoolsWrapper({
  panelProps,
}: {
  panelProps: BetterAuthDevtoolsProps;
}) {
  return <BetterAuthDevtools {...panelProps} />;
}`

const features = [
  {
    num: "01",
    title: "Managed Test Users",
    description:
      "Create managed test users from the templates you define. Keep real accounts out of your everyday auth checks.",
    icon: <Users className="h-5 w-5 text-[#F59E0B]" />,
    color: "#F59E0B",
  },
  {
    num: "02",
    title: "Instant Session Switching",
    description:
      "Switch into a managed test user in one click and reload the app against the new Better Auth session.",
    icon: <ArrowRightLeft className="h-5 w-5 text-[#3B82F6]" />,
    color: "#3B82F6",
  },
  {
    num: "03",
    title: "Session Inspection",
    description:
      "Inspect the current session view your app exposes, including user fields and any approved metadata.",
    icon: <Eye className="h-5 w-5 text-[#10B981]" />,
    color: "#10B981",
  },
  {
    num: "04",
    title: "Session Patching",
    description:
      "Patch only the fields you explicitly allow, then refresh the app with the updated auth state.",
    icon: <Pencil className="h-5 w-5 text-[#F59E0B]" />,
    color: "#F59E0B",
  },
  {
    num: "05",
    title: "Repeatable Auth Scenarios",
    description:
      "Define stable personas like Admin, Editor, and Viewer so auth-gated UI is easy to verify and easy to repeat.",
    icon: <ShieldCheck className="h-5 w-5 text-[#3B82F6]" />,
    color: "#3B82F6",
  },
  {
    num: "06",
    title: "Dev-Only Safety",
    description:
      "Runs only when DEV_AUTH_ENABLED=true outside production. Keep it explicit, local, and easy to disable.",
    icon: <Lock className="h-5 w-5 text-[#10B981]" />,
    color: "#10B981",
  },
]

// ─── Timeline data ──────────────────────────────────────────────────

const timelineData = [
  {
    title: "Install",
    content: (
      <div>
        <p
          className="mb-4 text-sm text-neutral-400"
          style={{ fontFamily: "var(--font-work)" }}
        >
          Install the package from npm.
        </p>
        <div className="overflow-hidden border-2 border-white/[0.06] bg-[#0D1117]">
          <div className="flex items-center gap-2 border-b-2 border-white/[0.06] bg-[#161B22] px-3 py-2 sm:px-4">
            <div className="h-2 w-2 rotate-45 bg-[#F59E0B]" />
            <span className="font-mono text-xs text-neutral-500">terminal</span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-xs text-white sm:p-4 sm:text-sm">{`$ ${installCommand}`}</pre>
        </div>
      </div>
    ),
  },
  {
    title: "Configure",
    content: (
      <div>
        <p
          className="mb-4 text-sm text-neutral-400"
          style={{ fontFamily: "var(--font-work)" }}
        >
          Define your templates and host-app callbacks, then connect them to
          your real user model. In Next.js App Router, keep database-backed
          devtools code on the server and pass panel props into a client
          wrapper.
        </p>
        <div className="overflow-hidden border-2 border-white/[0.06] bg-[#0D1117]">
          <div className="flex items-center gap-2 border-b-2 border-white/[0.06] bg-[#161B22] px-3 py-2 sm:px-4">
            <div className="h-2 w-2 rotate-45 bg-[#3B82F6]" />
            <span className="font-mono text-xs text-neutral-500">
              devtools.ts
            </span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-[10px] leading-relaxed text-white sm:p-4 sm:text-sm">
            {devtoolsSetupSnippet}
          </pre>
        </div>
      </div>
    ),
  },
  {
    title: "Develop",
    content: (
      <div>
        <p
          className="mb-4 text-sm text-neutral-400"
          style={{ fontFamily: "var(--font-work)" }}
        >
          Run your app with{" "}
          <code className="font-mono text-xs">DEV_AUTH_ENABLED=true</code> in
          development. Create managed test users, switch sessions, inspect the
          current session, and patch approved fields from the panel. If you use
          Prisma or another ORM, make sure the plugin storage model exists
          before testing the panel.
        </p>
        <div className="grid gap-2 sm:gap-3 sm:grid-cols-3">
          {[
            "Create Test Users",
            "Switch Sessions",
            "Patch Approved Fields",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 border-2 border-white/[0.06] bg-[#161B22] p-3"
            >
              <div className="h-2 w-2 rotate-45 bg-[#10B981]" />
              <span className="text-xs text-neutral-300">{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

// ─── Main Page Component ─────────────────────────────────────────────

export default function Page() {
  const { copied: npmCopied, copy: copyNpm } = useCopyToClipboard()
  const { copied: ctaCopied, copy: copyCta } = useCopyToClipboard()

  return (
    <div
      className={`${bebasNeue.variable} ${workSans.variable} min-h-screen overflow-x-hidden bg-[#0D1117] text-white`}
      style={{ fontFamily: "var(--font-work)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ─── HERO SECTION ────────────────────────────────────────── */}
        <section className="relative flex min-h-dvh flex-col justify-center py-12 md:min-h-screen md:pt-32 md:pb-24">
          {/* Spotlight */}
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="#F59E0B"
          />

          {/* Geometric decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Hexagon className="absolute top-20 right-10 h-40 w-40 text-[#F59E0B] opacity-[0.03]" />
            <Triangle className="absolute bottom-40 left-10 h-32 w-32 text-[#3B82F6] opacity-[0.03]" />
            <Diamond className="absolute top-1/2 right-1/4 h-24 w-24 text-[#10B981] opacity-[0.03]" />
            {/* Geometric grid lines */}
            <div className="absolute top-0 left-1/4 h-full w-px bg-white/[0.02]" />
            <div className="absolute top-0 left-2/4 h-full w-px bg-white/[0.02]" />
            <div className="absolute top-0 left-3/4 h-full w-px bg-white/[0.02]" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 border-2 border-white/[0.06] bg-[#161B22] px-4 py-2 sm:mb-8"
            >
              <div className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
              <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
                Alpha Release
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              <span className="block text-6xl leading-none tracking-wider text-white sm:text-8xl md:text-9xl lg:text-[10rem]">
                BETTER AUTH
              </span>
              <span className="block text-6xl leading-none tracking-wider text-[#F59E0B] sm:text-8xl md:text-9xl lg:text-[10rem]">
                DEVTOOLS
              </span>
            </motion.h1>

            {/* Subtitle with TextGenerateEffect */}
            <div className="mx-auto max-w-2xl px-2 sm:px-0">
              <TextGenerateEffect
                words="Unofficial, development-only tooling for Better Auth. Create managed test users, switch sessions instantly, inspect current session state, and patch approved fields from a React panel."
                className="!text-sm !leading-relaxed !font-normal !text-neutral-400 sm:!text-base md:!text-lg [&_div]:!text-sm [&_div]:!text-neutral-400 sm:[&_div]:!text-base md:[&_div]:!text-lg [&_span]:!text-neutral-400"
                duration={0.4}
              />
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:gap-4 sm:justify-center"
            >
              <Link
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                className="w-full sm:w-auto"
              >
                <MovingBorderButton
                  borderRadius="0px"
                  containerClassName="h-12 w-full sm:h-14 sm:w-52"
                  borderClassName="h-20 w-20 bg-[radial-gradient(#F59E0B_40%,transparent_60%)] opacity-[0.8]"
                  className="border-2 border-[#F59E0B]/20 bg-[#0D1117] text-sm font-semibold tracking-wider text-white uppercase"
                >
                  <span className="flex items-center gap-2">
                    View on GitHub
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </MovingBorderButton>
              </Link>

              <button
                onClick={() => copyNpm(installCommand)}
                className="group flex h-12 w-full items-center justify-between gap-2 border-2 border-white/[0.06] bg-[#161B22] px-4 transition-colors hover:border-white/[0.12] sm:h-14 sm:w-auto sm:justify-center sm:gap-3 sm:px-6"
              >
                <Terminal className="h-4 w-4 shrink-0 text-[#10B981]" />
                <code className="font-mono text-xs text-neutral-300 sm:text-sm">
                  {installCommand}
                </code>
                {npmCopied ? (
                  <Check className="h-4 w-4 text-[#10B981]" />
                ) : (
                  <Copy className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-white" />
                )}
              </button>
            </motion.div>
          </div>
        </section>

        <GeometricSeparator />

        {/* ─── FEATURES SECTION ────────────────────────────────────── */}
        <section
          id="features"
          className="scroll-mt-24 px-2 py-12 md:px-0 md:py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#F59E0B]" />
              <span className="font-mono text-xs tracking-widest text-[#F59E0B] uppercase">
                Features
              </span>
              <div className="h-px w-12 bg-[#F59E0B]" />
            </div>
            <h2
              className="text-4xl tracking-wider text-white md:text-6xl"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              BUILT FOR AUTH TESTING
            </h2>
          </motion.div>

          <BentoGrid className="gap-3 md:gap-0 md:auto-rows-[22rem] md:grid-cols-3">
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                className={`rounded-none border-2 border-white/[0.06] bg-[#161B22] p-0 shadow-none transition-colors hover:border-white/[0.1] hover:bg-[#1C2129] hover:shadow-none dark:border-white/[0.06] dark:bg-[#161B22] dark:shadow-none ${
                  i === 0 || i === 3 ? "md:col-span-2" : ""
                }`}
                header={
                  <div className="relative h-full min-h-[6rem] bg-[#0D1117]">
                    <FeatureHeaderPattern color={feature.color} index={i} />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <span
                        className="text-4xl tracking-wider opacity-20"
                        style={{
                          fontFamily: "var(--font-bebas)",
                          color: feature.color,
                        }}
                      >
                        {feature.num}
                      </span>
                    </div>
                  </div>
                }
                icon={
                  <div className="flex items-center gap-3 px-4 pt-2">
                    <div className="flex h-8 w-8 items-center justify-center border-2 border-white/[0.06] bg-[#0D1117]">
                      {feature.icon}
                    </div>
                  </div>
                }
                title={
                  <div className="px-4">
                    <DecryptedText
                      text={feature.title}
                      animateOn="view"
                      speed={40}
                      maxIterations={8}
                      sequential
                      className="text-sm font-semibold text-white"
                      encryptedClassName="text-sm font-semibold text-neutral-600"
                      parentClassName="text-sm font-semibold"
                    />
                  </div>
                }
                description={
                  <p className="px-4 pb-4 text-xs leading-relaxed text-neutral-500">
                    {feature.description}
                  </p>
                }
              />
            ))}
          </BentoGrid>
        </section>

        <GeometricSeparator />

        {/* ─── HOW IT WORKS (Timeline) ─────────────────────────────── */}
        <section id="how-it-works" className="scroll-mt-24 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#3B82F6]" />
              <span className="font-mono text-xs tracking-widest text-[#3B82F6] uppercase">
                Quick Start
              </span>
              <div className="h-px w-12 bg-[#3B82F6]" />
            </div>
            <h2
              className="text-4xl tracking-wider text-white md:text-6xl"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              SET IT UP FAST
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
              Define templates once, but keep DB-backed devtools config on the
              server. The panel stays client-safe by receiving serializable
              props from your layout.
            </p>
          </motion.div>

          {/* Timeline wrapper with style overrides */}
          <div className="[&_.bg-white]:!bg-[#0D1117] [&_.dark\:bg-black]:!bg-[#0D1117] [&_.dark\:bg-neutral-800]:!bg-[#F59E0B] [&_.dark\:bg-neutral-950]:!bg-[#0D1117] [&_.dark\:border-neutral-700]:!border-[#F59E0B] [&_.dark\:text-neutral-500]:!text-[#F59E0B] [&_.dark\:via-neutral-700]:!via-[#F59E0B]/20 [&_.from-purple-500]:!from-[#F59E0B] [&_.via-blue-500]:!via-[#F59E0B]/50 [&_h2]:!hidden [&_h2+p]:!hidden">
            <Timeline data={timelineData} />
          </div>
        </section>

        <GeometricSeparator />

        {/* ─── CODE SECTION ────────────────────────────────────────── */}
        <section id="code" className="scroll-mt-24 px-2 py-12 md:px-0 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#10B981]" />
              <span className="font-mono text-xs tracking-widest text-[#10B981] uppercase">
                Integration
              </span>
              <div className="h-px w-12 bg-[#10B981]" />
            </div>
            <h2
              className="text-4xl tracking-wider text-white md:text-6xl"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              WIRE IT INTO BETTER AUTH
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
              Use the server plugin from your Better Auth config, use{" "}
              <code className="font-mono text-xs">devtoolsClientPlugin()</code>{" "}
              in the auth client, and pass panel props into a client wrapper in
              Next.js App Router.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Server Setup */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-0 overflow-hidden border-2 border-white/[0.06] bg-[#0D1117]"
            >
              <div className="flex items-center justify-between border-b-2 border-white/[0.06] bg-[#161B22] px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rotate-45 bg-[#F59E0B]" />
                  <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
                    Server Setup
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-600">
                  auth.ts
                </span>
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-white sm:p-5 sm:text-[13px]">
                {serverSetupSnippet}
              </pre>
            </motion.div>

            {/* Client Setup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-0 overflow-hidden border-2 border-white/[0.06] bg-[#0D1117]"
            >
              <div className="flex items-center justify-between border-b-2 border-white/[0.06] bg-[#161B22] px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rotate-45 bg-[#3B82F6]" />
                  <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
                    Client Setup
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-600">
                  client.tsx
                </span>
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-white sm:p-5 sm:text-[13px]">
                {clientSetupSnippet}
              </pre>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-6 border-2 border-white/[0.06] bg-[#161B22] p-4"
          >
            <p className="text-sm leading-relaxed text-neutral-300">
              <span className="font-semibold text-white">
                createManagedUser
              </span>{" "}
              must create a real user in your app database.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              The plugin provides its own Better Auth schema. After adding it,
              rerun <code className="font-mono text-xs">npx auth@latest migrate</code>{" "}
              for built-in adapters, or{" "}
              <code className="font-mono text-xs">npx auth@latest generate</code>{" "}
              before your Prisma or Drizzle migration flow.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              In Next.js App Router, pass <code className="font-mono text-xs">panelProps</code>{" "}
              from a server layout into a client wrapper instead of importing a
              DB-backed devtools module directly into the client.
            </p>
          </motion.div>
        </section>

        <SkewedDivider />

        {/* ─── CTA SECTION ─────────────────────────────────────────── */}
        <section className="relative px-2 py-20 md:px-0 md:py-32">
          {/* Background decorative */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
            <Hexagon className="absolute -right-10 -bottom-10 h-60 w-60 text-[#F59E0B] opacity-[0.02]" />
            <Triangle className="absolute -top-10 -left-10 h-40 w-40 text-[#3B82F6] opacity-[0.02]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border border-white/[0.06] bg-[#161B22]/70 px-4 py-10 backdrop-blur-sm sm:px-6 sm:py-12 md:px-12 md:py-14"
            >
              <div className="mb-5 flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-[#F59E0B]" />
                <span className="font-mono text-[11px] tracking-[0.28em] text-[#F59E0B] uppercase">
                  Start Testing
                </span>
                <div className="h-px w-10 bg-[#F59E0B]" />
              </div>

              <h2
                className="mx-auto mb-5 max-w-3xl text-center text-3xl leading-tight tracking-wider text-balance text-white sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                READY TO TRY IT?
              </h2>

              <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-neutral-400 md:text-base">
                Install the package, wire it into Better Auth, and use managed
                test users for repeatable auth checks during development.
              </p>

              <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 md:flex-row md:items-stretch">
                <button
                  onClick={() => copyCta(installCommand)}
                  className="group flex w-full items-center justify-between gap-3 border-2 border-white/[0.06] bg-[#0D1117] px-4 py-3 transition-colors hover:border-white/[0.12] sm:gap-4 sm:px-6 sm:py-4 md:max-w-[30rem]"
                >
                  <span className="shrink-0 text-[#10B981]">$</span>
                  <code className="min-w-0 flex-1 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap text-neutral-300 sm:text-sm">
                    {installCommand}
                  </code>
                  {ctaCopied ? (
                    <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4 shrink-0 text-neutral-600 transition-colors group-hover:text-white" />
                  )}
                </button>

                <Link
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                  className="w-full md:w-auto"
                >
                  <MovingBorderButton
                    borderRadius="0px"
                    containerClassName="h-14 w-full sm:h-16 md:w-64"
                    borderClassName="h-20 w-20 bg-[radial-gradient(#F59E0B_40%,transparent_60%)] opacity-[0.8]"
                    className="border-2 border-[#F59E0B]/20 bg-[#0D1117] text-sm font-bold tracking-widest text-white uppercase sm:text-base"
                  >
                    <span className="flex items-center gap-2">
                      View on GitHub
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                  </MovingBorderButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── FOOTER ──────────────────────────────────────────────── */}
        <footer className="border-t-2 border-white/[0.06] px-2 py-10 md:px-0">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <span
                className="text-xl tracking-wider"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                <span className="text-white">BETTER AUTH </span>
                <span className="text-[#F59E0B]">DEVTOOLS</span>
              </span>

              <p className="text-xs text-neutral-500">
                made with{" "}
                <span className="text-red-500">&hearts;</span> by{" "}
                <Link
                  href="https://x.com/cwd_harshit"
                  target="_blank"
                  className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#F59E0B] hover:decoration-[#F59E0B]/50"
                >
                  Harshit
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
