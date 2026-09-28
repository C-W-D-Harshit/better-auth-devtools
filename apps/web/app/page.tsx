import Image from "next/image"
import {
  ArrowRightLeft,
  ArrowUpRight,
  BookOpen,
  Eye,
  Lock,
  PencilLine,
  UserPlus,
  Users,
} from "lucide-react"

import { CodeBlock } from "@/components/site/code-block"
import { Faq } from "@/components/site/faq"
import { Header } from "@/components/site/header"
import { GithubIcon, NpmIcon } from "@/components/site/icons"
import { InstallCommand } from "@/components/site/install-command"
import { ProductDemo } from "@/components/site/product-demo"
import { RichText } from "@/components/site/rich-text"
import { Spotlight } from "@/components/ui/spotlight"
import { HOME_PAGE, SITE } from "@/lib/site-content"
import { buildStructuredData, serializeJsonLd } from "@/lib/structured-data"

const FEATURE_ICONS = [UserPlus, ArrowRightLeft, Eye, PencilLine, Users, Lock]

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs tracking-[0.08em] text-amber-300/80 uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.025em] text-balance text-white md:text-4xl"
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
      target="_blank"
      rel="noopener noreferrer"
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
      className="relative overflow-hidden px-5 pt-20 pb-16 md:pt-28"
    >
      <Spotlight
        className="-top-40 left-0 md:-top-24 md:left-40"
        fill="#fcd34d"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent)] bg-[size:56px_56px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <a
          href={SITE.npmUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ "--i": 0 } as React.CSSProperties}
          className="reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-2.5 pl-3 text-xs text-neutral-300 transition-colors hover:border-white/20"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-amber-300" />
          {HOME_PAGE.releaseLabel}
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">free and open source</span>
        </a>

        <h1
          id="hero-title"
          style={{ "--i": 1 } as React.CSSProperties}
          className="reveal-text mt-7 text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-white sm:text-5xl md:text-6xl"
        >
          {HOME_PAGE.headline}
        </h1>

        <p
          style={{ "--i": 2 } as React.CSSProperties}
          className="reveal-text mx-auto mt-6 max-w-xl text-base leading-7 text-balance text-neutral-400 md:text-lg md:leading-8"
        >
          {HOME_PAGE.summary}
        </p>

        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="reveal mt-9 flex flex-col items-center gap-4"
        >
          <InstallCommand id="hero-install" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#install">
              <BookOpen aria-hidden className="size-4" />
              Setup guide
            </ButtonLink>
            <ButtonLink href={SITE.githubUrl} variant="secondary">
              <GithubIcon className="size-4" />
              View on GitHub
            </ButtonLink>
          </div>
        </div>
      </div>

      <div
        style={{ "--i": 5 } as React.CSSProperties}
        className="reveal relative z-10 mx-auto mt-16 max-w-5xl"
      >
        <ProductDemo />
        <p className="mt-4 text-center text-xs text-neutral-600">
          Interactive preview. Create a user, switch to it, or change its role.
        </p>
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section aria-label="Package facts" className="px-5">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
        {HOME_PAGE.facts.map((fact) => (
          <div key={fact.label} className="bg-[#09090b] px-5 py-4">
            <dt className="text-xs text-neutral-500">{fact.label}</dt>
            <dd className="mt-1 text-sm font-medium text-neutral-200">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 px-5 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title={HOME_PAGE.features.title}
          description={HOME_PAGE.features.description}
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {HOME_PAGE.features.items.map((feature, index) => {
            const Icon = FEATURE_ICONS[index]
            return (
              <li
                key={feature.title}
                className="bg-[#09090b] p-7 transition-colors hover:bg-[#0d0d0f]"
              >
                <Icon aria-hidden className="size-5 text-amber-300" />
                <h3 className="mt-5 text-[15px] font-medium text-neutral-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  <RichText text={feature.description} />
                </p>
              </li>
            )
          })}
        </ul>
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
      className="scroll-mt-20 border-t border-white/[0.07] px-5 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="install-title"
          eyebrow="Install"
          title={install.title}
          description={`${install.subtitle} ${install.description}`}
        />

        <ol className="mt-14 space-y-12 md:space-y-16">
          {install.steps.map((step, index) => (
            <li
              key={step.title}
              id={`step-${index + 1}`}
              className="grid scroll-mt-24 items-start gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12"
            >
              <div className="flex gap-4">
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-white/15 font-mono text-xs text-neutral-300"
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

        <div className="mt-20 grid gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:p-8">
          <div>
            <h3 className="text-lg font-medium text-neutral-100">
              {install.roles.title}
            </h3>
            <p className="mt-2 text-[15px] leading-7 text-neutral-400">
              <RichText text={install.roles.description} />
            </p>
            <a
              href={SITE.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm text-amber-200 underline decoration-amber-200/30 underline-offset-4 hover:decoration-amber-200"
            >
              Advanced hooks and all options
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
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
      className="scroll-mt-20 border-t border-white/[0.07] px-5 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <SectionHeading
          id="security-title"
          eyebrow="Security"
          title={security.title}
          description={security.description}
        />
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {security.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 py-4 text-[15px] leading-6 text-neutral-300"
            >
              <Lock
                aria-hidden
                className="mt-1 size-3.5 shrink-0 text-amber-300/80"
              />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
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
      className="scroll-mt-20 border-t border-white/[0.07] px-5 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
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
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/[0.08] px-6 py-16 text-center md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(252,211,77,0.09),transparent)]"
        />
        <div className="relative">
          <h2
            id="cta-title"
            className="mx-auto max-w-xl text-3xl leading-tight font-semibold tracking-[-0.025em] text-balance text-white md:text-4xl"
          >
            {HOME_PAGE.callToAction.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-neutral-400">
            {HOME_PAGE.callToAction.description}
          </p>
          <div className="mt-8 flex justify-center">
            <InstallCommand id="cta-install" />
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
    <footer className="border-t border-white/[0.07] px-5 py-10">
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
        <Facts />
        <Features />
        <Install />
        <Security />
        <FaqSection />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
