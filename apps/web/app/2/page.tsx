"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  Shield,
  Users,
  Eye,
  Settings,
  Github,
  ExternalLink,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const features = [
  {
    number: "01",
    title: "Managed Test Users",
    description:
      "Create disposable test users from pre-defined templates. Admin, Editor, Viewer — all ready in an instant, all gone when you're done.",
    icon: Users,
  },
  {
    number: "02",
    title: "Instant Session Switching",
    description:
      "Switch between test users with a single click. No credentials, no login forms, no friction. Just pure, immediate context switching.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Session Inspection",
    description:
      "View every piece of session data in real-time. Tokens, roles, permissions, metadata — everything laid bare for your inspection.",
    icon: Eye,
  },
  {
    number: "04",
    title: "Session Patching",
    description:
      "Edit approved session fields on-the-fly. Change roles, toggle permissions, test edge cases — all without leaving your browser.",
    icon: Settings,
  },
  {
    number: "05",
    title: "Role-Based Testing",
    description:
      "Multiple user templates with different roles and permission sets. Test your entire authorization matrix in minutes, not hours.",
    icon: Shield,
  },
  {
    number: "06",
    title: "Development-Only Safety",
    description:
      "Only activates when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk of shipping to production. Ever.",
    icon: Lock,
  },
];

const codeSnippet = `import { betterAuth } from "better-auth";
import { devTools } from "better-auth-devtools";

export const auth = betterAuth({
  plugins: [
    devTools({
      users: [
        { name: "Admin",  role: "admin",  email: "admin@dev.local" },
        { name: "Editor", role: "editor", email: "editor@dev.local" },
        { name: "Viewer", role: "viewer", email: "viewer@dev.local" },
      ],
    }),
  ],
});`;

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{ backgroundColor: "#C8A960", opacity: 0.4 }}
    />
  );
}

function SectionNumber({ children }: { children: string }) {
  return (
    <span
      className={`${playfair.className} block text-[7rem] leading-none font-light tracking-tight select-none`}
      style={{ color: "rgba(200, 169, 96, 0.12)" }}
    >
      {children}
    </span>
  );
}

export default function Page() {
  return (
    <div
      className={`${playfair.variable} ${sourceSans.variable} min-h-screen`}
      style={{ backgroundColor: "#FAFAF5" }}
    >
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "rgba(250, 250, 245, 0.85)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm tracking-wide transition-opacity duration-300 hover:opacity-60"
            style={{
              fontFamily: "var(--font-source-sans), sans-serif",
              color: "#1a1a1a",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          >
            <ArrowRight className="size-3 rotate-180" />
            View All Variations
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/C-W-D-Harshit/better-auth-devtools"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-300 hover:opacity-60"
              style={{ color: "#1a1a1a" }}
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://www.npmjs.com/package/better-auth-devtools"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="rounded-none border px-5 text-xs tracking-widest uppercase transition-all duration-400"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  backgroundColor: "#1a1a1a",
                  color: "#FAFAF5",
                  borderColor: "#1a1a1a",
                  letterSpacing: "0.12em",
                  fontSize: "0.65rem",
                }}
              >
                Install
              </Button>
            </a>
          </div>
        </div>
        <div
          className="h-px w-full"
          style={{ backgroundColor: "rgba(26, 26, 26, 0.08)" }}
        />
      </motion.nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-24 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4"
            >
              <div
                className="h-px w-12"
                style={{ backgroundColor: "#C8A960" }}
              />
              <span
                className="text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#C8A960",
                  letterSpacing: "0.2em",
                }}
              >
                Open Source Developer Tool
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              className={`${playfair.className} max-w-5xl text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] font-light tracking-tight`}
              style={{ color: "#1a1a1a" }}
            >
              Better Auth
              <br />
              <span className="italic" style={{ color: "#B8941F" }}>
                DevTools
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="max-w-lg text-lg leading-relaxed font-light"
              style={{
                fontFamily: "var(--font-source-sans), sans-serif",
                color: "#666",
                lineHeight: 1.8,
              }}
            >
              A dev-only DevTools panel for the Better Auth authentication
              framework. Managed test users, instant session switching, and
              real-time inspection — all vanishing before production.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-5 pt-4"
            >
              <a
                href="https://www.npmjs.com/package/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="group flex items-center gap-3 border px-8 py-3.5 text-xs tracking-widest uppercase transition-all duration-400 hover:gap-5"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    backgroundColor: "#1a1a1a",
                    color: "#FAFAF5",
                    borderColor: "#1a1a1a",
                    letterSpacing: "0.15em",
                  }}
                >
                  Get Started
                  <ArrowRight className="size-3.5 transition-transform duration-400 group-hover:translate-x-1" />
                </button>
              </a>
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border px-8 py-3.5 text-xs tracking-widest uppercase transition-all duration-400 hover:opacity-70"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#1a1a1a",
                  borderColor: "rgba(26, 26, 26, 0.2)",
                  letterSpacing: "0.15em",
                }}
              >
                <Github className="size-3.5" />
                View Source
              </a>
            </motion.div>

            {/* Install command */}
            <motion.div variants={fadeUp} className="pt-2">
              <code
                className="inline-block border px-4 py-2 text-sm font-light"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  color: "#999",
                  borderColor: "rgba(26, 26, 26, 0.1)",
                  backgroundColor: "rgba(26, 26, 26, 0.02)",
                }}
              >
                <span style={{ color: "#C8A960" }}>$</span> npm install
                better-auth-devtools
              </code>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative corner element */}
        <div
          className="absolute right-12 bottom-12 hidden lg:block"
          style={{ color: "rgba(200, 169, 96, 0.15)" }}
        >
          <span
            className={`${playfair.className} text-[12rem] leading-none font-light italic`}
          >
            &
          </span>
        </div>
      </section>

      {/* Gold Rule Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <GoldRule />
      </div>

      {/* The Story Section */}
      <section className="px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-16 lg:grid-cols-12"
          >
            {/* Left Column */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-4"
            >
              <SectionNumber>I</SectionNumber>
              <h2
                className={`${playfair.className} mt-4 text-4xl leading-tight font-light italic`}
                style={{ color: "#1a1a1a" }}
              >
                The Story
              </h2>
              <div
                className="mt-4 h-px w-16"
                style={{ backgroundColor: "#C8A960" }}
              />
            </motion.div>

            {/* Right Column */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-7 lg:col-start-6"
            >
              {/* Drop Cap Paragraph */}
              <p
                className="text-lg leading-[1.9] font-light"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#444",
                }}
              >
                <span
                  className={`${playfair.className} float-left mr-3 mt-1 text-6xl leading-[0.8] font-light`}
                  style={{ color: "#C8A960" }}
                >
                  E
                </span>
                very authentication library promises simplicity, yet testing
                remains an exercise in tedium. You create throwaway accounts,
                juggle credentials across browser tabs, and squint at
                localStorage to debug session state. The ceremony overwhelms the
                craft.
              </p>

              <p
                className="mt-8 text-lg leading-[1.9] font-light"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#444",
                }}
              >
                Better Auth DevTools dissolves this friction entirely. Install a
                single plugin, define your test personas, and a refined panel
                appears in your development environment — offering managed test
                users, instant session switching, and real-time inspection of
                every authentication detail. When you ship to production, it
                vanishes without a trace.
              </p>

              {/* Pull Quote */}
              <blockquote
                className="mt-12 border-l-2 pl-8"
                style={{ borderColor: "#C8A960" }}
              >
                <p
                  className={`${playfair.className} text-2xl leading-snug font-light italic`}
                  style={{ color: "#1a1a1a" }}
                >
                  "The best developer tools are the ones that feel like they
                  were always there — invisible until needed, indispensable once
                  discovered."
                </p>
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gold Rule Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <GoldRule />
      </div>

      {/* Features Section */}
      <section className="px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Section Header */}
            <motion.div variants={fadeUp} className="mb-20">
              <SectionNumber>II</SectionNumber>
              <h2
                className={`${playfair.className} mt-4 text-4xl leading-tight font-light italic`}
                style={{ color: "#1a1a1a" }}
              >
                The Instruments
              </h2>
              <div
                className="mt-4 h-px w-16"
                style={{ backgroundColor: "#C8A960" }}
              />
            </motion.div>

            {/* Feature Cards */}
            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.number}
                  variants={fadeUp}
                  className="group relative border-b p-8 transition-colors duration-400 hover:bg-white/60 lg:p-10"
                  style={{
                    borderColor: "rgba(26, 26, 26, 0.06)",
                    borderRight:
                      (i + 1) % 3 !== 0
                        ? "1px solid rgba(26, 26, 26, 0.06)"
                        : "none",
                  }}
                >
                  {/* Number */}
                  <span
                    className={`${playfair.className} block text-5xl font-light tracking-tight`}
                    style={{ color: "rgba(200, 169, 96, 0.25)" }}
                  >
                    {feature.number}
                  </span>

                  {/* Icon */}
                  <feature.icon
                    className="mt-6 size-5 transition-colors duration-400"
                    style={{ color: "#C8A960" }}
                    strokeWidth={1.5}
                  />

                  {/* Title */}
                  <h3
                    className={`${playfair.className} mt-4 text-xl font-light`}
                    style={{ color: "#1a1a1a" }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="mt-3 text-sm leading-relaxed font-light"
                    style={{
                      fontFamily: "var(--font-source-sans), sans-serif",
                      color: "#888",
                      lineHeight: 1.8,
                    }}
                  >
                    {feature.description}
                  </p>

                  {/* Hover accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
                    style={{ backgroundColor: "#C8A960" }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gold Rule Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <GoldRule />
      </div>

      {/* Code Showcase Section */}
      <section className="px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-16 lg:grid-cols-12"
          >
            {/* Left Column */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-4"
            >
              <SectionNumber>III</SectionNumber>
              <h2
                className={`${playfair.className} mt-4 text-4xl leading-tight font-light italic`}
                style={{ color: "#1a1a1a" }}
              >
                The Craft
              </h2>
              <div
                className="mt-4 h-px w-16"
                style={{ backgroundColor: "#C8A960" }}
              />

              <p
                className="mt-8 text-base leading-[1.9] font-light"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#666",
                }}
              >
                Integration is a matter of moments. A single plugin
                registration, a list of test personas, and the DevTools panel
                materializes in your development environment — ready to
                accelerate every authentication workflow.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Badge
                  className="rounded-none border px-3 py-1 text-xs tracking-wider uppercase"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    backgroundColor: "transparent",
                    color: "#C8A960",
                    borderColor: "rgba(200, 169, 96, 0.3)",
                    letterSpacing: "0.1em",
                    fontSize: "0.6rem",
                  }}
                >
                  Better Auth Plugin
                </Badge>
                <Badge
                  className="rounded-none border px-3 py-1 text-xs tracking-wider uppercase"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    backgroundColor: "transparent",
                    color: "#999",
                    borderColor: "rgba(26, 26, 26, 0.1)",
                    letterSpacing: "0.1em",
                    fontSize: "0.6rem",
                  }}
                >
                  TypeScript
                </Badge>
              </div>
            </motion.div>

            {/* Right Column - Code Block */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-7 lg:col-start-6"
            >
              <div
                className="relative border"
                style={{
                  borderColor: "rgba(26, 26, 26, 0.08)",
                  backgroundColor: "#FEFDFB",
                }}
              >
                {/* Code Header */}
                <div
                  className="flex items-center justify-between border-b px-6 py-3"
                  style={{ borderColor: "rgba(26, 26, 26, 0.06)" }}
                >
                  <span
                    className="text-xs tracking-wider uppercase"
                    style={{
                      fontFamily: "var(--font-source-sans), sans-serif",
                      color: "#bbb",
                      letterSpacing: "0.1em",
                      fontSize: "0.6rem",
                    }}
                  >
                    auth.ts
                  </span>
                  <div className="flex gap-1.5">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "rgba(200, 169, 96, 0.3)" }}
                    />
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "rgba(200, 169, 96, 0.2)" }}
                    />
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "rgba(200, 169, 96, 0.1)" }}
                    />
                  </div>
                </div>

                {/* Code Content */}
                <pre className="overflow-x-auto p-6">
                  <code
                    className="text-sm leading-[1.9]"
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      color: "#555",
                    }}
                  >
                    {codeSnippet.split("\n").map((line, i) => (
                      <span key={i} className="block">
                        <span
                          className="mr-6 inline-block w-4 text-right select-none"
                          style={{ color: "#ddd" }}
                        >
                          {i + 1}
                        </span>
                        {highlightCode(line)}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gold Rule Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <GoldRule />
      </div>

      {/* Testimonial / DX Quote Section */}
      <section className="px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionNumber>IV</SectionNumber>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative mt-8 max-w-4xl"
            >
              {/* Large quotation mark */}
              <span
                className={`${playfair.className} absolute -top-16 -left-8 text-[10rem] leading-none font-light select-none`}
                style={{ color: "rgba(200, 169, 96, 0.08)" }}
              >
                &ldquo;
              </span>

              <p
                className={`${playfair.className} relative z-10 text-3xl leading-snug font-light italic md:text-4xl lg:text-5xl`}
                style={{ color: "#1a1a1a", lineHeight: 1.3 }}
              >
                Developer experience isn&apos;t a feature — it&apos;s the
                foundation. When authentication testing becomes effortless, you
                build{" "}
                <span style={{ color: "#B8941F" }}>
                  better software, faster
                </span>
                .
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12">
              <div
                className="mx-auto mb-6 h-px w-12"
                style={{ backgroundColor: "#C8A960" }}
              />
              <p
                className="text-sm font-light tracking-wider uppercase"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#999",
                  letterSpacing: "0.15em",
                }}
              >
                The Better Auth DevTools Philosophy
              </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {[
                "Zero Config",
                "Type Safe",
                "Dev Only",
                "Plugin Architecture",
                "Session Management",
                "Role Testing",
              ].map((tag) => (
                <span
                  key={tag}
                  className="border px-4 py-1.5 text-xs font-light tracking-wider uppercase transition-all duration-400 hover:border-[#C8A960]/40"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    color: "#999",
                    borderColor: "rgba(26, 26, 26, 0.08)",
                    letterSpacing: "0.1em",
                    fontSize: "0.65rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gold Rule Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <GoldRule />
      </div>

      {/* CTA Section */}
      <section className="px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-16 lg:grid-cols-12"
          >
            <motion.div
              variants={fadeUp}
              className="lg:col-span-7"
            >
              <h2
                className={`${playfair.className} text-5xl leading-[1.1] font-light md:text-6xl lg:text-7xl`}
                style={{ color: "#1a1a1a" }}
              >
                Begin the
                <br />
                <span className="italic" style={{ color: "#B8941F" }}>
                  better
                </span>{" "}
                way.
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col justify-center gap-8 lg:col-span-4 lg:col-start-9"
            >
              <p
                className="text-base leading-[1.9] font-light"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#666",
                }}
              >
                Install in seconds. Configure in a minute. Transform your
                authentication development workflow permanently.
              </p>

              <div
                className="border p-4"
                style={{
                  borderColor: "rgba(26, 26, 26, 0.08)",
                  backgroundColor: "rgba(26, 26, 26, 0.02)",
                }}
              >
                <code
                  className="text-sm font-light"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    color: "#666",
                  }}
                >
                  <span style={{ color: "#C8A960" }}>$</span> npm install
                  better-auth-devtools
                </code>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 border px-6 py-3 text-xs tracking-widest uppercase transition-all duration-400 hover:gap-5"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    backgroundColor: "#1a1a1a",
                    color: "#FAFAF5",
                    borderColor: "#1a1a1a",
                    letterSpacing: "0.15em",
                  }}
                >
                  <Github className="size-3.5" />
                  GitHub
                  <ExternalLink className="size-3 transition-transform duration-400 group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 border px-6 py-3 text-xs tracking-widest uppercase transition-all duration-400 hover:opacity-70"
                  style={{
                    fontFamily: "var(--font-source-sans), sans-serif",
                    color: "#1a1a1a",
                    borderColor: "rgba(26, 26, 26, 0.15)",
                    letterSpacing: "0.15em",
                  }}
                >
                  <BookOpen className="size-3.5" />
                  Documentation
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <GoldRule />
          <div className="flex flex-col items-center justify-between gap-6 pt-8 sm:flex-row">
            <p
              className="text-xs font-light tracking-wider"
              style={{
                fontFamily: "var(--font-source-sans), sans-serif",
                color: "#bbb",
                letterSpacing: "0.1em",
              }}
            >
              Better Auth DevTools — Open Source
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.npmjs.com/package/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light tracking-wider uppercase transition-opacity duration-300 hover:opacity-60"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#bbb",
                  letterSpacing: "0.1em",
                  fontSize: "0.65rem",
                }}
              >
                npm
              </a>
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light tracking-wider uppercase transition-opacity duration-300 hover:opacity-60"
                style={{
                  fontFamily: "var(--font-source-sans), sans-serif",
                  color: "#bbb",
                  letterSpacing: "0.1em",
                  fontSize: "0.65rem",
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Minimal syntax highlighting */
function highlightCode(line: string): React.ReactNode {
  if (!line.trim()) {
    return <>{"\n"}</>;
  }

  const keywords = ["import", "export", "from", "const"];
  const tokens = line.split(/(\s+|[{}[\](),:"])/);

  return (
    <>
      {tokens.map((token, i) => {
        if (keywords.includes(token)) {
          return (
            <span key={i} style={{ color: "#B8941F" }}>
              {token}
            </span>
          );
        }
        if (token.startsWith('"') || token.startsWith("'")) {
          return (
            <span key={i} style={{ color: "#998060" }}>
              {token}
            </span>
          );
        }
        if (["{", "}", "[", "]", "(", ")"].includes(token)) {
          return (
            <span key={i} style={{ color: "#C8A960" }}>
              {token}
            </span>
          );
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
