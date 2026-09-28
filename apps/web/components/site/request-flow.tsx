"use client"

import { useRef } from "react"
import { useReducedMotion } from "motion/react"
import { AppWindow, Database, KeyRound } from "lucide-react"

import { AnimatedBeam } from "@/components/ui/animated-beam"
import { HOME_PAGE } from "@/lib/site-content"

const ICONS = [AppWindow, KeyRound, Database]

function Hop({ index }: { index: number }) {
  return (
    <span className="relative z-10 rounded-full border border-white/10 bg-[#0c0c0d] px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-neutral-500">
      {HOME_PAGE.flow.hops[index]}
    </span>
  )
}

function FlowNode({
  index,
  ref,
}: {
  index: number
  ref: React.Ref<HTMLDivElement>
}) {
  const node = HOME_PAGE.flow.nodes[index]
  const Icon = ICONS[index]
  return (
    <div
      ref={ref}
      className="relative z-10 flex w-full max-w-[220px] items-center gap-3 rounded-xl border border-white/10 bg-[#141416] p-3 shadow-lg shadow-black/40"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-amber-300/20 bg-amber-300/10 text-amber-300">
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-neutral-100">
          {node.label}
        </span>
        <span className="block truncate font-mono text-[11px] text-neutral-500">
          {node.detail}
        </span>
      </span>
    </div>
  )
}

export function RequestFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<HTMLDivElement>(null)
  const authRef = useRef<HTMLDivElement>(null)
  const dbRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const beam = {
    containerRef,
    pathColor: "#ffffff",
    pathOpacity: 0.08,
    pathWidth: 1.5,
    gradientStartColor: "#fcd34d",
    gradientStopColor: "#ea580c",
    duration: reduce ? 0 : 3,
    repeat: reduce ? 0 : Infinity,
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.07] bg-[#0c0c0d] bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px] px-6 py-10 md:flex-row md:gap-4 md:px-8"
    >
      <FlowNode index={0} ref={appRef} />
      <Hop index={0} />
      <FlowNode index={1} ref={authRef} />
      <Hop index={1} />
      <FlowNode index={2} ref={dbRef} />
      <AnimatedBeam {...beam} fromRef={appRef} toRef={authRef} />
      <AnimatedBeam
        {...beam}
        fromRef={authRef}
        toRef={dbRef}
        delay={reduce ? 0 : 0.4}
      />
    </div>
  )
}
