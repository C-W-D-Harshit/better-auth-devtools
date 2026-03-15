"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

const variations = [
  {
    id: 1,
    title: "Brutalist / Raw Industrial",
    description:
      "Dark, monospace-heavy, exposed grid lines, terminal aesthetics, glitch effects, harsh contrasts.",
    colors: ["#0a0a0a", "#00ff41", "#ff3e3e"],
  },
  {
    id: 2,
    title: "Luxury / Editorial",
    description:
      "Cream backgrounds, serif typography, magazine layout, gold accents, dramatic whitespace.",
    colors: ["#FAFAF5", "#C8A960", "#1a1a1a"],
  },
  {
    id: 3,
    title: "Neon Cyberpunk",
    description:
      "Deep dark backgrounds, neon glow effects, HUD aesthetics, animated gradient borders.",
    colors: ["#050510", "#00D4FF", "#FF00E5"],
  },
  {
    id: 4,
    title: "Soft / Organic Pastel",
    description:
      "Warm pastels, floating blobs, glassmorphism, rounded shapes, friendly and inviting.",
    colors: ["#FFF5EE", "#FF8A80", "#B39DDB"],
  },
  {
    id: 5,
    title: "Geometric / Art Deco",
    description:
      "Dark navy, bold geometric patterns, condensed typography, angular elements, color blocking.",
    colors: ["#0D1117", "#F59E0B", "#3B82F6"],
    starred: true,
  },
]

const evolvedVariations = [
  {
    id: 6,
    title: "Monochrome Precision / Swiss Design",
    description:
      "Pure black & white with red accent only. Swiss typography, dramatic scale, extreme restraint.",
    colors: ["#000000", "#FFFFFF", "#E53935"],
  },
  {
    id: 7,
    title: "Blueprint / Technical Drawing",
    description:
      "Engineering blueprint aesthetic, dimension lines, technical annotations, schematic diagrams.",
    colors: ["#0A1628", "#A8D4FF", "#00E5FF"],
  },
  {
    id: 8,
    title: "Dark Glass / Vercel-Like Premium",
    description:
      "Premium dark UI with glass layers, gradient accents, subtle glows, Linear/Vercel quality.",
    colors: ["#09090B", "#8B5CF6", "#06B6D4"],
  },
  {
    id: 9,
    title: "Asymmetric Grid Poster",
    description:
      "Light theme, bold poster compositions, oversized type, vivid orange accent, grid-breaking layout.",
    colors: ["#F2F0ED", "#000000", "#FF4D00"],
  },
  {
    id: 10,
    title: "Terminal Dashboard / TUI",
    description:
      "Full terminal dashboard with panels, ASCII art, tree views, status bars, and typing effects.",
    colors: ["#000000", "#22C55E", "#F59E0B"],
  },
]

function VariationCard({
  v,
  i,
  showBadge,
}: {
  v: (typeof variations)[0] & { starred?: boolean }
  i: number
  showBadge?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
    >
      <Link
        href={`/${v.id}`}
        className="group flex items-center gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
      >
        <div className="flex shrink-0 items-center gap-2">
          {v.colors.map((color, ci) => (
            <div
              key={ci}
              className="size-5 rounded-full ring-1 ring-white/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-600">
              {v.id.toString().padStart(2, "0")}
            </span>
            <h2 className="text-base font-semibold text-white">{v.title}</h2>
            {v.starred && (
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
            )}
          </div>
          <p className="text-sm text-neutral-500">{v.description}</p>
        </div>

        <ArrowRight className="size-4 shrink-0 text-neutral-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
      </Link>
    </motion.div>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-[#09090b] text-white">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
            Better Auth DevTools
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Landing Page Variations
          </h1>
          <p className="mx-auto max-w-lg text-lg text-neutral-400">
            Ten unique design directions for the Better Auth DevTools landing
            page. Each showcases the same product with a completely different
            aesthetic.
          </p>
        </motion.div>

        {/* Original 5 */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-xs font-medium tracking-widest text-neutral-600 uppercase"
        >
          Round 1
        </motion.h3>
        <div className="mb-12 flex flex-col gap-3">
          {variations.map((v, i) => (
            <VariationCard key={v.id} v={v} i={i} />
          ))}
        </div>

        {/* Evolved 5 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-4 flex items-center gap-3"
        >
          <h3 className="text-xs font-medium tracking-widest text-neutral-600 uppercase">
            Round 2
          </h3>
          <span className="text-xs text-neutral-700">
            Evolved from #5
          </span>
        </motion.div>
        <div className="flex flex-col gap-3">
          {evolvedVariations.map((v, i) => (
            <VariationCard key={v.id} v={v} i={i + 5} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center text-xs text-neutral-600"
        >
          Press <kbd className="rounded bg-white/10 px-1.5 py-0.5">d</kbd> to
          toggle dark mode
        </motion.p>
      </div>
    </div>
  )
}
