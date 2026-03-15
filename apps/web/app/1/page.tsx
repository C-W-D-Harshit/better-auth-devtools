"use client";

import { useState, useEffect, useRef } from "react";
import { JetBrains_Mono } from "next/font/google";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Terminal,
  Shield,
  Users,
  Zap,
  Eye,
  Settings,
  ChevronRight,
  Github,
  Copy,
  Check,
  ArrowRight,
  Lock,
  RefreshCw,
} from "lucide-react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// ═══════════════════════════════════════════════════════════
// SCANLINE OVERLAY
// ═══════════════════════════════════════════════════════════

function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background:
          "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, rgba(0,255,65,0.03) 1px, transparent 1px, transparent 3px)",
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════
// TYPING ANIMATION HOOK
// ═══════════════════════════════════════════════════════════

function useTypingAnimation(text: string, speed = 60, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

// ═══════════════════════════════════════════════════════════
// COPY BUTTON
// ═══════════════════════════════════════════════════════════

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-[#555] hover:text-[#00ff41] transition-colors cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// TERMINAL WINDOW COMPONENT
// ═══════════════════════════════════════════════════════════

function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-[#222] bg-[#0a0a0a] rounded-none overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-[#222] px-4 py-2 bg-[#111]">
        <div className="flex gap-1.5">
          <div className="size-2.5 bg-[#ff3e3e]" />
          <div className="size-2.5 bg-[#ffaa00]" />
          <div className="size-2.5 bg-[#00ff41]" />
        </div>
        <span className="text-[#555] text-xs font-mono ml-2">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GLITCH TEXT
// ═══════════════════════════════════════════════════════════

function GlitchText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 z-0 text-[#ff3e3e] opacity-0"
        style={{
          animation: "glitch-1 3s infinite linear alternate-reverse",
          clipPath: "inset(20% 0 60% 0)",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 z-0 text-[#00ff41] opacity-0"
        style={{
          animation: "glitch-2 3s infinite linear alternate-reverse",
          clipPath: "inset(60% 0 10% 0)",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// FEATURE CARD
// ═══════════════════════════════════════════════════════════

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <TerminalWindow title={`feature_${String(index).padStart(2, "0")}.sh`}>
        <div className="flex items-start gap-3">
          <div className="border border-[#00ff41]/30 p-2 bg-[#00ff41]/5 shrink-0">
            <Icon className="size-5 text-[#00ff41]" />
          </div>
          <div>
            <div className="text-white uppercase tracking-[0.15em] text-xs font-bold mb-2">
              <span className="text-[#00ff41] mr-1">&gt;</span>
              {title}
            </div>
            <p className="text-[#666] text-xs leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </TerminalWindow>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// STEP COMPONENT
// ═══════════════════════════════════════════════════════════

function Step({
  number,
  title,
  description,
  index,
}: {
  number: string;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex gap-6 items-start group"
    >
      <div className="relative shrink-0">
        <div className="size-14 border-2 border-[#00ff41] bg-[#00ff41]/5 flex items-center justify-center font-mono text-[#00ff41] text-xl font-bold">
          {number}
        </div>
        {index < 3 && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-px h-12 bg-[#222] hidden md:block" />
        )}
      </div>
      <div className="pt-1">
        <h3 className="text-white uppercase tracking-[0.15em] text-sm font-bold mb-1">
          <span className="text-[#555] mr-2">$</span>
          {title}
        </h3>
        <p className="text-[#666] text-sm leading-relaxed font-mono">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════════

function Divider() {
  return (
    <div className="text-[#222] font-mono text-xs overflow-hidden select-none py-8">
      ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

const FEATURES = [
  {
    icon: Users,
    title: "MANAGED TEST USERS",
    description:
      "Create disposable test users from pre-defined templates — Admin, Editor, Viewer. No manual signup flows during development.",
  },
  {
    icon: Zap,
    title: "INSTANT SESSION SWITCHING",
    description:
      "Switch between test users with one click. No credentials needed. No logout/login dance. Just click and go.",
  },
  {
    icon: Eye,
    title: "SESSION INSPECTION",
    description:
      "View all current session data in real-time. Every field, every token, every timestamp — laid bare in a structured view.",
  },
  {
    icon: Settings,
    title: "SESSION PATCHING",
    description:
      "Edit approved session fields on-the-fly. Change roles, permissions, metadata without recreating users.",
  },
  {
    icon: Shield,
    title: "ROLE-BASED TESTING",
    description:
      "Multiple user templates with different roles baked in. Test your RBAC flows without maintaining separate test accounts.",
  },
  {
    icon: Lock,
    title: "DEV-ONLY SAFETY",
    description:
      "Only works when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero chance of shipping to production. Guaranteed.",
  },
];

const SERVER_CODE = `// auth.ts
import { betterAuth } from "better-auth";
import { devTools } from "better-auth-devtools";

export const auth = betterAuth({
  plugins: [
    devTools({
      enabled: process.env.NODE_ENV === "development",
      users: [
        { name: "Admin",  email: "admin@test.dev",  role: "admin"  },
        { name: "Editor", email: "editor@test.dev", role: "editor" },
        { name: "Viewer", email: "viewer@test.dev", role: "viewer" },
      ],
    }),
  ],
});`;

const CLIENT_CODE = `// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { devToolsClient } from "better-auth-devtools/client";

export const authClient = createAuthClient({
  plugins: [devToolsClient()],
});`;

const UI_CODE = `// app/layout.tsx
import { DevToolsPanel } from "better-auth-devtools/react";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <DevToolsPanel />
    </>
  );
}`;

const STEPS = [
  {
    number: "01",
    title: "INSTALL THE PACKAGE",
    description: "npm install better-auth-devtools — one dependency, zero config bloat.",
  },
  {
    number: "02",
    title: "ADD THE PLUGIN",
    description:
      "Drop devTools() into your Better Auth config. Define your test user templates.",
  },
  {
    number: "03",
    title: "MOUNT THE PANEL",
    description:
      "Add <DevToolsPanel /> to your layout. A floating panel appears in dev mode only.",
  },
  {
    number: "04",
    title: "START TESTING",
    description:
      "Switch users, inspect sessions, patch roles. All from a single panel. No context switching.",
  },
];

export default function BrutalistLandingPage() {
  const { displayed: heroText, done: heroDone } = useTypingAnimation(
    "better-auth-devtools",
    55,
    500
  );
  const [npmCopied, setNpmCopied] = useState(false);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const handleNpmCopy = () => {
    navigator.clipboard.writeText("npm install better-auth-devtools");
    setNpmCopied(true);
    setTimeout(() => setNpmCopied(false), 2500);
  };

  return (
    <div
      className={`${jetbrainsMono.variable} min-h-screen bg-[#0a0a0a] text-white selection:bg-[#00ff41]/20 selection:text-[#00ff41]`}
    >
      <Scanlines />

      {/* ═══ GLITCH KEYFRAMES ═══ */}
      <style>{`
        @keyframes glitch-1 {
          0% { opacity: 0; transform: translate(0); }
          20% { opacity: 0; }
          21% { opacity: 0.8; transform: translate(-2px, 1px); }
          23% { opacity: 0; transform: translate(0); }
          50% { opacity: 0; }
          51% { opacity: 0.6; transform: translate(2px, -1px); }
          53% { opacity: 0; transform: translate(0); }
          100% { opacity: 0; }
        }
        @keyframes glitch-2 {
          0% { opacity: 0; transform: translate(0); }
          40% { opacity: 0; }
          41% { opacity: 0.6; transform: translate(1px, 2px); }
          43% { opacity: 0; transform: translate(0); }
          70% { opacity: 0; }
          71% { opacity: 0.8; transform: translate(-1px, -2px); }
          73% { opacity: 0; transform: translate(0); }
          100% { opacity: 0; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes flicker {
          0% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.7; }
          94% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes scanmove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav className="border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[#555] hover:text-[#00ff41] text-xs font-mono transition-colors flex items-center gap-1"
            >
              <ChevronRight className="size-3 rotate-180" />
              View All Variations
            </Link>
            <div className="w-px h-4 bg-[#222]" />
            <span className="text-[#00ff41] text-xs font-mono tracking-wider">
              [VARIATION_01]
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/C-W-D-Harshit/better-auth-devtools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] hover:text-white transition-colors"
            >
              <Github className="size-4" />
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4">
        {/* ═══════════════════════════════════════════════════ */}
        {/* HERO SECTION                                       */}
        {/* ═══════════════════════════════════════════════════ */}
        <section ref={heroRef} className="pt-24 pb-12 md:pt-36 md:pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Terminal prompt line */}
            <div className="font-mono text-[#555] text-sm mb-6 flex items-center gap-2">
              <span className="text-[#00ff41]">$</span>
              <span>npx</span>
              <span className="text-[#00ff41]">create-devtools</span>
              <span>--init</span>
            </div>

            {/* Main title */}
            <h1
              className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none mb-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              <GlitchText>
                <span className="text-[#00ff41]">{heroText}</span>
                {!heroDone && (
                  <span
                    className="inline-block w-[3px] h-[1em] bg-[#00ff41] ml-1 align-middle"
                    style={{ animation: "blink 1s step-end infinite" }}
                  />
                )}
                {heroDone && (
                  <span
                    className="inline-block w-[3px] h-[1em] bg-[#00ff41] ml-1 align-middle"
                    style={{ animation: "blink 1s step-end infinite" }}
                  />
                )}
              </GlitchText>
            </h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              <p className="font-mono text-[#888] text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
                <span className="text-[#555]">/**</span> Open-source, dev-only
                DevTools panel for{" "}
                <span className="text-white border-b border-[#333]">
                  Better Auth
                </span>
                . Managed test users, instant session switching, real-time
                inspection.{" "}
                <span className="text-[#ff3e3e]">
                  Never ships to production.
                </span>{" "}
                <span className="text-[#555]">*/</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-8">
                <Badge
                  variant="outline"
                  className="rounded-none border-[#222] text-[#00ff41] bg-[#00ff41]/5 font-mono text-xs px-3 py-1 h-auto"
                >
                  <Terminal className="size-3 mr-1" />
                  OPEN SOURCE
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-none border-[#222] text-[#ff3e3e] bg-[#ff3e3e]/5 font-mono text-xs px-3 py-1 h-auto"
                >
                  <Shield className="size-3 mr-1" />
                  DEV ONLY
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-none border-[#222] text-[#888] font-mono text-xs px-3 py-1 h-auto"
                >
                  <Zap className="size-3 mr-1" />
                  BETTER AUTH PLUGIN
                </Badge>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-10">
                <div
                  className="border border-[#222] bg-[#111] px-4 py-2.5 font-mono text-sm flex items-center gap-3 cursor-pointer hover:border-[#00ff41]/30 transition-colors group"
                  onClick={handleNpmCopy}
                >
                  <span className="text-[#555]">$</span>
                  <span className="text-[#00ff41]">npm install</span>
                  <span className="text-white">better-auth-devtools</span>
                  <span className="text-[#555] group-hover:text-[#00ff41] transition-colors ml-2">
                    {npmCopied ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </span>
                </div>

                <a
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="rounded-none border-[#333] bg-transparent hover:bg-[#111] hover:border-[#555] font-mono text-xs tracking-wider h-auto py-2.5 px-4"
                  >
                    <Github className="size-3.5 mr-2" />
                    VIEW SOURCE
                    <ArrowRight className="size-3 ml-2" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        {/* ═══════════════════════════════════════════════════ */}
        {/* FEATURES GRID                                      */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="py-12">
          <div className="mb-10">
            <div className="font-mono text-[#555] text-xs mb-3 tracking-widest">
              {">>> SECTION::FEATURES"}
            </div>
            <h2
              className="font-mono text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-white"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              WHAT YOU GET
            </h2>
            <div className="w-24 h-px bg-[#00ff41] mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════════════════════════════════════════════ */}
        {/* CODE EXAMPLES                                      */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="py-12">
          <div className="mb-10">
            <div className="font-mono text-[#555] text-xs mb-3 tracking-widest">
              {">>> SECTION::SETUP"}
            </div>
            <h2
              className="font-mono text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-white"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              THREE FILES. THAT&apos;S IT.
            </h2>
            <div className="w-24 h-px bg-[#00ff41] mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            {/* Server config */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <TerminalWindow title="auth.ts — server plugin">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ff41] text-xs">
                      [01] SERVER
                    </span>
                    <span className="text-[#333]">|</span>
                    <span className="text-[#555] text-xs">
                      Plugin configuration
                    </span>
                  </div>
                  <CopyButton text={SERVER_CODE} />
                </div>
                <pre className="text-[#ccc] text-xs leading-relaxed overflow-x-auto">
                  <code>{SERVER_CODE}</code>
                </pre>
              </TerminalWindow>
            </motion.div>

            {/* Client config */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TerminalWindow title="lib/auth-client.ts — client plugin">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ff41] text-xs">
                      [02] CLIENT
                    </span>
                    <span className="text-[#333]">|</span>
                    <span className="text-[#555] text-xs">
                      Client-side setup
                    </span>
                  </div>
                  <CopyButton text={CLIENT_CODE} />
                </div>
                <pre className="text-[#ccc] text-xs leading-relaxed overflow-x-auto">
                  <code>{CLIENT_CODE}</code>
                </pre>
              </TerminalWindow>
            </motion.div>

            {/* UI mount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TerminalWindow title="app/layout.tsx — mount the panel">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ff41] text-xs">[03] UI</span>
                    <span className="text-[#333]">|</span>
                    <span className="text-[#555] text-xs">
                      Drop into your layout
                    </span>
                  </div>
                  <CopyButton text={UI_CODE} />
                </div>
                <pre className="text-[#ccc] text-xs leading-relaxed overflow-x-auto">
                  <code>{UI_CODE}</code>
                </pre>
              </TerminalWindow>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════════════════════════════════════════ */}
        {/* HOW IT WORKS                                       */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="py-12">
          <div className="mb-10">
            <div className="font-mono text-[#555] text-xs mb-3 tracking-widest">
              {">>> SECTION::PROCESS"}
            </div>
            <h2
              className="font-mono text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-white"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              HOW IT WORKS
            </h2>
            <div className="w-24 h-px bg-[#00ff41] mt-4" />
          </div>

          <div className="border border-[#222] bg-[#0d0d0d]">
            <div className="border-b border-[#222] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="size-3 text-[#555]" />
                <span className="text-[#555] text-xs font-mono">
                  process.workflow
                </span>
              </div>
              <span className="text-[#333] text-xs font-mono">
                4 steps
              </span>
            </div>
            <div className="p-6 md:p-10 space-y-10">
              {STEPS.map((step, i) => (
                <Step key={step.number} {...step} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════════════════════════════════════════ */}
        {/* CTA SECTION                                        */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="font-mono text-[#555] text-xs mb-6 tracking-widest">
              {">>> READY?"}
            </div>

            <h2
              className="font-mono text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                animation: "flicker 4s infinite",
              }}
            >
              <span className="text-[#00ff41]">STOP</span> WASTING TIME
              <br />
              ON AUTH TESTING
            </h2>

            <p className="font-mono text-[#666] text-sm max-w-lg mx-auto mb-10 leading-relaxed">
              One package. Three lines of config. Infinite time saved.
              <br />
              <span className="text-[#ff3e3e]">
                Dev-only. Always. No exceptions.
              </span>
            </p>

            {/* Big install command */}
            <div className="inline-block">
              <div
                className="border-2 border-[#00ff41]/30 bg-[#0a0a0a] px-6 md:px-10 py-4 font-mono text-base md:text-lg flex items-center gap-4 cursor-pointer hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all group"
                onClick={handleNpmCopy}
              >
                <span className="text-[#00ff41]">$</span>
                <span className="text-[#888]">npm install</span>
                <span className="text-white font-bold">
                  better-auth-devtools
                </span>
                <span className="text-[#555] group-hover:text-[#00ff41] transition-colors border-l border-[#333] pl-4 ml-2">
                  {npmCopied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <a
                href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#555] hover:text-[#00ff41] transition-colors flex items-center gap-1.5"
              >
                <Github className="size-3.5" />
                GITHUB
              </a>
              <span className="text-[#222]">|</span>
              <a
                href="https://www.npmjs.com/package/better-auth-devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#555] hover:text-[#00ff41] transition-colors flex items-center gap-1.5"
              >
                <Terminal className="size-3.5" />
                NPM
              </a>
            </div>
          </motion.div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-[#222] py-8 mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-[#444]">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff41]">&gt;</span>
              <span>better-auth-devtools</span>
              <span className="text-[#333]">|</span>
              <span>MIT License</span>
              <span className="text-[#333]">|</span>
              <span>dev-only, always</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#333]">
                ████████████████████████████████
              </span>
              <span className="text-[#555]">EOF</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
