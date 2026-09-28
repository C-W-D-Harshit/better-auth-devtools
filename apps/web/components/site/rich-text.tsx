/** Renders `backtick` spans from site content as inline code. */
export function RichText({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/).map((part, index) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={index}
        className="rounded bg-white/[0.06] px-1 py-px font-mono text-[0.9em] text-neutral-200"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    )
  )
}
