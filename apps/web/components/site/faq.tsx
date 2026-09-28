"use client"

import { useState } from "react"

import { HOME_PAGE } from "@/lib/site-content"
import { RichText } from "./rich-text"

/** transitions.dev accordion (21-accordion.md); one item open at a time. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {HOME_PAGE.faq.items.map((item, index) => {
        const isOpen = open === index
        const headId = `faq-q-${index}`
        const panelId = `faq-a-${index}`
        return (
          <div key={item.question} className="t-acc" data-open={isOpen}>
            <h3>
              <button
                id={headId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-neutral-100 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300/60"
              >
                {item.question}
                <span aria-hidden className="t-acc-chevron text-neutral-500">
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6.5L8 10.5L12 6.5" />
                  </svg>
                </span>
              </button>
            </h3>
            {/* Collapsed answers stay in the HTML for crawlers but are inert for keyboard and screen readers. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headId}
              inert={!isOpen}
              className="t-acc-panel"
            >
              <div className="t-acc-panel-inner">
                <p className="max-w-2xl pb-6 text-[15px] leading-7 text-neutral-400">
                  <RichText text={item.answer} />
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
