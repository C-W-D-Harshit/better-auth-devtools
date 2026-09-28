import { ChevronDown, Lock, MousePointer2 } from "lucide-react"

import { GlowingEffect } from "@/components/ui/glowing-effect"
import { HOME_PAGE } from "@/lib/site-content"
import { cn } from "@/lib/utils"
import { RichText } from "./rich-text"

/** Dashed guide lines that run past the illustration's edges, like a design canvas. */
function Frame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const line = "pointer-events-none absolute border-dashed border-white/[0.08]"
  const dot =
    "pointer-events-none absolute size-1.5 rounded-full border border-white/20 bg-[#0c0c0d]"
  return (
    <div
      aria-hidden
      className="relative grid h-44 place-items-center overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]"
    >
      <div className={cn("relative font-mono text-[11px]", className)}>
        <span className={cn(line, "-inset-x-[100vw] -top-2 border-t")} />
        <span className={cn(line, "-inset-x-[100vw] -bottom-2 border-b")} />
        <span className={cn(line, "-inset-y-[100vh] -left-2 border-l")} />
        <span className={cn(line, "-inset-y-[100vh] -right-2 border-r")} />
        <span className={cn(dot, "-top-[11px] -left-[11px]")} />
        <span className={cn(dot, "-top-[11px] -right-[11px]")} />
        <span className={cn(dot, "-bottom-[11px] -left-[11px]")} />
        <span className={cn(dot, "-right-[11px] -bottom-[11px]")} />
        {children}
      </div>
    </div>
  )
}

const chip =
  "rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-neutral-300"
const row =
  "flex items-center justify-between gap-6 rounded-md border border-white/[0.07] bg-[#111113] px-2.5 py-1.5"

function CreateIllustration() {
  return (
    <Frame className="w-56 space-y-2">
      <div className="flex gap-1.5">
        <span className={chip}>+ Admin</span>
        <span className={cn(chip, "border-amber-300/40 text-amber-200")}>
          + Editor
        </span>
        <span className={chip}>+ Viewer</span>
      </div>
      <div className={cn(row, "border-amber-300/20")}>
        <span className="min-w-0">
          <span className="block text-neutral-100">Editor</span>
          <span className="block truncate text-[10px] text-neutral-500">
            editor+x7q2@test.local
          </span>
        </span>
        <span className="rounded bg-amber-300/10 px-1.5 text-[10px] text-amber-200">
          new
        </span>
      </div>
    </Frame>
  )
}

function SwitchIllustration() {
  return (
    <Frame className="w-56 space-y-1.5">
      <div className={row}>
        <span className="text-neutral-100">Admin</span>
        <span className="flex items-center gap-1 text-[10px] text-amber-300">
          <span className="size-1 rounded-full bg-amber-300" />
          active
        </span>
      </div>
      <div className={row}>
        <span className="text-neutral-100">Viewer</span>
        <span className="relative rounded bg-amber-300 px-2 py-0.5 text-[10px] font-medium text-neutral-950">
          Switch
          <MousePointer2
            className="absolute -right-3 -bottom-3 size-4 fill-white text-neutral-950"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </Frame>
  )
}

function InspectIllustration() {
  return (
    <Frame className="w-56 leading-5 text-neutral-500">
      <div className="rounded-md border border-white/[0.07] bg-[#111113] px-3 py-2">
        {"{"}
        <div className="pl-3">
          <span className="text-neutral-300">role</span>:{" "}
          <span className="text-amber-200/90">&quot;editor&quot;</span>,
        </div>
        <div className="pl-3">
          <span className="text-neutral-300">emailVerified</span>:{" "}
          <span className="text-amber-200/90">true</span>,
        </div>
        <div className="pl-3">
          <span className="text-neutral-300">token</span>:{" "}
          <span className="rounded bg-white/[0.06] px-1 text-neutral-500">
            [redacted]
          </span>
        </div>
        {"}"}
      </div>
    </Frame>
  )
}

function EditIllustration() {
  const field = (label: string, value: string, active?: boolean) => (
    <div className="flex items-center justify-between gap-6">
      <span className="text-neutral-500">{label}</span>
      <span
        className={cn(
          "flex w-24 items-center justify-between rounded-md border bg-[#161618] px-2 py-1",
          active
            ? "border-amber-300/40 text-amber-100"
            : "border-white/10 text-neutral-200"
        )}
      >
        {value}
        <ChevronDown className="size-3 text-neutral-500" />
      </span>
    </div>
  )
  return (
    <Frame className="w-52 space-y-2">
      {field("role", "editor", true)}
      {field("plan", "pro")}
      {field("beta", "true")}
    </Frame>
  )
}

function ShareIllustration() {
  const people = ["JD", "MK", "AR", "SL"]
  return (
    <Frame className="flex w-[17rem] flex-col items-center gap-3">
      <div className="w-full rounded-md border border-white/[0.07] bg-[#111113] px-3 py-2 text-neutral-500">
        <span className="text-neutral-600">auth.ts</span>
        <div>
          <span className="text-neutral-300">templates</span>: {"{ "}
          <span className="text-amber-200/90">admin</span>,{" "}
          <span className="text-amber-200/90">editor</span>,{" "}
          <span className="text-amber-200/90">viewer</span>
          {" }"}
        </div>
      </div>
      <div className="flex items-center">
        {people.map((initials, index) => (
          <span
            key={initials}
            style={{ zIndex: people.length - index }}
            className="-ml-1.5 grid size-7 place-items-center rounded-full border-2 border-[#0c0c0d] bg-neutral-800 text-[9px] text-neutral-300 first:ml-0"
          >
            {initials}
          </span>
        ))}
        <span className="ml-2 text-[10px] text-neutral-500">same personas</span>
      </div>
    </Frame>
  )
}

function ProductionIllustration() {
  return (
    <Frame className="w-60 space-y-1.5">
      <div className={row}>
        <span className="text-neutral-400">
          NODE_ENV=<span className="text-neutral-100">development</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] text-amber-300">
          <span className="size-1 rounded-full bg-amber-300" />
          on
        </span>
      </div>
      <div className={cn(row, "border-dashed")}>
        <span className="text-neutral-400">
          NODE_ENV=<span className="text-neutral-100">production</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <Lock className="size-3" />
          off
        </span>
      </div>
    </Frame>
  )
}

const ILLUSTRATIONS = [
  CreateIllustration,
  SwitchIllustration,
  InspectIllustration,
  EditIllustration,
  ShareIllustration,
  ProductionIllustration,
]

export function FeatureGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {HOME_PAGE.features.items.map((feature, index) => {
        const Illustration = ILLUSTRATIONS[index]
        return (
          <li
            key={feature.title}
            className="scroll-reveal relative rounded-2xl border border-white/[0.07] p-1.5"
          >
            <GlowingEffect
              variant="amber"
              spread={40}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={1}
              disabled={false}
            />
            <div className="relative h-full overflow-hidden rounded-xl border border-white/[0.05] bg-[#0c0c0d]">
              <Illustration />
              <div className="p-5">
                <h3 className="text-[15px] font-medium text-neutral-100">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-neutral-400">
                  <RichText text={feature.description} />
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
