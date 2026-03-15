"use client";

import { motion } from "motion/react";
import { Orbitron, IBM_Plex_Mono } from "next/font/google";
import {
  Cpu,
  Shield,
  Users,
  Zap,
  Eye,
  Settings,
  Terminal,
  Github,
  Lock,
  Activity,
  Radio,
  ArrowLeft,
  ChevronRight,
  Copy,
  Layers,
  ToggleLeft,
  Database,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

// ─── Reusable components ──────────────────────────────────────────────────────

function NeonBadge({
  children,
  color = "#00D4FF",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
      style={{
        color,
        border: `1px solid ${color}44`,
        background: `${color}10`,
        textShadow: `0 0 8px ${color}88`,
      }}
    >
      <span
        className="inline-block size-1.5 rounded-full animate-[neonPulse_2s_ease-in-out_infinite]"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      {children}
    </span>
  );
}

function GlowCard({
  children,
  className = "",
  glowColor = "#00D4FF",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className={`group relative overflow-hidden rounded-lg ${className}`}
    >
      {/* Animated gradient border */}
      <div
        className="absolute -inset-[1px] rounded-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-[borderSpin_4s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, ${glowColor}00, ${glowColor}, ${glowColor}00, ${glowColor}00)`,
        }}
      />
      <div
        className="relative rounded-lg p-5"
        style={{ background: "#0B0B1A" }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function StatusIndicator({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider"
      style={{ color }}
    >
      [<span className="animate-[neonPulse_2s_ease-in-out_infinite]">{label}</span>]
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CyberpunkLanding() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i better-auth-devtools");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${orbitron.variable} ${ibmPlexMono.variable} relative min-h-screen overflow-hidden`}
      style={{
        background:
          "linear-gradient(180deg, #050510 0%, #0B0B1A 30%, #050510 100%)",
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        color: "#C0C0E0",
      }}
    >
      {/* ── Inline Keyframes ─────────────────────────────────────────── */}
      <style>{`
        @keyframes neonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes borderSpin {
          to { rotate: 360deg; }
        }
        @keyframes glowFlicker {
          0%, 100% { text-shadow: 0 0 10px currentColor, 0 0 40px currentColor, 0 0 80px currentColor; }
          33% { text-shadow: 0 0 8px currentColor, 0 0 30px currentColor, 0 0 60px currentColor; }
          66% { text-shadow: 0 0 12px currentColor, 0 0 45px currentColor, 0 0 90px currentColor; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
        @keyframes dataStream {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes neonUnderline {
          0%, 100% { background-size: 0% 2px; }
          50% { background-size: 100% 2px; }
        }
        @keyframes holographic {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 10px #00D4FF55, 0 0 30px #00D4FF22; }
          50% { box-shadow: 0 0 20px #00D4FF88, 0 0 50px #00D4FF44; }
        }
      `}</style>

      {/* ── Background Effects ───────────────────────────────────────── */}
      {/* Grid */}
      <div
        className="pointer-events-none fixed inset-0 animate-[gridPulse_6s_ease-in-out_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #00D4FF 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Scanline */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.08) 2px, rgba(0,212,255,0.08) 4px)",
          animation: "scanline 8s linear infinite",
        }}
      />
      {/* Radial glow spots */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, #00D4FF22, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed right-0 top-1/3 h-[400px] w-[400px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, #FF00E522, transparent 70%)",
        }}
      />

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav className="relative z-40 flex items-center justify-between px-6 py-4 border-b border-[#00D4FF11]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs tracking-wider hover:text-[#00D4FF] transition-colors"
          style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
        >
          <ArrowLeft className="size-3.5" />
          View All Variations
        </Link>
        <div className="flex items-center gap-4">
          <StatusIndicator label="ONLINE" color="#00D4FF" />
          <StatusIndicator label="SECURE" color="#22C55E" />
          <StatusIndicator label="DEV" color="#FFE600" />
        </div>
      </nav>

      <main className="relative z-10">
        {/* ════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
            ════════════════════════════════════════════════════════════════ */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* HUD frame top */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <NeonBadge color="#8B5CF6">PLUGIN</NeonBadge>
              <NeonBadge color="#00D4FF">v1.0</NeonBadge>
              <NeonBadge color="#22C55E">ACTIVE</NeonBadge>
            </div>

            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none"
              style={{
                fontFamily: "var(--font-orbitron)",
                color: "#00D4FF",
                animation: "glowFlicker 3s ease-in-out infinite",
              }}
            >
              BETTER AUTH
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #FF00E5, #8B5CF6, #00D4FF)",
                  WebkitBackgroundClip: "text",
                  filter: "drop-shadow(0 0 30px #FF00E555)",
                }}
              >
                DEVTOOLS
              </span>
            </h1>

            {/* Animated neon underline */}
            <div className="mx-auto mt-3 h-[2px] w-64 overflow-hidden rounded-full">
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #00D4FF, #FF00E5, #00D4FF, transparent)",
                  backgroundSize: "200% 100%",
                  animation: "holographic 3s ease infinite",
                }}
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 max-w-2xl text-sm sm:text-base leading-relaxed"
            style={{ color: "#8888AA" }}
          >
            <span className="text-[#00D4FF]">&gt;_</span> An open-source,{" "}
            <span className="text-[#FFE600]">dev-only</span> DevTools panel for
            the{" "}
            <span className="text-[#FF00E5]">Better Auth</span>{" "}
            authentication framework. Managed test users, instant session
            switching, real-time inspection&mdash;all behind a safety switch.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
              <button
                className="group relative cursor-pointer overflow-hidden rounded-lg px-7 py-3 text-sm font-bold tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  background: "linear-gradient(135deg, #00D4FF, #8B5CF6)",
                  color: "#050510",
                  boxShadow:
                    "0 0 20px #00D4FF44, 0 0 60px #00D4FF22, inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Github className="size-4" />
                  VIEW SOURCE
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF00E5, #00D4FF)",
                  }}
                />
              </button>
            </Link>

            <button
              onClick={handleCopy}
              className="cursor-pointer flex items-center gap-3 rounded-lg border px-5 py-3 text-sm transition-all duration-300 hover:border-[#00D4FF66]"
              style={{
                fontFamily: "var(--font-ibm-plex-mono)",
                borderColor: "#ffffff15",
                background: "#0B0B1A",
                color: "#00D4FF",
              }}
            >
              <Terminal className="size-4" />
              npm i better-auth-devtools
              {copied ? (
                <Check className="size-3.5 text-[#22C55E]" />
              ) : (
                <Copy className="size-3.5 opacity-50" />
              )}
            </button>
          </motion.div>

          {/* HUD decorative corners */}
          <div className="pointer-events-none absolute left-8 top-20 opacity-20">
            <div className="h-16 w-[1px] bg-gradient-to-b from-[#00D4FF] to-transparent" />
            <div className="absolute top-0 h-[1px] w-16 bg-gradient-to-r from-[#00D4FF] to-transparent" />
          </div>
          <div className="pointer-events-none absolute right-8 top-20 opacity-20">
            <div className="h-16 w-[1px] bg-gradient-to-b from-[#FF00E5] to-transparent ml-auto" />
            <div className="absolute top-0 h-[1px] w-16 bg-gradient-to-l from-[#FF00E5] to-transparent" />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 2 — STATS BAR
            ════════════════════════════════════════════════════════════════ */}
        <section className="relative border-y border-[#00D4FF11] py-1">
          <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4">
            {[
              { value: "5", label: "API Endpoints", color: "#00D4FF" },
              { value: "3", label: "User Templates", color: "#FF00E5" },
              { value: "0", label: "Config in Prod", color: "#22C55E" },
              { value: "100%", label: "Type-Safe", color: "#FFE600" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-1 py-6 border-r last:border-r-0 border-[#ffffff08]"
              >
                <span
                  className="text-3xl sm:text-4xl font-black"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    color: stat.color,
                    textShadow: `0 0 20px ${stat.color}66`,
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#666688]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 3 — FEATURES (HUD PANELS)
            ════════════════════════════════════════════════════════════════ */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "#00D4FF" }}
              >
                &lt;system.modules&gt;
              </span>
              <h2
                className="mt-3 text-3xl sm:text-4xl font-black"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  color: "#E0E0FF",
                  textShadow: "0 0 30px #00D4FF33",
                }}
              >
                FEATURE MATRIX
              </h2>
              <span
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "#00D4FF" }}
              >
                &lt;/system.modules&gt;
              </span>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Managed Test Users",
                  desc: "Create disposable test users from pre-defined templates: Admin, Editor, and Viewer roles ready in milliseconds.",
                  status: "ACTIVE",
                  color: "#00D4FF",
                  statusColor: "#22C55E",
                },
                {
                  icon: Zap,
                  title: "Instant Session Switching",
                  desc: "Switch between test users with one click. No credentials needed. No login forms. Just instant context switching.",
                  status: "ACTIVE",
                  color: "#FF00E5",
                  statusColor: "#22C55E",
                },
                {
                  icon: Eye,
                  title: "Session Inspection",
                  desc: "View all current session data in real-time. Every token, every field, every timestamp — visible at a glance.",
                  status: "ACTIVE",
                  color: "#8B5CF6",
                  statusColor: "#22C55E",
                },
                {
                  icon: Settings,
                  title: "Session Patching",
                  desc: "Edit approved session fields on-the-fly. Change roles, permissions, and custom fields without re-authenticating.",
                  status: "ACTIVE",
                  color: "#FFE600",
                  statusColor: "#22C55E",
                },
                {
                  icon: Layers,
                  title: "Role-Based Testing",
                  desc: "Support for multiple user templates with different roles. Test every permission path in your application.",
                  status: "ACTIVE",
                  color: "#00D4FF",
                  statusColor: "#22C55E",
                },
                {
                  icon: Shield,
                  title: "Dev-Only Safety",
                  desc: "Only activates when NODE_ENV=development and DEV_AUTH_ENABLED=true. Zero risk of leaking into production.",
                  status: "LOCKED",
                  color: "#22C55E",
                  statusColor: "#FFE600",
                },
              ].map((feature, i) => (
                <GlowCard
                  key={feature.title}
                  glowColor={feature.color}
                  delay={i * 0.08}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex size-10 items-center justify-center rounded-md"
                      style={{
                        background: `${feature.color}12`,
                        border: `1px solid ${feature.color}33`,
                        boxShadow: `0 0 15px ${feature.color}22`,
                      }}
                    >
                      <feature.icon
                        className="size-5"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <NeonBadge color={feature.statusColor}>
                      {feature.status}
                    </NeonBadge>
                  </div>
                  <h3
                    className="text-sm font-bold tracking-wider mb-2"
                    style={{
                      fontFamily: "var(--font-orbitron)",
                      color: feature.color,
                      textShadow: `0 0 10px ${feature.color}44`,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#7777AA]">
                    {feature.desc}
                  </p>
                  {/* Bottom decorative line */}
                  <div
                    className="mt-4 h-[1px] w-full"
                    style={{
                      background: `linear-gradient(90deg, ${feature.color}33, transparent)`,
                    }}
                  />
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 4 — CODE BLOCK
            ════════════════════════════════════════════════════════════════ */}
        <section className="px-6 py-24 border-y border-[#00D4FF08]">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <span
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "#FF00E5" }}
              >
                &lt;init.sequence&gt;
              </span>
              <h2
                className="mt-3 text-3xl sm:text-4xl font-black"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  color: "#E0E0FF",
                  textShadow: "0 0 30px #FF00E533",
                }}
              >
                QUICK START
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-lg"
              style={{
                border: "1px solid #00D4FF22",
                boxShadow: "0 0 40px #00D4FF08, 0 0 80px #00D4FF04",
              }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-[#ffffff08]"
                style={{ background: "#080818" }}
              >
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="size-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="size-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-[10px] tracking-wider text-[#666688]">
                  auth.config.ts
                </span>
                <div className="ml-auto">
                  <NeonBadge color="#22C55E">READY</NeonBadge>
                </div>
              </div>

              {/* Code content */}
              <div className="p-5 overflow-x-auto" style={{ background: "#060614" }}>
                <pre className="text-[13px] leading-[1.8]" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                  <code>
                    <span style={{ color: "#8B5CF6" }}>import</span>{" "}
                    <span style={{ color: "#E0E0FF" }}>{"{ "}</span>
                    <span style={{ color: "#00D4FF" }}>betterAuth</span>
                    <span style={{ color: "#E0E0FF" }}>{" }"}</span>{" "}
                    <span style={{ color: "#8B5CF6" }}>from</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;better-auth&quot;</span>
                    <span style={{ color: "#666688" }}>;</span>
                    {"\n"}
                    <span style={{ color: "#8B5CF6" }}>import</span>{" "}
                    <span style={{ color: "#E0E0FF" }}>{"{ "}</span>
                    <span style={{ color: "#00D4FF" }}>devTools</span>
                    <span style={{ color: "#E0E0FF" }}>{" }"}</span>{" "}
                    <span style={{ color: "#8B5CF6" }}>from</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;better-auth-devtools&quot;</span>
                    <span style={{ color: "#666688" }}>;</span>
                    {"\n\n"}
                    <span style={{ color: "#8B5CF6" }}>export const</span>{" "}
                    <span style={{ color: "#FFE600" }}>auth</span>{" "}
                    <span style={{ color: "#FF00E5" }}>=</span>{" "}
                    <span style={{ color: "#00D4FF" }}>betterAuth</span>
                    <span style={{ color: "#E0E0FF" }}>({"{"}</span>
                    {"\n"}
                    {"  "}
                    <span style={{ color: "#555577" }}>{"// ... your existing config"}</span>
                    {"\n"}
                    {"  "}
                    <span style={{ color: "#FF00E5" }}>plugins</span>
                    <span style={{ color: "#E0E0FF" }}>: [</span>
                    {"\n"}
                    {"    "}
                    <span style={{ color: "#00D4FF" }}>devTools</span>
                    <span style={{ color: "#E0E0FF" }}>({"{"}</span>
                    {"\n"}
                    {"      "}
                    <span style={{ color: "#FF00E5" }}>templates</span>
                    <span style={{ color: "#E0E0FF" }}>: [</span>
                    {"\n"}
                    {"        "}
                    <span style={{ color: "#E0E0FF" }}>{"{"}</span>{" "}
                    <span style={{ color: "#FF00E5" }}>role</span>
                    <span style={{ color: "#E0E0FF" }}>:</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;admin&quot;</span>
                    <span style={{ color: "#E0E0FF" }}>,</span>{" "}
                    <span style={{ color: "#FF00E5" }}>name</span>
                    <span style={{ color: "#E0E0FF" }}>:</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;Test Admin&quot;</span>{" "}
                    <span style={{ color: "#E0E0FF" }}>{"}"}</span>
                    <span style={{ color: "#E0E0FF" }}>,</span>
                    {"\n"}
                    {"        "}
                    <span style={{ color: "#E0E0FF" }}>{"{"}</span>{" "}
                    <span style={{ color: "#FF00E5" }}>role</span>
                    <span style={{ color: "#E0E0FF" }}>:</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;editor&quot;</span>
                    <span style={{ color: "#E0E0FF" }}>,</span>{" "}
                    <span style={{ color: "#FF00E5" }}>name</span>
                    <span style={{ color: "#E0E0FF" }}>:</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;Test Editor&quot;</span>{" "}
                    <span style={{ color: "#E0E0FF" }}>{"}"}</span>
                    <span style={{ color: "#E0E0FF" }}>,</span>
                    {"\n"}
                    {"        "}
                    <span style={{ color: "#E0E0FF" }}>{"{"}</span>{" "}
                    <span style={{ color: "#FF00E5" }}>role</span>
                    <span style={{ color: "#E0E0FF" }}>:</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;viewer&quot;</span>
                    <span style={{ color: "#E0E0FF" }}>,</span>{" "}
                    <span style={{ color: "#FF00E5" }}>name</span>
                    <span style={{ color: "#E0E0FF" }}>:</span>{" "}
                    <span style={{ color: "#22C55E" }}>&quot;Test Viewer&quot;</span>{" "}
                    <span style={{ color: "#E0E0FF" }}>{"}"}</span>
                    <span style={{ color: "#E0E0FF" }}>,</span>
                    {"\n"}
                    {"      "}
                    <span style={{ color: "#E0E0FF" }}>],</span>
                    {"\n"}
                    {"    "}
                    <span style={{ color: "#E0E0FF" }}>{"}"}</span>
                    <span style={{ color: "#E0E0FF" }}>),</span>
                    {"\n"}
                    {"  "}
                    <span style={{ color: "#E0E0FF" }}>],</span>
                    {"\n"}
                    <span style={{ color: "#E0E0FF" }}>{"}"}</span>
                    <span style={{ color: "#E0E0FF" }}>);</span>
                  </code>
                </pre>
              </div>

              {/* Bottom bar */}
              <div
                className="flex items-center justify-between px-4 py-2 border-t border-[#ffffff08]"
                style={{ background: "#080818" }}
              >
                <div className="flex items-center gap-4">
                  <StatusIndicator label="TypeScript" color="#00D4FF" />
                  <StatusIndicator label="ESM" color="#8B5CF6" />
                </div>
                <span className="text-[10px] text-[#555577]">
                  better-auth-devtools@latest
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 5 — ARCHITECTURE DIAGRAM
            ════════════════════════════════════════════════════════════════ */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "#8B5CF6" }}
              >
                &lt;system.architecture&gt;
              </span>
              <h2
                className="mt-3 text-3xl sm:text-4xl font-black"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  color: "#E0E0FF",
                  textShadow: "0 0 30px #8B5CF633",
                }}
              >
                HOW IT WORKS
              </h2>
            </motion.div>

            {/* Flow diagram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center gap-0"
            >
              {/* Row 1: Single node */}
              <div className="flex justify-center">
                <ArchNode
                  icon={Terminal}
                  label="DevTools Panel"
                  sublabel="UI Component"
                  color="#00D4FF"
                />
              </div>

              {/* Connector: 1 to 3 */}
              <div className="relative flex w-full max-w-2xl items-start justify-center h-16">
                {/* Center vertical line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4" style={{ background: "linear-gradient(to bottom, #00D4FF66, #00D4FF33)" }} />
                {/* Horizontal line */}
                <div className="absolute top-4 left-[16.66%] right-[16.66%] h-[1px]" style={{ background: "linear-gradient(90deg, #FF00E533, #00D4FF66, #8B5CF633)" }} />
                {/* Three vertical drops */}
                <div className="absolute top-4 left-[16.66%] w-[1px] h-12" style={{ background: "linear-gradient(to bottom, #FF00E533, #FF00E566)" }} />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-12" style={{ background: "linear-gradient(to bottom, #00D4FF33, #00D4FF66)" }} />
                <div className="absolute top-4 right-[16.66%] w-[1px] h-12" style={{ background: "linear-gradient(to bottom, #8B5CF633, #8B5CF666)" }} />
                {/* Arrows */}
                <div className="absolute bottom-0 left-[16.66%] -translate-x-1/2 text-[#FF00E5] text-[10px]">&#9660;</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[#00D4FF] text-[10px]">&#9660;</div>
                <div className="absolute bottom-0 right-[16.66%] translate-x-1/2 text-[#8B5CF6] text-[10px]">&#9660;</div>
              </div>

              {/* Row 2: Three nodes */}
              <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
                <ArchNode
                  icon={Users}
                  label="Test Users"
                  sublabel="Create & Manage"
                  color="#FF00E5"
                />
                <ArchNode
                  icon={ToggleLeft}
                  label="Session Switch"
                  sublabel="Instant Swap"
                  color="#00D4FF"
                />
                <ArchNode
                  icon={Eye}
                  label="Inspector"
                  sublabel="Real-time View"
                  color="#8B5CF6"
                />
              </div>

              {/* Connector: 3 to 1 */}
              <div className="relative flex w-full max-w-2xl items-start justify-center h-16">
                <div className="absolute top-0 left-[16.66%] w-[1px] h-4" style={{ background: "#FF00E533" }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4" style={{ background: "#00D4FF33" }} />
                <div className="absolute top-0 right-[16.66%] w-[1px] h-4" style={{ background: "#8B5CF633" }} />
                <div className="absolute top-4 left-[16.66%] right-[16.66%] h-[1px]" style={{ background: "linear-gradient(90deg, #FF00E533, #22C55E66, #8B5CF633)" }} />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-12" style={{ background: "linear-gradient(to bottom, #22C55E33, #22C55E66)" }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[#22C55E] text-[10px]">&#9660;</div>
              </div>

              {/* Row 3: Single node */}
              <div className="flex justify-center">
                <ArchNode
                  icon={Database}
                  label="Better Auth Core"
                  sublabel="Plugin Integration"
                  color="#22C55E"
                />
              </div>

              {/* Connector: down */}
              <div className="relative h-12 flex justify-center">
                <div className="w-[1px] h-full" style={{ background: "linear-gradient(to bottom, #22C55E66, #FFE60066)" }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[#FFE600] text-[10px]">&#9660;</div>
              </div>

              {/* Row 4: Safety gate */}
              <div className="flex justify-center">
                <ArchNode
                  icon={Lock}
                  label="Safety Gate"
                  sublabel="NODE_ENV=development"
                  color="#FFE600"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 6 — CTA
            ════════════════════════════════════════════════════════════════ */}
        <section className="px-6 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs tracking-wider"
                style={{
                  border: "1px solid #FF00E533",
                  background: "#FF00E508",
                  color: "#FF00E5",
                }}
              >
                <Radio className="size-3 animate-[neonPulse_2s_ease-in-out_infinite]" />
                READY TO DEPLOY
              </div>

              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  color: "#E0E0FF",
                  textShadow: "0 0 40px #00D4FF22",
                }}
              >
                STOP LOGGING IN.
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #00D4FF, #FF00E5)",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  START BUILDING.
                </span>
              </h2>

              <p className="mt-6 text-sm text-[#7777AA] max-w-lg mx-auto leading-relaxed">
                Install the plugin, define your test users, and never type a test
                email and password again. Dev-only. Safe. Open source.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="https://github.com/C-W-D-Harshit/better-auth-devtools" target="_blank">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative cursor-pointer overflow-hidden rounded-lg px-8 py-4 text-sm font-bold tracking-widest"
                    style={{
                      fontFamily: "var(--font-orbitron)",
                      color: "#050510",
                    }}
                  >
                    {/* Animated gradient bg */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(270deg, #00D4FF, #FF00E5, #8B5CF6, #00D4FF)",
                        backgroundSize: "300% 300%",
                        animation: "holographic 4s ease infinite",
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Github className="size-4" />
                      GET STARTED
                      <ChevronRight className="size-4" />
                    </span>
                  </motion.button>
                </Link>

                {/* npm install card */}
                <div
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    border: "1px solid #00D4FF22",
                    boxShadow: "0 0 30px #00D4FF08",
                  }}
                >
                  <div
                    className="flex items-center gap-3 px-5 py-3.5"
                    style={{ background: "#0A0A1A" }}
                  >
                    <span className="text-[#00D4FF]">$</span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "#C0C0E0" }}
                    >
                      npm i better-auth-devtools
                    </span>
                    <button
                      onClick={handleCopy}
                      className="ml-2 cursor-pointer text-[#555577] hover:text-[#00D4FF] transition-colors"
                    >
                      {copied ? <Check className="size-3.5 text-[#22C55E]" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom HUD data readout */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-[10px] tracking-wider text-[#444466]">
                <span className="flex items-center gap-1.5">
                  <Activity className="size-3 text-[#00D4FF]" /> SYS.STATUS: NOMINAL
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="size-3 text-[#FF00E5]" /> PLUGIN.VERSION: 1.0.0
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="size-3 text-[#22C55E]" /> PROD.EXPOSURE: NONE
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="size-3 text-[#FFE600]" /> SAFETY.LOCK: ENGAGED
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#ffffff06] py-8 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#444466]">
          <div className="flex items-center gap-2">
            <div
              className="size-2 rounded-full animate-[neonPulse_2s_ease-in-out_infinite]"
              style={{ background: "#00D4FF", boxShadow: "0 0 8px #00D4FF" }}
            />
            <span style={{ fontFamily: "var(--font-orbitron)" }}>
              BETTER AUTH DEVTOOLS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/C-W-D-Harshit/better-auth-devtools"
              target="_blank"
              className="hover:text-[#00D4FF] transition-colors flex items-center gap-1"
            >
              <Github className="size-3" /> GitHub
            </Link>
            <span>|</span>
            <span>Open Source &middot; MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Architecture Node Component ──────────────────────────────────────────────

function ArchNode({
  icon: Icon,
  label,
  sublabel,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  sublabel: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex flex-col items-center gap-2 rounded-lg px-5 py-4 text-center"
        style={{
          background: "#0B0B1A",
          border: `1px solid ${color}33`,
          boxShadow: `0 0 20px ${color}15`,
          animation: "nodeGlow 3s ease-in-out infinite",
          ["--tw-shadow-color" as string]: color,
        }}
      >
        <Icon className="size-5" style={{ color }} />
        <span
          className="text-[11px] font-bold tracking-wider"
          style={{ fontFamily: "var(--font-orbitron)", color }}
        >
          {label}
        </span>
        <span className="text-[9px] tracking-wider text-[#555577]">
          {sublabel}
        </span>
      </div>
    </div>
  );
}
