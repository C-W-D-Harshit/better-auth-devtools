"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import Link from "next/link";
import { Bebas_Neue, Work_Sans } from "next/font/google";
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
  Package,
  ExternalLink,
  Diamond,
  Hexagon,
  Triangle,
  ChevronRight,
} from "lucide-react";

import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Timeline } from "@/components/ui/timeline";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { TracingBeam } from "@/components/ui/tracing-beam";
import DecryptedText from "@/components/ui/decrypted-text";
import CountUp from "@/components/ui/count-up";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
});

// ─── Geometric decorative components ────────────────────────────────

function DiamondBullet({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-2 w-2 rotate-45 bg-[#F59E0B] ${className}`}
    />
  );
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
  );
}

function SkewedDivider() {
  return (
    <div className="relative h-20 w-full overflow-hidden">
      <div className="absolute inset-0 -skew-y-2 bg-[#0D1117]" />
      <div className="absolute inset-0 -skew-y-2 border-b-2 border-white/[0.04]" />
    </div>
  );
}

// ─── Feature header patterns ─────────────────────────────────────────

function FeatureHeaderPattern({
  color,
  index,
}: {
  color: string;
  index: number;
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
        className="absolute bottom-0 right-0 h-16 w-16 opacity-10"
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
        className="absolute -right-4 -top-4 h-20 w-20 rotate-45 border-2 opacity-10"
        style={{ borderColor: color }}
      />
      <div
        className="absolute -left-2 -bottom-2 h-12 w-12 rotate-45 border-2 opacity-10"
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
        className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 opacity-10"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-full w-px -translate-y-1/2 opacity-10"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute right-4 top-4 h-3 w-3 rotate-45 opacity-20"
        style={{ backgroundColor: color }}
      />
    </div>,
  ];
  return patterns[index % patterns.length];
}

// ─── Copy button hook ────────────────────────────────────────────────

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// ─── Nav items ───────────────────────────────────────────────────────

const navItems = [
  { name: "Features", link: "#features", icon: <Diamond className="h-4 w-4" /> },
  { name: "How it Works", link: "#how-it-works", icon: <Triangle className="h-4 w-4" /> },
  { name: "Code", link: "#code", icon: <Terminal className="h-4 w-4" /> },
  {
    name: "GitHub",
    link: "https://github.com/C-W-D-Harshit/better-auth-devtools",
    icon: <Github className="h-4 w-4" />,
    target: "_blank",
  },
];

// ─── Features data ───────────────────────────────────────────────────

const features = [
  {
    num: "01",
    title: "Managed Test Users",
    description:
      "Create disposable test users from pre-defined templates. Admin, Editor, Viewer — ready in milliseconds.",
    icon: <Users className="h-5 w-5 text-[#F59E0B]" />,
    color: "#F59E0B",
  },
  {
    num: "02",
    title: "Instant Session Switching",
    description:
      "Switch between test users with one click. No credentials, no login forms, no wasted time.",
    icon: <ArrowRightLeft className="h-5 w-5 text-[#3B82F6]" />,
    color: "#3B82F6",
  },
  {
    num: "03",
    title: "Session Inspection",
    description:
      "View all current session data in real-time. Tokens, roles, metadata — everything exposed.",
    icon: <Eye className="h-5 w-5 text-[#10B981]" />,
    color: "#10B981",
  },
  {
    num: "04",
    title: "Session Patching",
    description:
      "Edit approved session fields on-the-fly. Change roles, permissions, and metadata without re-authenticating.",
    icon: <Pencil className="h-5 w-5 text-[#F59E0B]" />,
    color: "#F59E0B",
  },
  {
    num: "05",
    title: "Role-Based Testing",
    description:
      "Multiple user templates with different roles and permissions. Test every access level thoroughly.",
    icon: <ShieldCheck className="h-5 w-5 text-[#3B82F6]" />,
    color: "#3B82F6",
  },
  {
    num: "06",
    title: "Dev-Only Safety",
    description:
      "Only active when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk in production.",
    icon: <Lock className="h-5 w-5 text-[#10B981]" />,
    color: "#10B981",
  },
];

// ─── Animation variants ─────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Timeline data ──────────────────────────────────────────────────

const timelineData = [
  {
    title: "Install",
    content: (
      <div>
        <p className="mb-4 text-sm text-neutral-400" style={{ fontFamily: "var(--font-work)" }}>
          Add the package to your project with a single command.
        </p>
        <div className="border-2 border-white/[0.06] bg-[#0D1117]">
          <div className="flex items-center gap-2 border-b-2 border-white/[0.06] bg-[#161B22] px-4 py-2">
            <div className="h-2 w-2 rotate-45 bg-[#F59E0B]" />
            <span className="font-mono text-xs text-neutral-500">terminal</span>
          </div>
          <pre className="p-4 font-mono text-sm">
            <span className="text-[#10B981]">$</span>{" "}
            <span className="text-white">npm install better-auth-devtools</span>
          </pre>
        </div>
      </div>
    ),
  },
  {
    title: "Configure",
    content: (
      <div>
        <p className="mb-4 text-sm text-neutral-400" style={{ fontFamily: "var(--font-work)" }}>
          Add the plugin to your Better Auth server config and set up the client.
        </p>
        <div className="border-2 border-white/[0.06] bg-[#0D1117]">
          <div className="flex items-center gap-2 border-b-2 border-white/[0.06] bg-[#161B22] px-4 py-2">
            <div className="h-2 w-2 rotate-45 bg-[#3B82F6]" />
            <span className="font-mono text-xs text-neutral-500">auth.ts</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
            <span className="text-[#3B82F6]">import</span>
            <span className="text-white">{" { devAuthPlugin }"}</span>
            <span className="text-[#3B82F6]"> from</span>
            <span className="text-[#F59E0B]"> &quot;better-auth-devtools&quot;</span>
            {"\n\n"}
            <span className="text-neutral-500">{"// In your auth config"}</span>
            {"\n"}
            <span className="text-white">{"plugins: ["}</span>
            {"\n"}
            <span className="text-white">{"  devAuthPlugin({"}</span>
            {"\n"}
            <span className="text-white">{"    "}</span>
            <span className="text-[#10B981]">enabled</span>
            <span className="text-white">{": "}</span>
            <span className="text-[#F59E0B]">true</span>
            {"\n"}
            <span className="text-white">{"  })"}</span>
            {"\n"}
            <span className="text-white">{"]"}</span>
          </pre>
        </div>
      </div>
    ),
  },
  {
    title: "Develop",
    content: (
      <div>
        <p className="mb-4 text-sm text-neutral-400" style={{ fontFamily: "var(--font-work)" }}>
          Start your dev server. The DevTools panel appears automatically. Switch users, inspect
          sessions, patch roles — all from the browser.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Switch users instantly", "Inspect sessions live", "Patch roles on-the-fly"].map(
            (text, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border-2 border-white/[0.06] bg-[#161B22] p-3"
              >
                <div className="h-2 w-2 rotate-45 bg-[#10B981]" />
                <span className="text-xs text-neutral-300">{text}</span>
              </div>
            )
          )}
        </div>
      </div>
    ),
  },
];

// ─── Main Page Component ─────────────────────────────────────────────

export default function Page() {
  const { copied: npmCopied, copy: copyNpm } = useCopyToClipboard();
  const { copied: ctaCopied, copy: copyCta } = useCopyToClipboard();

  return (
    <div
      className={`${bebasNeue.variable} ${workSans.variable} min-h-screen bg-[#0D1117] text-white`}
      style={{ fontFamily: "var(--font-work)" }}
    >
      {/* ─── Floating Navigation ─────────────────────────────────── */}
      <FloatingNav navItems={navItems} className="z-[5000]" />

      {/* ─── Tracing Beam wraps main content ─────────────────────── */}
      <TracingBeam className="max-w-7xl px-4 md:px-8">
        {/* ─── HERO SECTION ────────────────────────────────────────── */}
        <section className="relative min-h-screen overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
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
              className="mb-8 inline-flex items-center gap-2 border-2 border-white/[0.06] bg-[#161B22] px-4 py-2"
            >
              <div className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
              <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
                Unofficial Better Auth Plugin
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              <span className="block text-7xl leading-none tracking-wider text-white sm:text-8xl md:text-9xl lg:text-[10rem]">
                BETTER AUTH
              </span>
              <span className="block text-7xl leading-none tracking-wider text-[#F59E0B] sm:text-8xl md:text-9xl lg:text-[10rem]">
                DEVTOOLS
              </span>
            </motion.h1>

            {/* Subtitle with TextGenerateEffect */}
            <div className="mx-auto max-w-2xl">
              <TextGenerateEffect
                words="A dev-only DevTools panel for Better Auth. Managed test users, instant session switching, real-time inspection."
                className="!text-base !font-normal !leading-relaxed !text-neutral-400 md:!text-lg [&_div]:!text-base [&_div]:!text-neutral-400 md:[&_div]:!text-lg [&_span]:!text-neutral-400"
                duration={0.4}
              />
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                <MovingBorderButton
                  borderRadius="0px"
                  containerClassName="h-14 w-52"
                  borderClassName="h-20 w-20 bg-[radial-gradient(#F59E0B_40%,transparent_60%)] opacity-[0.8]"
                  className="border-2 border-[#F59E0B]/20 bg-[#0D1117] text-sm font-semibold tracking-wider text-white uppercase"
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </MovingBorderButton>
              </Link>

              <button
                onClick={() => copyNpm("npm install better-auth-devtools")}
                className="group flex h-14 items-center gap-3 border-2 border-white/[0.06] bg-[#161B22] px-6 transition-colors hover:border-white/[0.12]"
              >
                <Terminal className="h-4 w-4 text-[#10B981]" />
                <code className="font-mono text-sm text-neutral-300">
                  npm install better-auth-devtools
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

        {/* ─── STATS BAR ───────────────────────────────────────────── */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="border-y-2 border-white/[0.06] bg-[#161B22]"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {[
              { value: 5, label: "API Endpoints", suffix: "" },
              { value: 3, label: "User Templates", suffix: "" },
              { value: 0, label: "Config in Prod", suffix: "" },
              { value: 100, label: "Type-Safe", suffix: "%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`flex flex-col items-center justify-center border-white/[0.06] px-6 py-8 md:py-10 ${
                  i < 3 ? "border-r-2" : ""
                } ${i < 2 ? "border-b-2 md:border-b-0" : ""}`}
              >
                <div
                  className="flex items-baseline gap-0.5 text-5xl text-white md:text-6xl"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  <CountUp
                    to={stat.value}
                    from={0}
                    duration={2}
                    className="text-5xl text-white md:text-6xl"
                  />
                  {stat.suffix && (
                    <span className="text-3xl text-[#F59E0B] md:text-4xl">{stat.suffix}</span>
                  )}
                </div>
                <span className="mt-2 text-xs tracking-widest text-neutral-500 uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <GeometricSeparator />

        {/* ─── FEATURES SECTION ────────────────────────────────────── */}
        <section id="features" className="scroll-mt-24 px-2 py-12 md:px-0 md:py-20">
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
              EVERYTHING YOU NEED
            </h2>
          </motion.div>

          <BentoGrid className="gap-0 md:auto-rows-[22rem] md:grid-cols-3">
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                className={`rounded-none border-2 border-white/[0.06] bg-[#161B22] p-0 shadow-none transition-colors hover:border-white/[0.1] hover:bg-[#1C2129] hover:shadow-none dark:border-white/[0.06] dark:bg-[#161B22] dark:shadow-none ${
                  i === 0 || i === 3 ? "md:col-span-2" : ""
                }`}
                header={
                  <div className="relative h-full min-h-[6rem] bg-[#0D1117]">
                    <FeatureHeaderPattern color={feature.color} index={i} />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
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
              THREE STEPS TO FREEDOM
            </h2>
          </motion.div>

          {/* Timeline wrapper with style overrides */}
          <div
            className="[&_.dark\:bg-neutral-950]:!bg-[#0D1117] [&_.dark\:bg-black]:!bg-[#0D1117] [&_.bg-white]:!bg-[#0D1117] [&_.dark\:bg-neutral-800]:!bg-[#F59E0B] [&_.dark\:border-neutral-700]:!border-[#F59E0B] [&_.from-purple-500]:!from-[#F59E0B] [&_.via-blue-500]:!via-[#F59E0B]/50 [&_.dark\:text-neutral-500]:!text-[#F59E0B] [&_.dark\:via-neutral-700]:!via-[#F59E0B]/20 [&_h2]:!hidden [&_h2+p]:!hidden"
          >
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
              DEAD SIMPLE SETUP
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Server Setup */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border-2 border-white/[0.06] bg-[#0D1117]"
            >
              <div className="flex items-center justify-between border-b-2 border-white/[0.06] bg-[#161B22] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rotate-45 bg-[#F59E0B]" />
                  <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
                    Server Setup
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-600">auth.ts</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                <span className="text-[#3B82F6]">import</span>
                <span className="text-white">{" { betterAuth }"}</span>
                <span className="text-[#3B82F6]"> from </span>
                <span className="text-[#F59E0B]">&quot;better-auth&quot;</span>
                {"\n"}
                <span className="text-[#3B82F6]">import</span>
                <span className="text-white">{" { devAuthPlugin }"}</span>
                <span className="text-[#3B82F6]"> from </span>
                <span className="text-[#F59E0B]">&quot;better-auth-devtools&quot;</span>
                {"\n\n"}
                <span className="text-[#3B82F6]">export const</span>
                <span className="text-white"> auth = </span>
                <span className="text-[#3B82F6]">betterAuth</span>
                <span className="text-white">({"{"}</span>
                {"\n"}
                <span className="text-neutral-500">  {"// ...your config"}</span>
                {"\n"}
                <span className="text-white">  plugins: [</span>
                {"\n"}
                <span className="text-white">    </span>
                <span className="text-[#3B82F6]">devAuthPlugin</span>
                <span className="text-white">({"{"}</span>
                {"\n"}
                <span className="text-white">      </span>
                <span className="text-[#10B981]">enabled</span>
                <span className="text-white">: </span>
                <span className="text-[#F59E0B]">true</span>
                <span className="text-white">,</span>
                {"\n"}
                <span className="text-white">      </span>
                <span className="text-[#10B981]">users</span>
                <span className="text-white">{": ["}</span>
                {"\n"}
                <span className="text-white">{"        { "}</span>
                <span className="text-[#10B981]">name</span>
                <span className="text-white">{": "}</span>
                <span className="text-[#F59E0B]">&quot;Admin&quot;</span>
                <span className="text-white">{", "}</span>
                <span className="text-[#10B981]">role</span>
                <span className="text-white">{": "}</span>
                <span className="text-[#F59E0B]">&quot;admin&quot;</span>
                <span className="text-white">{" },"}</span>
                {"\n"}
                <span className="text-white">{"        { "}</span>
                <span className="text-[#10B981]">name</span>
                <span className="text-white">{": "}</span>
                <span className="text-[#F59E0B]">&quot;Editor&quot;</span>
                <span className="text-white">{", "}</span>
                <span className="text-[#10B981]">role</span>
                <span className="text-white">{": "}</span>
                <span className="text-[#F59E0B]">&quot;editor&quot;</span>
                <span className="text-white">{" },"}</span>
                {"\n"}
                <span className="text-white">{"        { "}</span>
                <span className="text-[#10B981]">name</span>
                <span className="text-white">{": "}</span>
                <span className="text-[#F59E0B]">&quot;Viewer&quot;</span>
                <span className="text-white">{", "}</span>
                <span className="text-[#10B981]">role</span>
                <span className="text-white">{": "}</span>
                <span className="text-[#F59E0B]">&quot;viewer&quot;</span>
                <span className="text-white">{" }"}</span>
                {"\n"}
                <span className="text-white">{"      ]"}</span>
                {"\n"}
                <span className="text-white">{"    })"}</span>
                {"\n"}
                <span className="text-white">{"  ]"}</span>
                {"\n"}
                <span className="text-white">{"})"}</span>
              </pre>
            </motion.div>

            {/* Client Setup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border-2 border-white/[0.06] bg-[#0D1117]"
            >
              <div className="flex items-center justify-between border-b-2 border-white/[0.06] bg-[#161B22] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rotate-45 bg-[#3B82F6]" />
                  <span className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
                    Client Setup
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-600">auth-client.ts</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                <span className="text-[#3B82F6]">import</span>
                <span className="text-white">{" { createAuthClient }"}</span>
                <span className="text-[#3B82F6]"> from </span>
                <span className="text-[#F59E0B]">&quot;better-auth/react&quot;</span>
                {"\n"}
                <span className="text-[#3B82F6]">import</span>
                <span className="text-white">{" { devAuthClient }"}</span>
                <span className="text-[#3B82F6]"> from </span>
                {"\n"}
                <span className="text-[#F59E0B]">  &quot;better-auth-devtools/client&quot;</span>
                {"\n\n"}
                <span className="text-[#3B82F6]">export const</span>
                <span className="text-white"> authClient = </span>
                {"\n"}
                <span className="text-white">  </span>
                <span className="text-[#3B82F6]">createAuthClient</span>
                <span className="text-white">({"{"}</span>
                {"\n"}
                <span className="text-white">    plugins: [</span>
                {"\n"}
                <span className="text-white">      </span>
                <span className="text-[#3B82F6]">devAuthClient</span>
                <span className="text-white">()</span>
                {"\n"}
                <span className="text-white">    ]</span>
                {"\n"}
                <span className="text-white">  {"})"}</span>
                {"\n\n"}
                <span className="text-neutral-500">{"// Use in your app"}</span>
                {"\n"}
                <span className="text-[#3B82F6]">const</span>
                <span className="text-white">{" { "}</span>
                {"\n"}
                <span className="text-white">  switchUser, </span>
                {"\n"}
                <span className="text-white">  getSession, </span>
                {"\n"}
                <span className="text-white">  patchSession</span>
                {"\n"}
                <span className="text-white">{"} = authClient"}</span>
              </pre>
            </motion.div>
          </div>
        </section>

        <SkewedDivider />

        {/* ─── CTA SECTION ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-2 py-20 md:px-0 md:py-32">
          {/* Background decorative */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
            <Hexagon className="absolute -bottom-10 -right-10 h-60 w-60 text-[#F59E0B] opacity-[0.02]" />
            <Triangle className="absolute -top-10 -left-10 h-40 w-40 text-[#3B82F6] opacity-[0.02]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="mb-6 text-4xl leading-tight tracking-wider text-white sm:text-5xl md:text-7xl lg:text-8xl"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                STOP TESTING WITH
                <br />
                <span className="text-[#F59E0B]">REAL CREDENTIALS</span>
              </h2>

              <p className="mx-auto mb-10 max-w-xl text-sm text-neutral-500 md:text-base">
                Better Auth DevTools gives you managed test users, instant session switching, and
                real-time inspection. All dev-only. All type-safe.
              </p>

              <div className="flex flex-col items-center gap-5">
                <Link
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                >
                  <MovingBorderButton
                    borderRadius="0px"
                    containerClassName="h-16 w-64"
                    borderClassName="h-20 w-20 bg-[radial-gradient(#F59E0B_40%,transparent_60%)] opacity-[0.8]"
                    className="border-2 border-[#F59E0B]/20 bg-[#0D1117] text-base font-bold tracking-widest text-white uppercase"
                  >
                    <span className="flex items-center gap-2">
                      Get Started Now
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </MovingBorderButton>
                </Link>

                <button
                  onClick={() => copyCta("npm install better-auth-devtools")}
                  className="group flex items-center gap-3 border-2 border-white/[0.06] bg-[#161B22] px-6 py-4 transition-colors hover:border-[#F59E0B]/20"
                >
                  <span className="text-[#10B981]">$</span>
                  <code className="font-mono text-sm text-neutral-300">
                    npm install better-auth-devtools
                  </code>
                  {ctaCopied ? (
                    <Check className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-white" />
                  )}
                </button>

                <div className="flex items-center gap-6 pt-2">
                  <Link
                    href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <div className="h-4 w-px bg-white/[0.06]" />
                  <Link
                    href="https://www.npmjs.com/package/better-auth-devtools"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
                  >
                    <Package className="h-4 w-4" />
                    npm
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── FOOTER ──────────────────────────────────────────────── */}
        <footer className="border-t-2 border-white/[0.06] px-2 py-10 md:px-0">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3">
                <span
                  className="text-xl tracking-wider text-white"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  BETTER AUTH
                </span>
                <span
                  className="text-xl tracking-wider text-[#F59E0B]"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  DEVTOOLS
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-600">
                <Link
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                  className="transition-colors hover:text-white"
                >
                  GitHub
                </Link>
                <DiamondBullet className="h-1 w-1" />
                <Link
                  href="https://www.npmjs.com/package/better-auth-devtools"
                  target="_blank"
                  className="transition-colors hover:text-white"
                >
                  npm
                </Link>
                <DiamondBullet className="h-1 w-1" />
                <Link href="#features" className="transition-colors hover:text-white">
                  Features
                </Link>
                <DiamondBullet className="h-1 w-1" />
                <Link href="#code" className="transition-colors hover:text-white">
                  Docs
                </Link>
              </div>

              <div className="font-mono text-[10px] tracking-wider text-neutral-700">
                DEV-ONLY <span className="text-[#10B981]">/</span> TYPE-SAFE{" "}
                <span className="text-[#10B981]">/</span> ZERO CONFIG IN PROD
              </div>
            </div>
          </div>
        </footer>
      </TracingBeam>
    </div>
  );
}
