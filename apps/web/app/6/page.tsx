"use client";

import { motion, type Variants } from "motion/react";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import {
  ArrowLeft,
  Github,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const ibmPlex = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
});

/* ─────────────────── ANIMATION VARIANTS ─────────────────── */

const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─────────────────── FEATURES DATA ─────────────────── */

const features = [
  {
    num: "001",
    title: "Managed Test Users",
    desc: "Create disposable test users from pre-defined templates. Admin, Editor, Viewer -- ready in milliseconds.",
  },
  {
    num: "002",
    title: "Instant Session Switching",
    desc: "Switch between test users with one click. No credentials. No login forms. Pure velocity.",
  },
  {
    num: "003",
    title: "Session Inspection",
    desc: "View all current session data in real-time. Every token, every claim, every field -- transparent.",
  },
  {
    num: "004",
    title: "Session Patching",
    desc: "Edit approved session fields on-the-fly. Change roles, permissions, metadata without re-authentication.",
  },
  {
    num: "005",
    title: "Role-Based Testing",
    desc: "Multiple user templates with different roles. Test every permission boundary systematically.",
  },
  {
    num: "006",
    title: "Development-Only Safety",
    desc: "Only active when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk in production. Absolute certainty.",
  },
];

const steps = [
  {
    num: "01",
    title: "Install",
    code: "npm install better-auth-devtools",
  },
  {
    num: "02",
    title: "Configure",
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
    num: "03",
    title: "Develop",
    code: "DEV_AUTH_ENABLED=true npm run dev",
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <div
      className={`${spaceGrotesk.variable} ${ibmPlex.variable} relative min-h-screen bg-black text-white selection:bg-[#E53935] selection:text-white`}
      style={{ fontFamily: "var(--font-ibm), sans-serif" }}
    >
      {/* ── DOT GRID BACKGROUND ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── 12-COLUMN GRID OVERLAY ── */}
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto hidden max-w-[1400px] px-6 lg:grid lg:grid-cols-12 lg:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-x border-white/[0.02]" />
        ))}
      </div>

      {/* ── CONTENT WRAPPER ── */}
      <div className="relative z-10">
        {/* ── NAV ── */}
        <nav className="border-b border-white/[0.08]">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="group flex items-center gap-2 text-[13px] font-medium tracking-wide text-white/40 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-ibm)" }}
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              Back
            </Link>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 transition-colors hover:text-white"
              >
                <Github className="size-[18px]" />
              </a>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1: HERO
            ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-6 pt-32 pb-40 lg:pt-44 lg:pb-52">
            <div className="grid lg:grid-cols-12 lg:gap-4">
              {/* Left: Section number */}
              <div className="hidden lg:col-span-2 lg:block">
                <motion.span
                  className="block text-[8rem] font-bold leading-none text-white/[0.03]"
                  style={{ fontFamily: "var(--font-space)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  01
                </motion.span>
              </div>

              {/* Right: Content */}
              <div className="lg:col-span-10">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-12"
                >
                  <Badge className="rounded-none border border-white/20 bg-transparent px-3 py-1 text-[11px] font-medium tracking-[0.15em] text-white/50 uppercase hover:bg-transparent">
                    Better Auth Plugin
                  </Badge>
                </motion.div>

                {/* Massive stacked title */}
                <motion.h1
                  style={{ fontFamily: "var(--font-space)" }}
                  className="mb-8"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.span
                    className="block text-[clamp(3rem,10vw,10rem)] font-bold leading-[0.85] tracking-[-0.03em] text-white"
                    variants={clipReveal}
                  >
                    BETTER
                  </motion.span>
                  <motion.span
                    className="block text-[clamp(3rem,10vw,10rem)] font-bold leading-[0.85] tracking-[-0.03em] text-white"
                    variants={clipReveal}
                  >
                    AUTH
                  </motion.span>
                  <motion.span
                    className="flex items-center gap-6 text-[clamp(3rem,10vw,10rem)] font-bold leading-[0.85] tracking-[-0.03em] text-white"
                    variants={clipReveal}
                  >
                    <span className="inline-block size-3 shrink-0 bg-[#E53935] lg:size-5" />
                    DEVTOOLS
                  </motion.span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  className="max-w-md text-[15px] font-light leading-[1.7] text-white/40"
                  style={{ fontFamily: "var(--font-ibm)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Development-only authentication tooling.
                  <br />
                  Managed users. Instant sessions. Zero risk.
                </motion.p>

                {/* Thick rule */}
                <motion.div
                  className="mt-12 h-[5px] bg-white"
                  style={{ maxWidth: "120px" }}
                  variants={lineReveal}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Thick section divider */}
        <div className="h-[5px] bg-white/[0.06]" />

        {/* ══════════════════════════════════════════════════════════
            SECTION 2: PROBLEM STATEMENT
            ══════════════════════════════════════════════════════════ */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-6 py-32 lg:py-40">
            <div className="grid lg:grid-cols-12 lg:gap-4">
              {/* Section number */}
              <div className="hidden lg:col-span-2 lg:block">
                <motion.span
                  className="block text-[8rem] font-bold leading-none text-white/[0.03]"
                  style={{ fontFamily: "var(--font-space)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  02
                </motion.span>
              </div>

              {/* Quote */}
              <motion.div
                className="lg:col-span-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
              >
                <div className="border-l-[5px] border-[#E53935] pl-8 lg:pl-12">
                  <blockquote
                    className="text-[clamp(1.5rem,4vw,3rem)] font-light leading-[1.3] tracking-[-0.01em] text-white/80 italic"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    &ldquo;Every time I need to test a different user role, I log out,
                    find the credentials, log back in, and lose my entire
                    development context. It&apos;s 2026 and we&apos;re still doing this.&rdquo;
                  </blockquote>
                  <motion.div
                    className="mt-8 h-px bg-white/[0.08]"
                    variants={lineReveal}
                  />
                  <p className="mt-6 text-[13px] font-medium tracking-[0.1em] text-white/30 uppercase">
                    Every developer, every project, every time.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Thin rule */}
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="h-px bg-white/[0.08]" />
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3: FEATURES
            ══════════════════════════════════════════════════════════ */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-6 py-32 lg:py-40">
            <div className="grid lg:grid-cols-12 lg:gap-4">
              {/* Section number */}
              <div className="hidden lg:col-span-2 lg:block">
                <motion.span
                  className="block text-[8rem] font-bold leading-none text-white/[0.03]"
                  style={{ fontFamily: "var(--font-space)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  03
                </motion.span>
              </div>

              {/* Features list */}
              <div className="lg:col-span-10">
                {/* Section label */}
                <motion.div
                  className="mb-16"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <p className="text-[13px] font-medium tracking-[0.15em] text-white/30 uppercase">
                    Capabilities
                  </p>
                  <motion.div
                    className="mt-4 h-[5px] bg-white"
                    style={{ maxWidth: "60px" }}
                    variants={lineReveal}
                  />
                </motion.div>

                {/* Feature rows */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                >
                  {features.map((f, i) => (
                    <motion.div key={f.num} variants={fadeUp}>
                      {/* Top rule for first item */}
                      {i === 0 && (
                        <motion.div
                          className="h-px bg-white/[0.08]"
                          variants={lineReveal}
                        />
                      )}

                      <div className="group grid items-baseline gap-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
                        {/* Number */}
                        <span
                          className="text-[13px] font-medium tracking-[0.15em] text-white/15 lg:col-span-1"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          {f.num}
                        </span>

                        {/* Title */}
                        <h3
                          className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold tracking-[-0.01em] text-white lg:col-span-4"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          {f.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-[14px] font-light leading-[1.7] text-white/40 lg:col-span-7"
                          style={{ fontFamily: "var(--font-ibm)" }}
                        >
                          {f.desc}
                        </p>
                      </div>

                      {/* Bottom rule */}
                      <motion.div
                        className="h-px bg-white/[0.08]"
                        variants={lineReveal}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Thick section divider */}
        <div className="h-[5px] bg-white/[0.06]" />

        {/* ══════════════════════════════════════════════════════════
            SECTION 4: CODE
            ══════════════════════════════════════════════════════════ */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-6 py-32 lg:py-40">
            <div className="grid lg:grid-cols-12 lg:gap-4">
              {/* Section number */}
              <div className="hidden lg:col-span-2 lg:block">
                <motion.span
                  className="block text-[8rem] font-bold leading-none text-white/[0.03]"
                  style={{ fontFamily: "var(--font-space)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  04
                </motion.span>
              </div>

              <div className="lg:col-span-10">
                {/* Section label */}
                <motion.div
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <p className="text-[13px] font-medium tracking-[0.15em] text-white/30 uppercase">
                    Integration
                  </p>
                  <motion.div
                    className="mt-4 h-[5px] bg-[#E53935]"
                    style={{ maxWidth: "60px" }}
                    variants={lineReveal}
                  />
                </motion.div>

                {/* Code block */}
                <motion.div
                  className="relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={clipReveal}
                >
                  <div className="border border-white/[0.08]">
                    {/* Code header */}
                    <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-3">
                      <span
                        className="text-[12px] font-medium tracking-[0.1em] text-white/25 uppercase"
                        style={{ fontFamily: "var(--font-ibm)" }}
                      >
                        auth.config.ts
                      </span>
                      <div className="size-2 bg-[#E53935]" />
                    </div>

                    {/* Code content */}
                    <pre
                      className="overflow-x-auto p-8 text-[13px] leading-[1.8]"
                      style={{ fontFamily: "var(--font-ibm)" }}
                    >
                      <code>
                        <span className="text-[#E53935]">import</span>
                        <span className="text-white/70">{" { betterAuth } "}</span>
                        <span className="text-[#E53935]">from</span>
                        <span className="text-white/50">{" \"better-auth\""}</span>
                        <span className="text-white/20">;</span>
                        {"\n"}
                        <span className="text-[#E53935]">import</span>
                        <span className="text-white/70">{" { devTools } "}</span>
                        <span className="text-[#E53935]">from</span>
                        <span className="text-white/50">{" \"better-auth-devtools\""}</span>
                        <span className="text-white/20">;</span>
                        {"\n\n"}
                        <span className="text-[#E53935]">export const</span>
                        <span className="text-white/70">{" auth = "}</span>
                        <span className="text-white/70">{"betterAuth({"}</span>
                        {"\n"}
                        <span className="text-white/70">{"  plugins: ["}</span>
                        {"\n"}
                        <span className="text-white/70">{"    devTools({"}</span>
                        {"\n"}
                        <span className="text-white/70">{"      users: ["}</span>
                        {"\n"}
                        <span className="text-white/50">{"        { name: "}</span>
                        <span className="text-white/50">{'"Admin"'}</span>
                        <span className="text-white/50">{", role: "}</span>
                        <span className="text-white/50">{'"admin"'}</span>
                        <span className="text-white/50">{" },"}</span>
                        {"\n"}
                        <span className="text-white/50">{"        { name: "}</span>
                        <span className="text-white/50">{'"Editor"'}</span>
                        <span className="text-white/50">{", role: "}</span>
                        <span className="text-white/50">{'"editor"'}</span>
                        <span className="text-white/50">{" },"}</span>
                        {"\n"}
                        <span className="text-white/50">{"        { name: "}</span>
                        <span className="text-white/50">{'"Viewer"'}</span>
                        <span className="text-white/50">{", role: "}</span>
                        <span className="text-white/50">{'"viewer"'}</span>
                        <span className="text-white/50">{" },"}</span>
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
          </div>
        </section>

        {/* Thin rule */}
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="h-px bg-white/[0.08]" />
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECTION 5: QUICK START
            ══════════════════════════════════════════════════════════ */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-6 py-32 lg:py-40">
            <div className="grid lg:grid-cols-12 lg:gap-4">
              {/* Section number */}
              <div className="hidden lg:col-span-2 lg:block">
                <motion.span
                  className="block text-[8rem] font-bold leading-none text-white/[0.03]"
                  style={{ fontFamily: "var(--font-space)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  05
                </motion.span>
              </div>

              <div className="lg:col-span-10">
                {/* Section label */}
                <motion.div
                  className="mb-16"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <p className="text-[13px] font-medium tracking-[0.15em] text-white/30 uppercase">
                    Quick Start
                  </p>
                  <motion.div
                    className="mt-4 h-[5px] bg-white"
                    style={{ maxWidth: "60px" }}
                    variants={lineReveal}
                  />
                </motion.div>

                {/* Steps */}
                <motion.div
                  className="space-y-0"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                >
                  {steps.map((step, i) => (
                    <motion.div key={step.num} variants={fadeUp}>
                      {i === 0 && (
                        <div className="h-px bg-white/[0.08]" />
                      )}
                      <div className="grid items-start gap-6 py-10 lg:grid-cols-12 lg:gap-8">
                        {/* Number + Title */}
                        <div className="flex items-baseline gap-6 lg:col-span-3">
                          <span
                            className="text-[3rem] font-bold leading-none text-white/[0.06]"
                            style={{ fontFamily: "var(--font-space)" }}
                          >
                            {step.num}
                          </span>
                          <h3
                            className="text-[18px] font-bold tracking-[-0.01em] text-white"
                            style={{ fontFamily: "var(--font-space)" }}
                          >
                            {step.title}
                          </h3>
                        </div>

                        {/* Code */}
                        <div className="lg:col-span-9">
                          <pre
                            className="overflow-x-auto border border-white/[0.06] px-6 py-5 text-[13px] leading-[1.7] text-white/50"
                            style={{ fontFamily: "var(--font-ibm)" }}
                          >
                            <code>{step.code}</code>
                          </pre>
                        </div>
                      </div>
                      <div className="h-px bg-white/[0.08]" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Thick section divider */}
        <div className="h-[5px] bg-white/[0.06]" />

        {/* ══════════════════════════════════════════════════════════
            SECTION 6: CTA
            ══════════════════════════════════════════════════════════ */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-6 py-32 lg:py-44">
            <div className="grid lg:grid-cols-12 lg:gap-4">
              {/* Section number */}
              <div className="hidden lg:col-span-2 lg:block">
                <motion.span
                  className="block text-[8rem] font-bold leading-none text-white/[0.03]"
                  style={{ fontFamily: "var(--font-space)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  06
                </motion.span>
              </div>

              <motion.div
                className="lg:col-span-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
              >
                {/* Bold statement */}
                <motion.h2
                  className="mb-6 text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-[-0.03em] text-white"
                  style={{ fontFamily: "var(--font-space)" }}
                  variants={clipReveal}
                >
                  Stop testing
                  <br />
                  with real
                  <br />
                  credentials
                  <span className="inline-block size-3 translate-y-[-0.1em] bg-[#E53935] lg:size-4" />
                </motion.h2>

                {/* Rule */}
                <motion.div
                  className="my-10 h-[5px] bg-[#E53935]"
                  style={{ maxWidth: "80px" }}
                  variants={lineReveal}
                />

                {/* npm install line */}
                <motion.div
                  className="mb-10 flex items-center gap-4"
                  variants={fadeUp}
                >
                  <Terminal className="size-4 text-white/20" />
                  <code
                    className="text-[14px] font-light text-white/40"
                    style={{ fontFamily: "var(--font-ibm)" }}
                  >
                    npm install better-auth-devtools
                  </code>
                </motion.div>

                {/* CTA button */}
                <motion.div
                  className="flex flex-wrap items-center gap-5"
                  variants={fadeUp}
                >
                  <a
                    href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="group relative h-14 overflow-hidden rounded-none border border-[#E53935] bg-transparent px-10 text-[13px] font-semibold tracking-[0.1em] text-[#E53935] uppercase transition-colors duration-300 hover:text-white"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-[#E53935] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                      <span className="relative flex items-center gap-3">
                        <Github className="size-4" />
                        Get Started
                        <ArrowRight className="size-4" />
                      </span>
                    </Button>
                  </a>
                  <a
                    href="https://www.npmjs.com/package/better-auth-devtools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-[13px] font-medium tracking-[0.05em] text-white/40 transition-colors hover:text-white"
                    style={{ fontFamily: "var(--font-ibm)" }}
                  >
                    View on npm
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-[#E53935] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/[0.08]">
          <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center">
            <span
              className="text-[14px] font-bold tracking-[0.08em] text-white/15"
              style={{ fontFamily: "var(--font-space)" }}
            >
              BETTER AUTH DEVTOOLS
            </span>

            <div className="flex items-center gap-8">
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-[12px] font-medium tracking-[0.05em] text-white/25 transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                GitHub
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#E53935] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </a>
              <a
                href="https://www.npmjs.com/package/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-[12px] font-medium tracking-[0.05em] text-white/25 transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                npm
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#E53935] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </a>
              <span
                className="text-[11px] tracking-[0.05em] text-white/15"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                MIT License
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
