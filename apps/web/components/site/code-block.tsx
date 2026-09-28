import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

export async function CodeBlock({
  code,
  language,
  filename,
  className,
}: {
  code: string
  language: string
  filename: string
  className?: string
}) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "vesper",
    colorReplacements: { "#101010": "transparent" },
  })

  return (
    <figure
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f0f10]",
        className
      )}
    >
      <figcaption className="flex h-10 items-center justify-between border-b border-white/[0.06] pr-1.5 pl-4">
        <span className="font-mono text-xs text-neutral-500">{filename}</span>
        <CopyButton text={code} label={`Copy ${filename}`} />
      </figcaption>
      <div
        className="overflow-x-auto p-4 font-mono text-[13px] leading-6 [&_pre]:!bg-transparent [&_pre]:outline-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
