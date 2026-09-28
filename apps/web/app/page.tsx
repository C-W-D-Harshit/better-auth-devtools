import Image from "next/image"
import {
  BookOpen,
  Check,
  EyeOff,
  Gauge,
  KeyRound,
  Power,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react"

import { CodeBlock } from "@/components/site/code-block"
import { Faq } from "@/components/site/faq"
import { FeatureGrid } from "@/components/site/features"
import { Header } from "@/components/site/header"
import { GithubIcon, NpmIcon } from "@/components/site/icons"
import { InstallCommand } from "@/components/site/install-command"
import { LearnMore } from "@/components/site/learn-more"
import { ProductDemo } from "@/components/site/product-demo"
import { RequestFlow } from "@/components/site/request-flow"
import { RichText } from "@/components/site/rich-text"
import { HOME_PAGE, SITE } from "@/lib/site-content"
import { buildStructuredData, serializeJsonLd } from "@/lib/structured-data"

const SECURITY_ICONS = [Power, KeyRound, UserCheck, ShieldCheck, Gauge, EyeOff]

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <p className="font-mono text-xs tracking-[0.08em] text-amber-300/80 uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-white md:text-[2.75rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-pretty text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string
  children: React.ReactNode
  variant?: "primary" | "secondary"
}) {
  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
      className={
        variant === "primary"
          ? "inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-neutral-950 transition-[background-color,scale] duration-(--duration-quick) ease-out hover:bg-neutral-200 active:scale-(--scale-medium)"
          : "inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-neutral-200 transition-[background-color,border-color,scale] duration-(--duration-quick) ease-out hover:border-white/20 hover:bg-white/[0.04] active:scale-(--scale-medium)"
      }
    >
      {children}
    </a>
  )
}

function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden px-5 pt-20 md:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_0%,black,transparent)] bg-[size:64px_64px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.12] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <a
          href={SITE.npmUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ "--i": 0 } as React.CSSProperties}
          className="reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-3 pl-1 text-xs text-neutral-300 transition-colors hover:border-white/20"
        >
          <span className="rounded-full bg-amber-300 px-2 py-0.5 font-medium text-neutral-950">
            {SITE.license}
          </span>
          {HOME_PAGE.releaseLabel}
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">free and open source</span>
        </a>

        <h1
          id="hero-title"
          style={{ "--i": 1 } as React.CSSProperties}
          className="reveal-text mt-8 text-[2.75rem] leading-[1] font-semibold tracking-[-0.045em] text-balance text-white sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        >
          {HOME_PAGE.headlineLead}{" "}
          <span className="bg-gradient-to-b from-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            {HOME_PAGE.headlineTail}
          </span>
        </h1>

        <p
          style={{ "--i": 2 } as React.CSSProperties}
          className="reveal-text mx-auto mt-7 max-w-xl text-base leading-7 text-balance text-neutral-400 md:text-lg md:leading-8"
        >
          {HOME_PAGE.summary}
        </p>

        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="reveal mt-10 flex flex-col items-center gap-4"
        >
          <InstallCommand id="hero-install" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#install">
              <BookOpen aria-hidden className="size-4" />
              Setup guide
            </ButtonLink>
            <ButtonLink href={SITE.githubUrl} variant="secondary">
              <GithubIcon className="size-4" />
              Star on GitHub
            </ButtonLink>
          </div>
        </div>
      </div>

      <div
        style={{ "--i": 5 } as React.CSSProperties}
        className="reveal relative z-10 mx-auto mt-16 max-w-6xl md:mt-20"
      >
        <div className="stage grain relative rounded-[28px] border border-white/10 p-2.5 sm:p-6 md:p-12 lg:p-16">
          <div className="relative z-10">
            <ProductDemo />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-neutral-600">
          Interactive preview. Create a user, switch to it, or change its role.
        </p>
      </div>

      <dl className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-y-6 md:grid-cols-4">
        {HOME_PAGE.facts.map((fact) => (
          <div
            key={fact.label}
            className="border-l border-white/[0.08] px-5 first:border-l-0 md:first:border-l [&:nth-child(3)]:border-l-0 md:[&:nth-child(3)]:border-l"
          >
            <dt className="font-mono text-[11px] tracking-wide text-neutral-500 uppercase">
              {fact.label}
            </dt>
            <dd className="mt-1.5 text-[15px] font-medium text-neutral-100">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Comparison() {
  const { comparison } = HOME_PAGE
  return (
    <section aria-labelledby="comparison-title" className="px-5 pt-28 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <h2
          id="comparison-title"
          className="scroll-reveal mx-auto max-w-2xl text-center text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-white md:text-[2.75rem]"
        >
          {comparison.title}
        </h2>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="scroll-reveal flex flex-col">
            <p className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="size-1.5 rounded-full border border-neutral-600" />
              {comparison.before.label}
            </p>
            <h3 className="mt-3 text-xl font-medium tracking-tight text-neutral-500 md:text-2xl">
              {comparison.before.title}
            </h3>
            <ol className="mt-6 flex-1 space-y-2 rounded-2xl border border-white/[0.06] bg-[#0c0c0d] p-4 md:p-6">
              {comparison.before.items.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3.5 py-3 text-sm text-neutral-500"
                >
                  <span className="font-mono text-[11px] text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                  <X
                    aria-hidden
                    className="ml-auto size-3.5 text-neutral-700"
                  />
                </li>
              ))}
            </ol>
          </div>

          <div className="scroll-reveal flex flex-col">
            <p className="flex items-center gap-2 text-xs text-amber-200">
              <span className="size-1.5 rounded-full bg-amber-300" />
              {comparison.after.label}
            </p>
            <h3 className="mt-3 text-xl font-medium tracking-tight text-white md:text-2xl">
              {comparison.after.title}
            </h3>
            <ol className="stage grain relative mt-6 flex flex-1 flex-col justify-center gap-2 overflow-hidden rounded-2xl border border-amber-300/20 p-4 md:p-6">
              {comparison.after.items.map((item) => (
                <li
                  key={item}
                  className="relative z-10 flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-neutral-100 backdrop-blur-sm"
                >
                  <span className="grid size-4 shrink-0 place-items-center rounded-full bg-amber-300 text-neutral-950">
                    <Check aria-hidden className="size-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 px-5 pt-28 md:pt-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scroll-reveal">
          <SectionHeading
            id="features-title"
            eyebrow="Features"
            title={HOME_PAGE.features.title}
            description={HOME_PAGE.features.description}
          />
        </div>
        <div className="mt-14">
          <FeatureGrid />
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { flow } = HOME_PAGE
  return (
    <section
      id="how-it-works"
      aria-labelledby="flow-title"
      className="scroll-mt-20 px-5 pt-28 md:pt-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scroll-reveal">
          <SectionHeading
            id="flow-title"
            eyebrow="How it works"
            title={flow.title}
            description={flow.description}
          />
        </div>
        <div className="scroll-reveal mt-12">
          <RequestFlow />
        </div>
      </div>
    </section>
  )
}

function Install() {
  const { install } = HOME_PAGE
  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="scroll-mt-20 px-5 pt-28 md:pt-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scroll-reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="install-title"
            eyebrow="Install"
            title={install.title}
            description={`${install.subtitle} ${install.description}`}
          />
          <LearnMore
            href={SITE.agentGuideUrl}
            className="shrink-0 self-start md:self-auto"
          >
            Installing with a coding agent? Read the agent guide
          </LearnMore>
        </div>

        <ol className="relative mt-16 space-y-14 before:absolute before:top-3 before:bottom-3 before:left-[13px] before:w-px before:bg-gradient-to-b before:from-amber-300/50 before:via-white/10 before:to-transparent md:space-y-20">
          {install.steps.map((step, index) => (
            <li
              key={step.title}
              id={`step-${index + 1}`}
              className="scroll-reveal relative grid scroll-mt-24 items-start gap-6 pl-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 grid size-7 place-items-center rounded-full border border-amber-300/30 bg-[#09090b] font-mono text-xs text-amber-200"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-medium text-neutral-100">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-neutral-400">
                  <RichText text={step.description} />
                </p>
              </div>
              {step.kind === "install" ? (
                <InstallCommand id="step-install" className="max-w-none" />
              ) : (
                <CodeBlock
                  code={step.code}
                  language={step.language}
                  filename={step.filename}
                />
              )}
            </li>
          ))}
        </ol>

        <div className="scroll-reveal mt-20 grid gap-6 rounded-2xl border border-white/[0.07] bg-[#0c0c0d] p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:p-8">
          <div>
            <p className="font-mono text-xs tracking-[0.08em] text-amber-300/80 uppercase">
              Recipe
            </p>
            <h3 className="mt-3 text-xl font-medium text-neutral-100">
              {install.roles.title}
            </h3>
            <p className="mt-2 text-[15px] leading-7 text-neutral-400">
              <RichText text={install.roles.description} />
            </p>
            <LearnMore href={SITE.docsUrl} className="mt-5">
              Advanced hooks and all options
            </LearnMore>
          </div>
          <CodeBlock
            code={install.roles.code}
            language={install.roles.language}
            filename={install.roles.filename}
          />
        </div>
      </div>
    </section>
  )
}

function Security() {
  const { security } = HOME_PAGE
  return (
    <section
      id="security"
      aria-labelledby="security-title"
      className="scroll-mt-20 px-5 pt-28 md:pt-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scroll-reveal">
          <SectionHeading
            id="security-title"
            eyebrow="Security"
            title={security.title}
            description={security.description}
          />
        </div>
        <ul className="scroll-reveal mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {security.items.map((item, index) => {
            const Icon = SECURITY_ICONS[index]
            return (
              <li key={item} className="bg-[#09090b] p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-amber-300">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="font-mono text-[11px] text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-5 text-[15px] leading-6 text-neutral-300">
                  <RichText text={item} />
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-20 px-5 py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="md:sticky md:top-24 md:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title={HOME_PAGE.faq.title}
          />
          <p className="mt-4 text-[15px] leading-7 text-neutral-400">
            Something missing?{" "}
            <a
              href={SITE.issuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-200 underline decoration-white/20 underline-offset-4 hover:decoration-white/60"
            >
              Open an issue on GitHub
            </a>
            .
          </p>
        </div>
        <Faq />
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="px-5 pb-24 md:pb-32">
      <div className="stage grain scroll-reveal relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 px-6 py-20 text-center md:py-28">
        <div className="relative z-10">
          <h2
            id="cta-title"
            className="mx-auto max-w-2xl text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-white md:text-6xl"
          >
            {HOME_PAGE.callToAction.title}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-amber-50/70">
            {HOME_PAGE.callToAction.description}
          </p>
          <div className="mt-10 flex justify-center">
            <InstallCommand
              id="cta-install"
              className="border-white/15 bg-black/50 shadow-2xl shadow-black/40 backdrop-blur-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const links = [
    { href: SITE.docsUrl, label: "Documentation" },
    { href: SITE.changelogUrl, label: "Changelog" },
    { href: SITE.npmUrl, label: "npm" },
    { href: SITE.githubUrl, label: "GitHub" },
    { href: "/llms.txt", label: "llms.txt" },
  ]
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] px-5 pt-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/icon.svg" alt="" width={20} height={20} />
          <p className="text-sm text-neutral-500">
            <span className="text-neutral-300">{SITE.name}</span> v
            {SITE.version}. Built by{" "}
            <a
              href={SITE.author.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white"
            >
              {SITE.author.name}
            </a>
            . Not affiliated with{" "}
            <a
              href={SITE.betterAuthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white"
            >
              Better Auth
            </a>
            .
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-500">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-200"
                >
                  {link.label === "npm" ? <NpmIcon className="size-4" /> : null}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p
        aria-hidden
        className="pointer-events-none mt-10 -mb-[0.22em] [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.09),transparent_80%)] bg-clip-text text-center text-[19vw] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent select-none lg:text-[15rem]"
      >
        devtools
      </p>
    </footer>
  )
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildStructuredData()),
        }}
      />
      <Header />
      <main>
        <Hero />
        <Comparison />
        <Features />
        <HowItWorks />
        <Install />
        <Security />
        <FaqSection />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
