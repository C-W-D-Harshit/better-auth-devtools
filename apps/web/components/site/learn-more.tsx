import { cn } from "@/lib/utils"

/** transitions.dev learn more hover: the chevron opens into an arrow. */
export function LearnMore({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "t-learn inline-block text-sm font-medium text-amber-200 transition-colors hover:text-amber-100",
        className
      )}
    >
      {children}
      <span aria-hidden className="t-learn-chevron ml-1 align-[-2px]">
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
        >
          <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" />
          <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" />
        </svg>
      </span>
    </a>
  )
}
