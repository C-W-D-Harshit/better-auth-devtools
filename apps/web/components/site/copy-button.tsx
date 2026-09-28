"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

export function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return { copied, copy }
}

/** transitions.dev icon swap: copy and check share one slot. */
export function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <span
      aria-hidden
      className="t-icon-swap size-3.5"
      data-state={copied ? "b" : "a"}
    >
      <Copy className="t-icon size-3.5" data-icon="a" />
      <Check className="t-icon size-3.5 text-amber-300" data-icon="b" />
    </span>
  )
}

export const ICON_BUTTON_CLASS =
  "grid shrink-0 place-items-center rounded-md text-neutral-500 transition-[background-color,color,scale] duration-(--duration-quick) ease-out hover:bg-white/5 hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-amber-300/60 active:scale-(--scale-medium)"

export function CopyButton({
  text,
  label = "Copy code",
  className,
}: {
  text: string
  label?: string
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? "Copied" : label}
      className={cn(ICON_BUTTON_CLASS, "size-7", className)}
    >
      <CopyIcon copied={copied} />
    </button>
  )
}
