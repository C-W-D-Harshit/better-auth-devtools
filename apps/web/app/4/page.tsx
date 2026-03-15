"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Heart,
  Sparkles,
  Users,
  Shield,
  Eye,
  Settings,
  Wand2,
  Smile,
  ArrowRight,
  Github,
  Check,
  X,
  Zap,
  MousePointerClick,
  Lock,
  RefreshCw,
} from "lucide-react";
import { DM_Serif_Display, Nunito } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

// ─── Animated Blob ──────────────────────────────────────────────────────────
function Blob({
  className,
  color,
  size = 300,
  delay = 0,
}: {
  className?: string;
  color: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-[60%_40%_50%_70%/40%_50%_60%_50%] opacity-40 blur-3xl ${className}`}
      style={{
        background: color,
        width: size,
        height: size,
      }}
      animate={{
        borderRadius: [
          "60% 40% 50% 70% / 40% 50% 60% 50%",
          "40% 60% 70% 30% / 50% 40% 50% 60%",
          "50% 50% 40% 60% / 60% 40% 70% 30%",
          "60% 40% 50% 70% / 40% 50% 60% 50%",
        ],
        y: [0, -20, 10, 0],
        x: [0, 10, -10, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── Wavy Divider ───────────────────────────────────────────────────────────
function WavyDivider({ flip = false, color = "#FFF5EE" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-[60px] w-full"
      >
        <path
          d="M0,40 C150,80 350,0 500,40 C650,80 800,10 1000,50 C1100,70 1150,30 1200,40 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

// ─── Glass Card ─────────────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className={`rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-black/[0.04] backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Feature cards data ─────────────────────────────────────────────────────
const features = [
  {
    icon: Users,
    emoji: "👥",
    title: "Managed Test Users",
    description:
      "Create disposable test users from pre-defined templates — Admin, Editor, Viewer — in one click.",
    color: "bg-[#FF8A80]/15",
    iconColor: "text-[#FF8A80]",
    borderColor: "border-[#FF8A80]/20",
  },
  {
    icon: MousePointerClick,
    emoji: "⚡",
    title: "Instant Session Switching",
    description:
      "Switch between test users with a single click. No credentials, no forms, no friction.",
    color: "bg-[#FFB74D]/15",
    iconColor: "text-[#FFB74D]",
    borderColor: "border-[#FFB74D]/20",
  },
  {
    icon: Eye,
    emoji: "👁️",
    title: "Session Inspection",
    description: "View all current session data in real-time. Always know exactly what state you're in.",
    color: "bg-[#B39DDB]/15",
    iconColor: "text-[#B39DDB]",
    borderColor: "border-[#B39DDB]/20",
  },
  {
    icon: Wand2,
    emoji: "✨",
    title: "Session Patching",
    description:
      "Edit approved session fields like role and permissions on-the-fly. No page reloads needed.",
    color: "bg-[#81C784]/15",
    iconColor: "text-[#81C784]",
    borderColor: "border-[#81C784]/20",
  },
  {
    icon: Shield,
    emoji: "🛡️",
    title: "Role-Based Testing",
    description:
      "Multiple user templates with different roles and permissions. Test every access level effortlessly.",
    color: "bg-[#F48FB1]/15",
    iconColor: "text-[#F48FB1]",
    borderColor: "border-[#F48FB1]/20",
  },
  {
    icon: Lock,
    emoji: "🔒",
    title: "Development-Only Safety",
    description:
      "Only works when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk in production.",
    color: "bg-[#FFB74D]/15",
    iconColor: "text-[#FFB74D]",
    borderColor: "border-[#FFB74D]/20",
  },
];

// ─── Steps data ─────────────────────────────────────────────────────────────
const steps = [
  {
    emoji: "📦",
    icon: Settings,
    title: "Install the plugin",
    description: "Add better-auth-devtools to your project with npm, pnpm, or yarn.",
    color: "#FF8A80",
  },
  {
    emoji: "🔧",
    icon: Wand2,
    title: "Add to your auth config",
    description: "Register the plugin in your Better Auth configuration. Define your test user templates.",
    color: "#B39DDB",
  },
  {
    emoji: "🎉",
    icon: Sparkles,
    title: "Start testing!",
    description:
      "Open the DevTools panel, create test users, switch sessions, and test with joy.",
    color: "#81C784",
  },
];

// ─── Comparison data ────────────────────────────────────────────────────────
const comparisons = [
  {
    before: "Manually create test users in the database",
    after: "One-click test user creation from templates",
  },
  {
    before: "Log out and log in with different credentials",
    after: "Instant session switching, no credentials needed",
  },
  {
    before: "console.log(session) everywhere",
    after: "Real-time session inspection panel",
  },
  {
    before: "Change roles via database queries",
    after: "Patch session roles on-the-fly in the UI",
  },
  {
    before: "Forget to clean up test data",
    after: "Disposable users, automatic cleanup",
  },
];

// ─── Code example ───────────────────────────────────────────────────────────
const codeExample = `import { betterAuth } from "better-auth";
import { devTools } from "better-auth-devtools";

export const auth = betterAuth({
  plugins: [
    devTools({
      users: [
        {
          name: "Admin User",
          email: "admin@test.com",
          role: "admin",
        },
        {
          name: "Editor",
          email: "editor@test.com",
          role: "editor",
        },
        {
          name: "Viewer",
          email: "viewer@test.com",
          role: "viewer",
        },
      ],
    }),
  ],
});`;

// ─── Syntax Highlight (Pastel) ──────────────────────────────────────────────
function PastelCode({ code }: { code: string }) {
  const keywords = ["import", "from", "export", "const"];
  const lines = code.split("\n");

  function highlightLine(line: string) {
    let result = line;

    // strings
    result = result.replace(
      /(["'`])(.*?)\1/g,
      '<span style="color:#81C784">$1$2$1</span>'
    );

    // keywords
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, "g");
      result = result.replace(
        regex,
        `<span style="color:#B39DDB;font-weight:600">$1</span>`
      );
    });

    // braces/brackets
    result = result.replace(
      /([{}[\]()])/g,
      '<span style="color:#FFB74D">$1</span>'
    );

    // comments
    result = result.replace(
      /(\/\/.*)/g,
      '<span style="color:#aaa;font-style:italic">$1</span>'
    );

    return result;
  }

  return (
    <pre className="overflow-x-auto rounded-3xl bg-[#2D2235]/90 p-6 text-sm leading-relaxed text-[#F0E6FF]/90 shadow-2xl shadow-[#B39DDB]/10 backdrop-blur-sm">
      <code>
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 inline-block w-6 select-none text-right text-[#B39DDB]/30">
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: highlightLine(line) }} />
          </div>
        ))}
      </code>
    </pre>
  );
}

// ─── Grain Overlay ──────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Page() {
  return (
    <div
      className={`${dmSerif.variable} ${nunito.variable} relative min-h-screen overflow-hidden`}
      style={{ fontFamily: "var(--font-nunito), sans-serif" }}
    >
      <GrainOverlay />

      {/* ─── Background gradient ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #FFF5EE 0%, #F8F0FF 30%, #F0E6FF 55%, #EDF8FF 75%, #E8FFF5 100%)",
        }}
      />

      {/* ─── Floating blobs ──────────────────────────────────────────── */}
      <Blob color="#FF8A80" size={400} className="top-[-100px] left-[-100px]" delay={0} />
      <Blob color="#B39DDB" size={350} className="top-[200px] right-[-80px]" delay={2} />
      <Blob color="#81C784" size={300} className="bottom-[-80px] left-[30%]" delay={4} />
      <Blob color="#FFB74D" size={280} className="top-[60%] left-[-60px]" delay={6} />
      <Blob color="#F48FB1" size={320} className="top-[30%] right-[20%]" delay={3} />

      {/* ─── Nav ─────────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-gray-600 backdrop-blur-md transition-all hover:bg-white/70 hover:text-gray-900"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          <ArrowRight className="size-4 rotate-180" />
          View All Variations
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/C-W-D-Harshit/better-auth-devtools"
            target="_blank"
            className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-gray-600 backdrop-blur-md transition-all hover:bg-white/70 hover:text-gray-900"
          >
            <Github className="size-4" />
            GitHub
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-16 pb-24 text-center md:pt-28 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 rounded-full border-[#B39DDB]/30 bg-[#B39DDB]/10 px-4 py-1.5 text-sm text-[#7E57C2]">
            <Sparkles className="mr-1 size-3.5" />
            Open-source Better Auth Plugin
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 80 }}
          className="max-w-4xl text-5xl leading-tight text-gray-800 md:text-7xl md:leading-tight"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Auth testing should feel{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#FF8A80] via-[#B39DDB] to-[#81C784] bg-clip-text text-transparent">
              delightful
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 h-3 w-full rounded-full bg-[#FFB74D]/25"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ originX: 0 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 md:text-xl"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          A dev-only DevTools panel for Better Auth. Create test users, switch sessions instantly,
          inspect and patch session data — all without leaving your app. 🌸
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
            <Button className="h-12 rounded-full bg-gradient-to-r from-[#FF8A80] to-[#B39DDB] px-8 text-base font-semibold text-white shadow-lg shadow-[#FF8A80]/20 transition-all hover:shadow-xl hover:shadow-[#FF8A80]/30">
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
            <Button
              variant="outline"
              className="h-12 rounded-full border-gray-200 bg-white/60 px-8 text-base font-semibold backdrop-blur-md"
            >
              <Github className="mr-2 size-4" />
              View on GitHub
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex items-center gap-2 text-sm text-gray-400"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          <code className="rounded-full bg-white/60 px-3 py-1 font-mono text-xs text-gray-500 backdrop-blur-sm">
            npm install better-auth-devtools
          </code>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-32 left-[10%] text-3xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🧪
        </motion.div>
        <motion.div
          className="absolute top-48 right-[12%] text-2xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🔐
        </motion.div>
        <motion.div
          className="absolute bottom-24 left-[15%] text-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          ✨
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* WHY YOU'LL LOVE IT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <WavyDivider color="#ffffff20" />
      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-3 block text-3xl">💛</span>
            <h2
              className="text-4xl text-gray-800 md:text-5xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Why you&apos;ll love it
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              Everything you need to test authentication flows without the headache.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <GlassCard key={feature.title} delay={i * 0.1} className={`border-${feature.borderColor}`}>
                <div className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${feature.color}`}>
                  <feature.icon className={`size-7 ${feature.iconColor}`} />
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <h3
                    className="text-xl text-gray-800"
                    style={{ fontFamily: "var(--font-dm-serif)" }}
                  >
                    {feature.title}
                  </h3>
                  <span className="text-lg">{feature.emoji}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <WavyDivider color="#F0E6FF30" />
      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <Blob color="#B39DDB" size={250} className="top-[10%] right-[5%]" delay={1} />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-3 block text-3xl">🪄</span>
            <h2
              className="text-4xl text-gray-800 md:text-5xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Three simple steps
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              Up and running in under two minutes. Seriously.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="mb-4 flex size-20 items-center justify-center rounded-full shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                    boxShadow: `0 8px 32px ${step.color}20`,
                  }}
                >
                  <span className="text-4xl">{step.emoji}</span>
                </div>
                <div
                  className="mb-2 flex size-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </div>
                <h3
                  className="mb-2 text-xl text-gray-800"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CODE EXAMPLE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <WavyDivider color="#ffffff20" />
      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <span className="mb-3 block text-3xl">🍰</span>
            <h2
              className="text-4xl text-gray-800 md:text-5xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              A piece of cake
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              Just add the plugin to your Better Auth config. That&apos;s it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          >
            <div className="relative">
              <div className="absolute -top-3 left-6">
                <Badge className="rounded-full border-[#81C784]/30 bg-[#81C784]/15 px-3 py-1 text-xs text-[#4CAF50]">
                  auth.ts
                </Badge>
              </div>
              <PastelCode code={codeExample} />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-center text-sm text-gray-400"
          >
            Works as a standard Better Auth plugin — no extra configuration needed 🎀
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BEFORE / AFTER COMPARISON */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <WavyDivider color="#F0E6FF20" />
      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <Blob color="#FF8A80" size={220} className="bottom-[10%] left-[5%]" delay={2} />
        <Blob color="#81C784" size={200} className="top-[20%] right-[8%]" delay={4} />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-3 block text-3xl">🌈</span>
            <h2
              className="text-4xl text-gray-800 md:text-5xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              The difference is night & day
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              See how DevTools transforms your auth testing workflow.
            </p>
          </motion.div>

          <div className="grid gap-0 overflow-hidden rounded-3xl border border-white/40 bg-white/40 shadow-xl shadow-black/[0.04] backdrop-blur-xl md:grid-cols-2">
            {/* Before column */}
            <div className="border-b border-white/40 p-8 md:border-r md:border-b-0">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#FF8A80]/15">
                  <X className="size-5 text-[#FF8A80]" />
                </div>
                <h3
                  className="text-xl text-gray-700"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Before DevTools 😩
                </h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <X className="mt-0.5 size-4 shrink-0 text-[#FF8A80]" />
                    <span className="text-sm leading-relaxed text-gray-500">{item.before}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* After column */}
            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#81C784]/15">
                  <Check className="size-5 text-[#81C784]" />
                </div>
                <h3
                  className="text-xl text-gray-700"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  After DevTools 🥳
                </h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-[#81C784]" />
                    <span className="text-sm leading-relaxed text-gray-600">{item.after}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CTA */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <WavyDivider color="#ffffff30" />
      <section className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <Blob color="#FFB74D" size={300} className="bottom-0 right-[10%]" delay={1} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 text-5xl"
          >
            🌸
          </motion.div>
          <h2
            className="text-4xl text-gray-800 md:text-5xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Ready to simplify your auth testing?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-500">
            Stop wrestling with test users and sessions. Start building features that matter.
            Your future self will thank you. 💕
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
              <Button className="h-14 rounded-full bg-gradient-to-r from-[#FF8A80] via-[#B39DDB] to-[#81C784] px-10 text-lg font-semibold text-white shadow-lg shadow-[#B39DDB]/25 transition-all hover:shadow-xl hover:shadow-[#B39DDB]/40">
                <Heart className="mr-2 size-5" />
                Get Started — It&apos;s Free
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
            <code className="rounded-full bg-white/60 px-4 py-1.5 font-mono text-xs text-gray-500 backdrop-blur-sm">
              npm install better-auth-devtools
            </code>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-[#81C784]" /> Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-[#81C784]" /> Dev-only
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-[#81C784]" /> Zero Config
            </span>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/30 py-8 text-center">
        <p className="text-sm text-gray-400">
          Made with{" "}
          <Heart className="inline size-3.5 text-[#FF8A80]" />{" "}
          by the Better Auth DevTools community
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Link
            href="https://github.com/C-W-D-Harshit/better-auth-devtools"
            target="_blank"
            className="text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            GitHub
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="https://www.npmjs.com/package/better-auth-devtools"
            target="_blank"
            className="text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            npm
          </Link>
        </div>
      </footer>
    </div>
  );
}
