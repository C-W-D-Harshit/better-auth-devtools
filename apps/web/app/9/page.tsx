"use client";

import { motion, type Variants } from "motion/react";
import { Syne, Inter_Tight } from "next/font/google";
import Link from "next/link";
import {
  Users,
  Zap,
  Eye,
  Settings,
  Layers,
  Shield,
  Terminal,
  Github,
  ArrowRight,
  ArrowUpRight,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

/* ─────────────────── ANIMATION VARIANTS ─────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────── FEATURES DATA ─────────────────── */

const features = [
  {
    num: "01",
    title: "Managed Test Users",
    desc: "Create disposable test users from pre-defined templates. Admin, Editor, Viewer — ready in milliseconds. No database cleanup needed.",
    icon: Users,
    inverted: false,
  },
  {
    num: "02",
    title: "Instant Session Switching",
    desc: "Switch between test users with one click. No credentials needed. No login forms. Pure, uninterrupted development speed.",
    icon: Zap,
    inverted: true,
  },
  {
    num: "03",
    title: "Session Inspection",
    desc: "View all current session data in real-time. Every token, every claim, every field — visible and searchable as you develop.",
    icon: Eye,
    inverted: false,
  },
  {
    num: "04",
    title: "Session Patching",
    desc: "Edit approved session fields on-the-fly. Change roles, tweak permissions, test edge cases — without re-authenticating.",
    icon: Settings,
    inverted: true,
  },
  {
    num: "05",
    title: "Role-Based Testing",
    desc: "Support for multiple user templates with different roles and permissions. Test every access level in your application systematically.",
    icon: Layers,
    inverted: false,
  },
  {
    num: "06",
    title: "Dev-Only Safety",
    desc: "Only works when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero chance of leaking into production. Built-in guardrails.",
    icon: Shield,
    inverted: true,
  },
];

/* ─────────────────── MARQUEE TEXT ─────────────────── */

const marqueeText =
  "MANAGED TEST USERS / INSTANT SESSION SWITCHING / SESSION INSPECTION / SESSION PATCHING / ROLE-BASED TESTING / DEV-ONLY SAFETY / ";

/* ─────────────────── STEPS DATA ─────────────────── */

const steps = [
  {
    num: "01",
    title: "Install",
    desc: "Add better-auth-devtools to your project via npm, yarn, or pnpm. One dependency, zero configuration.",
    code: "npm i better-auth-devtools",
  },
  {
    num: "02",
    title: "Configure",
    desc: "Register the plugin with your Better Auth instance. Define your test user templates — roles, permissions, metadata.",
    code: "plugins: [devTools()]",
  },
  {
    num: "03",
    title: "Build",
    desc: "Start developing. Switch users, inspect sessions, patch data. All from a floating dev panel in your app.",
    code: "DEV_AUTH_ENABLED=true",
  },
];

/* ─────────────────── CODE SAMPLE ─────────────────── */

const codeSample = `import { betterAuth } from "better-auth";
import { devTools } from "better-auth-devtools";

export const auth = betterAuth({
  plugins: [
    devTools({
      users: [
        {
          name: "Admin User",
          email: "admin@test.dev",
          role: "admin",
          permissions: ["read", "write", "delete"],
        },
        {
          name: "Editor",
          email: "editor@test.dev",
          role: "editor",
          permissions: ["read", "write"],
        },
        {
          name: "Viewer",
          email: "viewer@test.dev",
          role: "viewer",
          permissions: ["read"],
        },
      ],
    }),
  ],
});`;

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function Page() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i better-auth-devtools");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${syne.variable} ${interTight.variable} min-h-screen`}
      style={{
        backgroundColor: "#F2F0ED",
        color: "#000000",
        fontFamily: "var(--font-inter-tight), sans-serif",
      }}
    >
      {/* ─────────── NAV ─────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        style={{ backgroundColor: "#F2F0ED", borderBottom: "2px solid #000" }}
      >
        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          <span style={{ color: "#FF4D00" }}>&larr;</span> Back
        </Link>
        <div className="flex items-center gap-6">
          <Badge
            variant="outline"
            className="rounded-none border-2 border-black px-3 py-1 text-xs uppercase tracking-widest"
          >
            v1.0
          </Badge>
          <Link
            href="https://github.com/C-W-D-Harshit/better-auth-devtools"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm uppercase tracking-wider"
          >
            <Github className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </div>
      </nav>

      {/* ─────────── HERO POSTER ─────────── */}
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* Background oversized letter */}
        <div
          className="pointer-events-none absolute -right-20 -top-10 select-none"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(20rem, 50vw, 45rem)",
            fontWeight: 800,
            lineHeight: 0.8,
            color: "rgba(0,0,0,0.04)",
          }}
        >
          B
        </div>

        {/* Vertical side label */}
        <div
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg) translateX(50%)",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)",
          }}
        >
          Better Auth DevTools &mdash; Development Toolkit &mdash; 2025
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-between px-6 pb-10 md:px-10 lg:px-20">
          <motion.div
            className="mt-10 md:mt-20"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontWeight: 800,
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
              }}
            >
              <span
                className="block"
                style={{ fontSize: "clamp(5rem, 18vw, 22rem)" }}
              >
                BETTER
              </span>
              <span
                className="block"
                style={{
                  fontSize: "clamp(5rem, 18vw, 22rem)",
                  WebkitTextStroke: "3px #000",
                  color: "transparent",
                }}
              >
                AUTH
              </span>
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-2 flex items-end gap-4 md:mt-4"
            >
              <span
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "clamp(2rem, 6vw, 5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                DEVTOOLS
              </span>
              <div
                className="mb-2 hidden h-1 flex-1 md:block"
                style={{ backgroundColor: "#FF4D00", maxWidth: "200px" }}
              />
            </motion.div>
          </motion.div>

          {/* Bottom row: description + scroll hint */}
          <motion.div
            className="flex flex-col items-end justify-between gap-8 md:flex-row md:items-end"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={slideFromLeft}
              className="flex items-center gap-3"
            >
              <div
                className="h-12 w-1"
                style={{ backgroundColor: "#FF4D00" }}
              />
              <p
                className="max-w-xs text-sm leading-relaxed"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
                A Better Auth plugin for instant test user management, session
                switching, and role-based testing in development.
              </p>
            </motion.div>

            <motion.div
              variants={slideFromRight}
              className="text-right"
            >
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  color: "rgba(0,0,0,0.4)",
                }}
              >
                Scroll to explore
              </p>
              <motion.div
                className="mt-2 mx-auto md:ml-auto md:mr-0 flex size-10 items-center justify-center"
                style={{ border: "2px solid #000" }}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="size-4 rotate-90" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── MARQUEE STRIP ─────────── */}
      <div
        className="relative overflow-hidden py-5"
        style={{ backgroundColor: "#000", color: "#fff" }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 25s linear infinite",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-sm font-medium uppercase tracking-[0.25em] md:text-base"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              {marqueeText}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ─────────── FEATURES: EDITORIAL SPREADS ─────────── */}
      <section className="relative">
        {/* Section vertical label */}
        <div
          className="absolute right-4 top-20 hidden lg:block"
          style={{
            writingMode: "vertical-lr",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.2)",
          }}
        >
          Features
        </div>

        {features.map((feature, index) => (
          <motion.div
            key={feature.num}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="relative overflow-hidden"
            style={{
              backgroundColor: feature.inverted ? "#000" : "#F2F0ED",
              color: feature.inverted ? "#F2F0ED" : "#000",
              borderBottom: feature.inverted ? "none" : "3px solid #000",
              borderTop: feature.inverted ? "none" : (index === 0 ? "3px solid #000" : "none"),
            }}
          >
            {/* Oversized feature number */}
            <div
              className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 select-none md:left-4"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "clamp(8rem, 25vw, 20rem)",
                fontWeight: 800,
                lineHeight: 1,
                color: feature.inverted
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              }}
            >
              {feature.num}
            </div>

            <div className="relative z-10 grid gap-8 px-6 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24 lg:px-20">
              {/* Left: icon + number */}
              <div
                className={`flex flex-col justify-center ${
                  index % 2 !== 0 ? "md:order-2" : ""
                }`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center"
                    style={{
                      border: `3px solid ${feature.inverted ? "#F2F0ED" : "#000"}`,
                    }}
                  >
                    <feature.icon className="size-5" />
                  </div>
                  <span
                    className="text-sm uppercase tracking-[0.3em]"
                    style={{
                      fontFamily: "var(--font-syne), sans-serif",
                      color: "#FF4D00",
                    }}
                  >
                    Feature {feature.num}
                  </span>
                </div>
                <h3
                  className="text-4xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl"
                  style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {feature.title}
                </h3>
              </div>

              {/* Right: description */}
              <div
                className={`flex flex-col justify-center ${
                  index % 2 !== 0 ? "md:order-1" : ""
                }`}
              >
                <p
                  className="max-w-md text-base leading-relaxed md:text-lg"
                  style={{
                    color: feature.inverted
                      ? "rgba(242,240,237,0.7)"
                      : "rgba(0,0,0,0.6)",
                  }}
                >
                  {feature.desc}
                </p>
                <div
                  className="mt-6 h-0.5 w-16"
                  style={{ backgroundColor: "#FF4D00" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ─────────── MARQUEE STRIP (REVERSE) ─────────── */}
      <div
        className="relative overflow-hidden py-5"
        style={{ backgroundColor: "#FF4D00", color: "#000" }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee-reverse 20s linear infinite",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-sm font-bold uppercase tracking-[0.25em] md:text-base"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              BETTER AUTH DEVTOOLS &mdash; DEVELOPMENT TOOLKIT &mdash; PLUGIN
              FOR BETTER AUTH &mdash;&nbsp;
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee-reverse {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>

      {/* ─────────── CODE SPECIMEN ─────────── */}
      <section className="relative px-6 py-20 md:px-10 md:py-32 lg:px-20">
        {/* Vertical side label */}
        <div
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg) translateX(50%)",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.2)",
          }}
        >
          Code Specimen
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  color: "#FF4D00",
                }}
              >
                Implementation
              </span>
              <h2
                className="mt-2 text-5xl font-bold tracking-tight md:text-7xl"
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Setup in
                <br />
                <span style={{ WebkitTextStroke: "2px #000", color: "transparent" }}>
                  seconds
                </span>
              </h2>
            </div>
            <p
              className="max-w-sm text-sm leading-relaxed"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              Drop in the plugin, define your test users, and start building.
              No complex configuration required.
            </p>
          </motion.div>

          <motion.div
            variants={scaleIn}
            className="relative"
            style={{ border: "3px solid #000" }}
          >
            {/* Code header bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "3px solid #000" }}
            >
              <div className="flex items-center gap-3">
                <Terminal className="size-4" />
                <span
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  auth.ts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-none border-2 border-black px-2 py-0.5 text-[10px] uppercase tracking-widest"
                >
                  TypeScript
                </Badge>
              </div>
            </div>

            {/* Code body */}
            <div className="overflow-x-auto bg-white p-0">
              <pre className="p-5 text-sm leading-7 md:text-base md:leading-8">
                {codeSample.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span
                      className="mr-6 inline-block w-6 shrink-0 text-right text-xs"
                      style={{
                        color: "#FF4D00",
                        fontFamily: "var(--font-syne), sans-serif",
                        paddingTop: "2px",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <code style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                      {line || " "}
                    </code>
                  </div>
                ))}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section
        className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32 lg:px-20"
        style={{ borderTop: "3px solid #000" }}
      >
        {/* Background oversized text */}
        <div
          className="pointer-events-none absolute -right-10 top-0 select-none"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(10rem, 30vw, 25rem)",
            fontWeight: 800,
            lineHeight: 0.9,
            color: "rgba(0,0,0,0.03)",
          }}
        >
          HOW
        </div>

        {/* Vertical side label */}
        <div
          className="absolute right-4 top-20 hidden lg:block"
          style={{
            writingMode: "vertical-lr",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.2)",
          }}
        >
          Process
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-16 md:mb-24">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                color: "#FF4D00",
              }}
            >
              Process
            </span>
            <h2
              className="mt-2 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              How it
              <br />
              works
            </h2>
          </motion.div>

          <div className="relative grid gap-0 md:grid-cols-3">
            {/* Orange connector line (desktop) */}
            <div
              className="absolute left-0 right-0 top-16 hidden h-0.5 md:block"
              style={{ backgroundColor: "#FF4D00" }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative pb-16 md:pb-0"
                style={{
                  borderRight:
                    i < steps.length - 1 ? "3px solid #000" : "none",
                  paddingLeft: i === 0 ? 0 : undefined,
                }}
              >
                <div className="px-0 md:px-8">
                  {/* Step number */}
                  <div className="relative mb-8">
                    <span
                      className="relative z-10 inline-flex size-12 items-center justify-center text-sm font-bold"
                      style={{
                        fontFamily: "var(--font-syne), sans-serif",
                        backgroundColor: "#FF4D00",
                        color: "#000",
                      }}
                    >
                      {step.num}
                    </span>
                    {/* Oversized step number behind */}
                    <span
                      className="pointer-events-none absolute -left-2 -top-10 select-none"
                      style={{
                        fontFamily: "var(--font-syne), sans-serif",
                        fontSize: "8rem",
                        fontWeight: 800,
                        lineHeight: 1,
                        color: "rgba(0,0,0,0.04)",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3
                    className="mb-4 text-3xl font-bold md:text-4xl"
                    style={{
                      fontFamily: "var(--font-syne), sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="mb-6 text-sm leading-relaxed"
                    style={{ color: "rgba(0,0,0,0.5)", maxWidth: "280px" }}
                  >
                    {step.desc}
                  </p>

                  <code
                    className="inline-block px-4 py-2 text-sm font-medium"
                    style={{
                      border: "2px solid #000",
                      backgroundColor: "#fff",
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                    }}
                  >
                    {step.code}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─────────── CTA POSTER ─────────── */}
      <section
        className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32 lg:px-20"
        style={{ backgroundColor: "#000", color: "#F2F0ED" }}
      >
        {/* Background cut-off text */}
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 select-none"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(12rem, 35vw, 30rem)",
            fontWeight: 800,
            lineHeight: 0.8,
            color: "rgba(255,255,255,0.03)",
          }}
        >
          GO
        </div>

        {/* Vertical side label */}
        <div
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg) translateX(50%)",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          Get Started
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative z-10"
        >
          <motion.div variants={fadeUp}>
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                color: "#FF4D00",
              }}
            >
              Ready?
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            START
            <br />
            <span
              style={{
                WebkitTextStroke: "2px #F2F0ED",
                color: "transparent",
              }}
            >
              BUILDING
            </span>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:gap-8"
          >
            {/* Install command */}
            <button
              onClick={handleCopy}
              className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-white/5"
              style={{ border: "2px solid rgba(255,255,255,0.2)" }}
            >
              <Terminal className="size-4" style={{ color: "#FF4D00" }} />
              <code
                className="text-sm"
                style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
              >
                npm i better-auth-devtools
              </code>
              <Copy className="size-3.5 opacity-40 transition-opacity group-hover:opacity-100" />
              {copied && (
                <span className="ml-1 text-xs" style={{ color: "#FF4D00" }}>
                  Copied!
                </span>
              )}
            </button>

            <span
              className="hidden text-xs uppercase tracking-[0.3em] md:inline"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              or
            </span>

            <div className="flex gap-4">
              <Link
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="rounded-none px-8 py-6 text-sm font-bold uppercase tracking-[0.15em]"
                  style={{
                    backgroundColor: "#FF4D00",
                    color: "#000",
                    border: "none",
                    fontFamily: "var(--font-syne), sans-serif",
                  }}
                >
                  <Github className="mr-2 size-4" />
                  GitHub
                  <ArrowUpRight className="ml-2 size-3.5" />
                </Button>
              </Link>

              <Link
                href="https://www.npmjs.com/package/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="rounded-none border-2 px-8 py-6 text-sm font-bold uppercase tracking-[0.15em]"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "#F2F0ED",
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-syne), sans-serif",
                  }}
                >
                  npm
                  <ArrowUpRight className="ml-2 size-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Bottom detail */}
          <motion.div
            variants={fadeIn}
            className="mt-20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "2rem",
            }}
          >
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.3)", maxWidth: "400px" }}
            >
              Better Auth DevTools is a development-only plugin. It requires
              NODE_ENV=development and DEV_AUTH_ENABLED=true. It will never
              activate in production environments.
            </p>
            <div className="flex items-center gap-4">
              <Shield className="size-4" style={{ color: "#FF4D00" }} />
              <span
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Dev-only safety guaranteed
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer
        className="flex flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-10"
        style={{ borderTop: "3px solid #000" }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            color: "rgba(0,0,0,0.4)",
          }}
        >
          Better Auth DevTools
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/C-W-D-Harshit/better-auth-devtools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.15em] transition-colors"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            GitHub
          </Link>
          <Link
            href="https://www.npmjs.com/package/better-auth-devtools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.15em] transition-colors"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            npm
          </Link>
          <span
            className="text-xs"
            style={{ color: "rgba(0,0,0,0.3)" }}
          >
            MIT License
          </span>
        </div>
      </footer>
    </div>
  );
}
