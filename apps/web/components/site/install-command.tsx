"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react"

import { HOME_PAGE } from "@/lib/site-content"
import { BLUR, DISTANCE, DURATION, EASE_SMOOTH_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { CopyIcon, ICON_BUTTON_CLASS, useCopy } from "./copy-button"

const COMMANDS = HOME_PAGE.installCommands

export function InstallCommand({
  id,
  className,
}: {
  id: string
  className?: string
}) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { copied, copy } = useCopy()
  const reduce = useReducedMotion()
  const command = COMMANDS[active].command

  // Arrow keys move between tabs without animation delay, as the ARIA tabs pattern expects.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? COMMANDS.length - 1
          : step !== undefined
            ? (active + step + COMMANDS.length) % COMMANDS.length
            : null
    if (target === null) return
    event.preventDefault()
    setActive(target)
    tabRefs.current[target]?.focus()
  }

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#0f0f10] text-left",
          className
        )}
      >
        <div
          role="tablist"
          aria-label="Package manager"
          onKeyDown={onKeyDown}
          className="flex gap-1 border-b border-white/[0.06] px-2 pt-2"
        >
          {COMMANDS.map((item, index) => (
            <button
              key={item.manager}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              id={`${id}-tab-${item.manager}`}
              type="button"
              role="tab"
              tabIndex={index === active ? 0 : -1}
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              onClick={() => setActive(index)}
              className={cn(
                "relative px-2.5 pb-2 font-mono text-xs transition-colors duration-(--duration-fast) ease-smooth-out focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-amber-300/60",
                index === active
                  ? "text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {item.manager}
              {index === active && (
                // transitions.dev "tabs sliding": 250ms on the smooth-out curve.
                <m.span
                  layoutId={`${id}-underline`}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: DURATION.fast, ease: EASE_SMOOTH_OUT }
                  }
                  className="absolute inset-x-1 -bottom-px h-px bg-amber-300"
                />
              )}
            </button>
          ))}
        </div>
        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${COMMANDS[active].manager}`}
          className="flex items-center gap-3 py-2 pr-2 pl-4"
        >
          <span aria-hidden className="font-mono text-sm text-amber-300/70">
            $
          </span>
          <span className="min-w-0 flex-1 truncate">
            {/* transitions.dev "text states swap": out up, in from below. */}
            <AnimatePresence mode="wait" initial={false}>
              <m.code
                key={command}
                initial={{
                  opacity: 0,
                  y: reduce ? 0 : DISTANCE.micro,
                  filter: reduce ? BLUR.none : BLUR.small,
                }}
                animate={{ opacity: 1, y: 0, filter: BLUR.none }}
                exit={{
                  opacity: 0,
                  y: reduce ? 0 : -DISTANCE.micro,
                  filter: reduce ? BLUR.none : BLUR.small,
                }}
                transition={{
                  duration: reduce ? 0 : DURATION.quick,
                  ease: "easeInOut",
                }}
                className="block truncate font-mono text-sm text-neutral-100"
              >
                {command}
              </m.code>
            </AnimatePresence>
          </span>
          <button
            type="button"
            onClick={() => copy(command)}
            aria-label={copied ? "Copied" : `Copy ${command}`}
            className={cn(ICON_BUTTON_CLASS, "size-8")}
          >
            <CopyIcon copied={copied} />
          </button>
        </div>
      </div>
    </LazyMotion>
  )
}
