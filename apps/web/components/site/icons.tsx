import { IconBrandGithub, IconBrandNpm } from "@tabler/icons-react"

export function GithubIcon({ className }: { className?: string }) {
  return <IconBrandGithub aria-hidden className={className} stroke={1.75} />
}

export function NpmIcon({ className }: { className?: string }) {
  return <IconBrandNpm aria-hidden className={className} stroke={1.75} />
}
