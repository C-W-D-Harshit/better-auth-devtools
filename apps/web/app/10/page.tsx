"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "motion/react";
import { Fira_Code } from "next/font/google";
import Link from "next/link";
import {
  Terminal,
  Github,
  ExternalLink,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
  weight: ["300", "400", "500", "600", "700"],
});

/* ════════════════════════════════════════════════════════════════
   TYPING HOOK
   ════════════════════════════════════════════════════════════════ */

function useTypingEffect(text: string, speed = 40, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

/* ════════════════════════════════════════════════════════════════
   BLINKING CURSOR
   ════════════════════════════════════════════════════════════════ */

function Cursor({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <span
      className="inline-block"
      style={{
        animation: "blink 1s step-end infinite",
      }}
    >
      █
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════
   PANEL COMPONENT
   ════════════════════════════════════════════════════════════════ */

function Panel({
  title,
  children,
  className = "",
  titleRight,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
  delay?: number;
}) {
  const panelVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay },
    },
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={`border border-green-800/60 bg-black/80 ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-green-800/60 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-green-600">┤</span>
          <span className="text-xs font-semibold tracking-wider text-green-400 uppercase">
            {title}
          </span>
          <span className="text-green-600">├</span>
        </div>
        {titleRight && (
          <div className="text-xs text-green-700">{titleRight}</div>
        )}
      </div>
      {/* Content */}
      <div className="p-3">{children}</div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ASCII PROGRESS BAR
   ════════════════════════════════════════════════════════════════ */

function ProgressBar({
  label,
  percent,
  color = "text-green-400",
}: {
  label: string;
  percent: number;
  color?: string;
}) {
  const filled = Math.round((percent / 100) * 20);
  const empty = 20 - filled;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-green-600">{label}</span>
      <span className={color}>
        [{"█".repeat(filled)}
        {"░".repeat(empty)}]
      </span>
      <span className="text-green-500">{percent}%</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LOG LINE
   ════════════════════════════════════════════════════════════════ */

function LogLine({
  level,
  message,
  delay = 0,
}: {
  level: "INFO" | "WARN" | "OK" | "ERR";
  message: string;
  delay?: number;
}) {
  const colors = {
    INFO: "text-green-400",
    WARN: "text-amber-400",
    OK: "text-green-500",
    ERR: "text-red-400",
  };
  const bgColors = {
    INFO: "bg-green-400/10",
    WARN: "bg-amber-400/10",
    OK: "bg-green-500/10",
    ERR: "bg-red-400/10",
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay },
    },
  };

  return (
    <motion.div
      variants={lineVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex items-start gap-2 px-2 py-0.5 text-xs ${bgColors[level]}`}
    >
      <span className={`font-bold ${colors[level]}`}>[{level}]</span>
      <span className="text-green-300/80">{message}</span>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCAN LINE OVERLAY
   ════════════════════════════════════════════════════════════════ */

function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,0,0.1) 1px, rgba(0,255,0,0.1) 2px)",
        backgroundSize: "100% 2px",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */

export default function TerminalDashboardPage() {
  const { displayed: heroText, done: heroDone } = useTypingEffect(
    "Authentication testing, simplified.",
    45,
    800
  );

  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const i = setInterval(updateTime, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const formatUptime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* ── ASCII logo (compact version) ─────────────────────────── */
  const asciiLogo = `██████╗ ███████╗██╗   ██╗████████╗ ██████╗  ██████╗ ██╗     ███████╗
██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝
██║  ██║█████╗  ██║   ██║   ██║   ██║   ██║██║   ██║██║     ███████╗
██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██║   ██║██║   ██║██║     ╚════██║
██████╔╝███████╗ ╚████╔╝    ██║   ╚██████╔╝╚██████╔╝███████╗███████║
╚═════╝ ╚══════╝  ╚═══╝     ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝`;

  const asciiLogoSmall = `╔╦╗╔═╗╦  ╦╔╦╗╔═╗╔═╗╦  ╔═╗
 ║║║╣ ╚╗╔╝ ║ ║ ║║ ║║  ╚═╗
═╩╝╚═╝ ╚╝  ╩ ╚═╝╚═╝╩═╝╚═╝`;

  return (
    <div
      className={`${firaCode.variable} relative min-h-screen bg-black font-[family-name:var(--font-fira)] text-green-400`}
    >
      {/* Inject keyframes */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 4px rgba(74, 222, 128, 0.4); }
          50% { text-shadow: 0 0 12px rgba(74, 222, 128, 0.8), 0 0 24px rgba(74, 222, 128, 0.3); }
        }
        @keyframes scanmove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <ScanLines />

      {/* ─── TOP STATUS BAR ─────────────────────────────────── */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-green-800/60 bg-black/95 px-3 py-1 text-xs backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-green-500 transition-colors hover:text-green-300"
          >
            <Terminal className="size-3.5" />
          </Link>
          <span className="text-green-600">│</span>
          <span className="text-green-500 font-semibold">
            better-auth-devtools
          </span>
          <Badge className="h-4 rounded-none border border-green-700/50 bg-green-950/50 px-1.5 text-[10px] font-normal text-green-400">
            v0.1.1-alpha
          </Badge>
          <span className="text-green-600">│</span>
          <span className="text-green-700">
            NODE_ENV:{" "}
            <span className="text-green-400">development</span>
          </span>
          <span className="text-green-600">│</span>
          <span className="text-green-700">
            DEV_AUTH_ENABLED:{" "}
            <span className="text-green-400">true</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-700">
            UP {formatUptime(uptime)}
          </span>
          <span className="text-green-600">│</span>
          <span className="text-green-700">{time}</span>
          <span className="text-green-600">│</span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block size-1.5 rounded-full bg-green-500"
              style={{ animation: "glow 2s ease-in-out infinite" }}
            />
            <span className="font-semibold text-green-400">ONLINE</span>
          </span>
        </div>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-3 py-4">
        {/* ═══ PANEL 1: HEADER / ASCII LOGO ═══ */}
        <Panel title="system" titleRight="PID 1337 | TTY pts/0" delay={0}>
          {/* Large logo - hidden on small screens */}
          <pre className="hidden overflow-x-auto text-[0.45rem] leading-[1.1] text-green-500 md:block lg:text-[0.55rem]">
            {asciiLogo}
          </pre>
          {/* Small logo - shown on mobile */}
          <pre className="block overflow-x-auto text-[0.6rem] leading-[1.2] text-green-500 md:hidden">
            {asciiLogoSmall}
          </pre>

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-xs text-green-700">
              <span className="text-green-600">$</span>{" "}
              <span className="text-green-400">better-auth-devtools</span>{" "}
              <span className="text-green-700">--describe</span>
            </div>
          </div>
          <div className="mt-2 min-h-[1.5rem] text-sm text-green-300">
            <span className="text-green-600">&gt; </span>
            {heroText}
            <Cursor visible={!heroDone} />
          </div>
          <div className="mt-3 text-xs text-green-700">
            A Better Auth plugin for rapid auth development & testing.
            Create test users, switch sessions instantly, inspect & patch
            session data on-the-fly.
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="h-7 rounded-none border border-green-700/50 bg-green-500/10 px-3 text-xs font-normal text-green-400 hover:bg-green-500/20 hover:text-green-300"
              render={
                <a
                  href="https://www.npmjs.com/package/better-auth-devtools"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Package className="size-3" />
              npm install
            </Button>
            <Button
              className="h-7 rounded-none border border-green-700/50 bg-green-500/10 px-3 text-xs font-normal text-green-400 hover:bg-green-500/20 hover:text-green-300"
              render={
                <a
                  href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Github className="size-3" />
              View Source
            </Button>
          </div>
        </Panel>

        {/* ═══ TWO COLUMN: FEATURES + QUICK START ═══ */}
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {/* ── FEATURES PANEL (tree view) ── */}
          <Panel title="features" titleRight="6 modules loaded" delay={0.1}>
            <div className="space-y-0.5 text-xs">
              <TreeItem
                icon="📦"
                label="managed-users/"
                dim={false}
                indent={0}
                last={false}
              />
              <TreeItem
                icon=""
                label="Create disposable test users from templates"
                dim
                indent={1}
                last={false}
              />
              <TreeItem
                icon=""
                label="Admin, Editor, Viewer presets"
                dim
                indent={1}
                last
              />

              <TreeItem
                icon="⚡"
                label="session-switching/"
                dim={false}
                indent={0}
                last={false}
              />
              <TreeItem
                icon=""
                label="One-click switch, no credentials needed"
                dim
                indent={1}
                last
              />

              <TreeItem
                icon="🔍"
                label="session-inspect/"
                dim={false}
                indent={0}
                last={false}
              />
              <TreeItem
                icon=""
                label="View all session data in real-time"
                dim
                indent={1}
                last
              />

              <TreeItem
                icon="✏️"
                label="session-patch/"
                dim={false}
                indent={0}
                last={false}
              />
              <TreeItem
                icon=""
                label="Edit role, permissions on-the-fly"
                dim
                indent={1}
                last
              />

              <TreeItem
                icon="🛡️"
                label="role-templates/"
                dim={false}
                indent={0}
                last={false}
              />
              <TreeItem
                icon=""
                label="Multiple user templates with different roles"
                dim
                indent={1}
                last
              />

              <TreeItem
                icon="🔒"
                label="safety/"
                dim={false}
                indent={0}
                last={false}
              />
              <TreeItem
                icon=""
                label="NODE_ENV=development && DEV_AUTH_ENABLED=true"
                dim
                indent={1}
                last={false}
              />
              <TreeItem
                icon=""
                label="Zero production risk"
                dim
                indent={1}
                last
              />
            </div>

            <div className="mt-4 space-y-1">
              <ProgressBar label="DX Score" percent={98} />
              <ProgressBar
                label="Setup Time"
                percent={15}
                color="text-amber-400"
              />
              <ProgressBar label="Safety" percent={100} />
            </div>
          </Panel>

          {/* ── QUICK START PANEL ── */}
          <Panel title="quick-start" titleRight="bash" delay={0.15}>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-green-700"># 1. Install the package</div>
                <div className="mt-1 flex items-center gap-1 rounded-none border border-green-800/40 bg-green-950/30 px-2 py-1.5">
                  <span className="text-green-600">$</span>
                  <span className="text-green-300">
                    npm install better-auth-devtools
                  </span>
                </div>
              </div>

              <div>
                <div className="text-green-700">
                  # 2. Add to your Better Auth config
                </div>
                <div className="mt-1 border border-green-800/40 bg-green-950/30 px-2 py-1.5">
                  <div className="text-green-700">
                    {`// auth.config.ts`}
                  </div>
                  <div>
                    <span className="text-amber-400">import</span>{" "}
                    <span className="text-green-300">{`{ devTools }`}</span>{" "}
                    <span className="text-amber-400">from</span>{" "}
                    <span className="text-green-500">
                      {`"better-auth-devtools"`}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-amber-400">export const</span>{" "}
                    <span className="text-green-300">auth</span>{" "}
                    <span className="text-green-600">=</span>{" "}
                    <span className="text-green-400">{`betterAuth({`}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-green-500">plugins:</span>{" "}
                    <span className="text-green-400">[</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-green-300">{`devTools()`}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-green-400">]</span>
                  </div>
                  <div>
                    <span className="text-green-400">{`})`}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-green-700">
                  # 3. Set environment variables
                </div>
                <div className="mt-1 border border-green-800/40 bg-green-950/30 px-2 py-1.5">
                  <div className="text-green-700"># .env.local</div>
                  <div>
                    <span className="text-green-500">NODE_ENV</span>
                    <span className="text-green-600">=</span>
                    <span className="text-green-300">development</span>
                  </div>
                  <div>
                    <span className="text-green-500">DEV_AUTH_ENABLED</span>
                    <span className="text-green-600">=</span>
                    <span className="text-green-300">true</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 border-t border-green-800/40 pt-2">
                <LogLine level="OK" message="Plugin initialized" />
                <LogLine
                  level="INFO"
                  message="3 test user templates loaded"
                  delay={0.1}
                />
                <LogLine
                  level="INFO"
                  message="DevTools panel mounted at /_dev/auth"
                  delay={0.2}
                />
              </div>
            </div>
          </Panel>
        </div>

        {/* ═══ TWO COLUMN: CODE + ARCHITECTURE ═══ */}
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {/* ── CODE PANEL (vim-style) ── */}
          <Panel title="code" titleRight="auth.config.ts [+] UTF-8" delay={0.2}>
            <div className="text-xs">
              <div className="mb-2 flex items-center gap-2 text-green-700">
                <span className="border border-green-800/40 bg-green-950/40 px-1.5 py-0.5">
                  NORMAL
                </span>
                <span>auth.config.ts</span>
              </div>
              <div className="space-y-0 border border-green-800/40 bg-green-950/20">
                <CodeLine n={1} text={`import { betterAuth } from "better-auth"`} />
                <CodeLine
                  n={2}
                  text={`import { devTools } from "better-auth-devtools"`}
                />
                <CodeLine n={3} text="" />
                <CodeLine
                  n={4}
                  text={`export const auth = betterAuth({`}
                />
                <CodeLine n={5} text={`  plugins: [`} />
                <CodeLine
                  n={6}
                  text={`    devTools({`}
                  highlight
                />
                <CodeLine
                  n={7}
                  text={`      users: [`}
                  highlight
                />
                <CodeLine
                  n={8}
                  text={`        {`}
                  highlight
                />
                <CodeLine
                  n={9}
                  text={`          name: "Admin",`}
                  highlight
                />
                <CodeLine
                  n={10}
                  text={`          email: "admin@test.local",`}
                  highlight
                />
                <CodeLine
                  n={11}
                  text={`          role: "admin",`}
                  highlight
                />
                <CodeLine
                  n={12}
                  text={`        },`}
                  highlight
                />
                <CodeLine
                  n={13}
                  text={`        {`}
                  highlight
                />
                <CodeLine
                  n={14}
                  text={`          name: "Viewer",`}
                  highlight
                />
                <CodeLine
                  n={15}
                  text={`          email: "viewer@test.local",`}
                  highlight
                />
                <CodeLine
                  n={16}
                  text={`          role: "viewer",`}
                  highlight
                />
                <CodeLine
                  n={17}
                  text={`        },`}
                  highlight
                />
                <CodeLine
                  n={18}
                  text={`      ]`}
                  highlight
                />
                <CodeLine
                  n={19}
                  text={`    })`}
                  highlight
                />
                <CodeLine n={20} text={`  ]`} />
                <CodeLine n={21} text={`})`} />
              </div>
              <div className="mt-1 text-green-700">
                -- 21 lines, 432 bytes --
              </div>
            </div>
          </Panel>

          {/* ── ARCHITECTURE PANEL ── */}
          <Panel
            title="architecture"
            titleRight="system diagram"
            delay={0.25}
          >
            <pre className="overflow-x-auto text-[0.6rem] leading-relaxed text-green-500 sm:text-xs">
              {`┌─────────────────────────────────────┐
│          Your Next.js App            │
│                                      │
│  ┌─────────────┐  ┌──────────────┐  │
│  │  Frontend    │  │  API Routes  │  │
│  │  Components  │──│  /api/auth/* │  │
│  └──────┬──────┘  └──────┬───────┘  │
│         │                │           │
│  ┌──────┴────────────────┴───────┐  │
│  │       Better Auth Core        │  │
│  └──────────────┬────────────────┘  │
│                 │                    │
│  ┌──────────────┴────────────────┐  │
│  │    `}
              <span className="font-bold text-green-300">better-auth-devtools</span>
              {`      │  │
│  │  ┌──────┐┌───────┐┌───────┐   │  │
│  │  │Users ││Switch ││Patch  │   │  │
│  │  └──────┘└───────┘└───────┘   │  │
│  └───────────────────────────────┘  │
│                                      │
│  Guards: NODE_ENV === "development"  │
│          DEV_AUTH_ENABLED === true    │
└─────────────────────────────────────┘`}
            </pre>
          </Panel>
        </div>

        {/* ═══ FULL-WIDTH: SESSION DEMO ═══ */}
        <div className="mt-3">
          <Panel
            title="session-inspector"
            titleRight="LIVE | 3 active sessions"
            delay={0.3}
          >
            <div className="space-y-3 text-xs">
              {/* Log output */}
              <div className="space-y-0.5">
                <LogLine
                  level="INFO"
                  message="Session created for admin@test.local"
                  delay={0}
                />
                <LogLine
                  level="INFO"
                  message="Session created for editor@test.local"
                  delay={0.05}
                />
                <LogLine
                  level="INFO"
                  message="Session created for viewer@test.local"
                  delay={0.1}
                />
                <LogLine
                  level="WARN"
                  message="Session patched: viewer role → admin"
                  delay={0.15}
                />
                <LogLine
                  level="OK"
                  message="Active session switched to admin@test.local"
                  delay={0.2}
                />
              </div>

              {/* ASCII table */}
              <div className="overflow-x-auto">
                <pre className="text-green-500">
                  {`┌──────┬───────────────────────┬─────────┬──────────┬────────────┐
│  ID  │  Email                │  Role   │  Status  │  Session   │
├──────┼───────────────────────┼─────────┼──────────┼────────────┤
│  01  │  admin@test.local     │  admin  │`}{" "}
                  <span className="text-green-400">ACTIVE</span>
                  {`   │  a8f3...c2  │
│  02  │  editor@test.local    │  editor │`}{" "}
                  <span className="text-green-700">idle</span>
                  {`     │  b2e1...7f  │
│  03  │  viewer@test.local    │  viewer │`}{" "}
                  <span className="text-green-700">idle</span>
                  {`     │  c9d4...1a  │
└──────┴───────────────────────┴─────────┴──────────┴────────────┘`}
                </pre>
              </div>

              {/* Session detail view */}
              <div className="border border-green-800/40 bg-green-950/20 p-2">
                <div className="mb-1.5 text-green-600">
                  {`// Current session: admin@test.local`}
                </div>
                <div className="space-y-0.5">
                  <SessionField
                    field="session.id"
                    value='"a8f3e291...c2"'
                  />
                  <SessionField
                    field="session.userId"
                    value='"usr_01H8..."'
                  />
                  <SessionField
                    field="session.expiresAt"
                    value='"2026-03-16T14:30:00Z"'
                  />
                  <SessionField field="user.name" value='"Admin"' />
                  <SessionField
                    field="user.email"
                    value='"admin@test.local"'
                  />
                  <SessionField
                    field="user.role"
                    value='"admin"'
                    editable
                  />
                  <SessionField
                    field="user.permissions"
                    value='["read","write","delete"]'
                    editable
                  />
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* ═══ FULL-WIDTH: CAPABILITIES SUMMARY ═══ */}
        <div className="mt-3">
          <Panel
            title="capabilities"
            titleRight="system check"
            delay={0.35}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CapabilityCard
                title="Managed Test Users"
                desc="Disposable accounts from templates. Admin, Editor, Viewer ready out of the box."
                status="LOADED"
              />
              <CapabilityCard
                title="Instant Switching"
                desc="One-click session swap. No passwords, no login forms, no friction."
                status="LOADED"
              />
              <CapabilityCard
                title="Session Inspection"
                desc="Real-time view of all session data. Every field, every token, every timestamp."
                status="LOADED"
              />
              <CapabilityCard
                title="Session Patching"
                desc="Edit roles and permissions mid-session. Test edge cases instantly."
                status="LOADED"
              />
              <CapabilityCard
                title="Role Templates"
                desc="Pre-define user archetypes. Configure once, reuse forever."
                status="LOADED"
              />
              <CapabilityCard
                title="Dev-Only Safety"
                desc="Double-gated: NODE_ENV + DEV_AUTH_ENABLED. Cannot run in production."
                status="ENFORCED"
                statusColor="text-amber-400"
              />
            </div>
          </Panel>
        </div>

        {/* ═══ CTA SECTION ═══ */}
        <div className="mt-3">
          <Panel title="actions" titleRight="ready" delay={0.4}>
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="text-sm text-green-500">
                <span className="text-green-600">$</span> Ready to
                ship auth faster?
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  className="h-8 rounded-none border border-green-500/60 bg-green-500/15 px-4 text-xs font-semibold text-green-400 hover:bg-green-500/25 hover:text-green-300"
                  render={
                    <a
                      href="https://www.npmjs.com/package/better-auth-devtools"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Package className="size-3.5" />
                  npm install better-auth-devtools
                </Button>
                <Button
                  className="h-8 rounded-none border border-green-700/50 bg-transparent px-4 text-xs font-normal text-green-600 hover:bg-green-500/10 hover:text-green-400"
                  render={
                    <a
                      href="https://github.com/C-W-D-Harshit/better-auth-devtools"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Github className="size-3.5" />
                  GitHub
                  <ExternalLink className="size-3" />
                </Button>
              </div>
              <div className="mt-2 text-[10px] text-green-800">
                Open source under MIT license. Contributions welcome.
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ─── BOTTOM BAR (tmux-style) ─────────────────────────── */}
      <div className="sticky bottom-0 z-40 mt-4 flex items-center justify-between border-t border-green-800/60 bg-black/95 px-3 py-1 text-[10px] backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="border border-green-700/50 bg-green-950/60 px-1.5 py-0.5 text-green-400">
            F1
          </span>
          <span className="text-green-700">Features</span>
          <span className="border border-green-700/50 bg-green-950/60 px-1.5 py-0.5 text-green-400">
            F2
          </span>
          <span className="text-green-700">Code</span>
          <span className="border border-green-700/50 bg-green-950/60 px-1.5 py-0.5 text-green-400">
            F3
          </span>
          <span className="text-green-700">Install</span>
          <span className="border border-green-700/50 bg-green-950/60 px-1.5 py-0.5 text-green-400">
            F4
          </span>
          <span className="text-green-700">GitHub</span>
        </div>
        <div className="flex items-center gap-2 text-green-700">
          <span>better-auth-devtools</span>
          <span className="text-green-800">│</span>
          <span>
            <span className="text-green-600">q</span>: quit
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TREE ITEM
   ════════════════════════════════════════════════════════════════ */

function TreeItem({
  icon,
  label,
  dim,
  indent,
  last,
}: {
  icon: string;
  label: string;
  dim: boolean;
  indent: number;
  last: boolean;
}) {
  const prefix =
    indent === 0
      ? "├── "
      : last
        ? "│   └── "
        : "│   ├── ";

  return (
    <div
      className={`flex items-start gap-1 ${dim ? "text-green-700" : "text-green-400"}`}
    >
      <span className="text-green-600 select-none whitespace-pre">
        {prefix}
      </span>
      {icon && <span className="select-none">{icon}</span>}
      <span>{label}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CODE LINE (vim-style)
   ════════════════════════════════════════════════════════════════ */

function CodeLine({
  n,
  text,
  highlight = false,
}: {
  n: number;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex ${highlight ? "bg-green-500/5" : ""}`}
    >
      <span className="w-8 shrink-0 select-none border-r border-green-800/30 pr-2 text-right text-[10px] text-green-800">
        {n}
      </span>
      <span className="pl-2 text-xs text-green-400 whitespace-pre">
        {text || " "}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SESSION FIELD
   ════════════════════════════════════════════════════════════════ */

function SessionField({
  field,
  value,
  editable = false,
}: {
  field: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="min-w-[160px] text-green-700">{field}:</span>
      <span className="text-green-400">{value}</span>
      {editable && (
        <span className="ml-1 border border-amber-500/30 bg-amber-500/10 px-1 py-px text-[9px] text-amber-400">
          EDITABLE
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CAPABILITY CARD
   ════════════════════════════════════════════════════════════════ */

function CapabilityCard({
  title,
  desc,
  status,
  statusColor = "text-green-400",
}: {
  title: string;
  desc: string;
  status: string;
  statusColor?: string;
}) {
  return (
    <div className="border border-green-800/40 bg-green-950/20 p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-green-400">{title}</span>
        <span
          className={`text-[9px] font-bold ${statusColor}`}
          style={{ animation: "glow 3s ease-in-out infinite" }}
        >
          [{status}]
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-green-700">
        {desc}
      </p>
    </div>
  );
}
