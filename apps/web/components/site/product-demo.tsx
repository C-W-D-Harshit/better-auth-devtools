"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react"
import {
  Check,
  CreditCard,
  FileText,
  LayoutDashboard,
  Lock,
  Users,
  X,
} from "lucide-react"

import { BLUR, DURATION, EASE_SMOOTH_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Role = "admin" | "editor" | "viewer"

type DemoUser = {
  id: string
  name: string
  email: string
  role: Role
}

const TEMPLATES: { role: Role; label: string }[] = [
  { role: "admin", label: "Admin" },
  { role: "editor", label: "Editor" },
  { role: "viewer", label: "Viewer" },
]

const INITIAL_USERS: DemoUser[] = [
  { id: "u1", name: "Admin", email: "admin+k3f9@test.local", role: "admin" },
  { id: "u2", name: "Viewer", email: "viewer+p2m1@test.local", role: "viewer" },
]

const NAV = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    roles: ["admin", "editor", "viewer"],
  },
  { title: "Posts", icon: FileText, roles: ["admin", "editor", "viewer"] },
  { title: "Members", icon: Users, roles: ["admin"] },
  { title: "Billing", icon: CreditCard, roles: ["admin"] },
] as const

const ACCESS: Record<Role, { title: string; allowed: boolean }[]> = {
  admin: [
    { title: "Publish posts", allowed: true },
    { title: "Invite members", allowed: true },
    { title: "Manage billing", allowed: true },
  ],
  editor: [
    { title: "Publish posts", allowed: true },
    { title: "Invite members", allowed: false },
    { title: "Manage billing", allowed: false },
  ],
  viewer: [
    { title: "Publish posts", allowed: false },
    { title: "Invite members", allowed: false },
    { title: "Manage billing", allowed: false },
  ],
}

/** Long enough to read as "the server did something", short enough not to wait on. */
const SWITCH_DELAY = 650
const TOAST_DURATION = 2200

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6)
}

/** transitions.dev number pop-in; a new key remounts the group and replays it. */
function Count({ value }: { value: number }) {
  const digits = String(value).split("")
  return (
    <span key={value} className="t-digit-group is-animating tabular-nums">
      {digits.map((digit, index) => (
        <span
          key={index}
          className="t-digit"
          data-stagger={
            digits.length > 1 && index === digits.length - 1 ? "1" : undefined
          }
        >
          {digit}
        </span>
      ))}
    </span>
  )
}

function AppPreview({
  user,
  pendingEmail,
}: {
  user: DemoUser
  pendingEmail: string | null
}) {
  const reduce = useReducedMotion()

  return (
    <div className="flex h-full min-h-[340px]">
      <aside className="hidden w-40 shrink-0 flex-col gap-0.5 border-r border-white/[0.06] p-3 sm:flex">
        <span className="mb-3 flex items-center gap-2 px-2 pt-1 text-[13px] font-semibold text-neutral-200">
          <span
            aria-hidden
            className="grid size-4 place-items-center rounded bg-neutral-200 text-[9px] font-bold text-neutral-900"
          >
            A
          </span>
          acme
        </span>
        {NAV.map((item) => {
          const allowed = (item.roles as readonly Role[]).includes(user.role)
          const Icon = item.icon
          return (
            <span
              key={item.title}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors duration-(--duration-fast)",
                item.title === "Overview"
                  ? "bg-white/[0.06] text-neutral-100"
                  : allowed
                    ? "text-neutral-400"
                    : "text-neutral-700"
              )}
            >
              <Icon aria-hidden className="size-3.5" />
              {item.title}
              {!allowed && <Lock aria-hidden className="ml-auto size-3" />}
            </span>
          )
        })}
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-200">Overview</span>
          <span className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="hidden truncate md:inline">{user.email}</span>
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-full bg-amber-300/15 font-mono text-[10px] text-amber-200"
            >
              {user.name.slice(0, 2).toUpperCase()}
            </span>
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {pendingEmail ? (
            <m.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : DURATION.quick }}
              className="grid flex-1 place-items-center"
            >
              <span
                className="t-shimmer font-mono text-xs"
                data-text={`Issuing session for ${pendingEmail}`}
              >
                Issuing session for {pendingEmail}
              </span>
            </m.div>
          ) : (
            <m.div
              key={user.id + user.role}
              initial={{ opacity: 0, filter: reduce ? BLUR.none : BLUR.small }}
              animate={{ opacity: 1, filter: BLUR.none }}
              exit={{ opacity: 0, filter: reduce ? BLUR.none : BLUR.small }}
              transition={{
                duration: reduce ? 0 : DURATION.quick,
                ease: EASE_SMOOTH_OUT,
              }}
              className="mt-7"
            >
              <p className="text-xs text-neutral-500">Signed in as</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xl font-medium text-neutral-100">
                {user.name}
                <span className="rounded-md border border-amber-300/25 bg-amber-300/10 px-1.5 py-0.5 font-mono text-[11px] font-normal text-amber-200">
                  role: {user.role}
                </span>
              </p>
              <ul className="mt-6 grid gap-2 lg:grid-cols-3">
                {ACCESS[user.role].map((item) => (
                  <li
                    key={item.title}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-[13px]",
                      item.allowed
                        ? "border-white/10 bg-white/[0.03] text-neutral-200"
                        : "border-dashed border-white/[0.07] text-neutral-600"
                    )}
                  >
                    {item.title}
                    {item.allowed ? (
                      <Check aria-hidden className="size-3.5 text-amber-300" />
                    ) : (
                      <Lock aria-hidden className="size-3.5" />
                    )}
                    <span className="sr-only">
                      {item.allowed ? "allowed" : "locked"}
                    </span>
                  </li>
                ))}
              </ul>
              <pre className="mt-5 overflow-x-auto rounded-lg border border-white/[0.05] bg-black/30 p-4 font-mono text-[11px] leading-5 text-neutral-500">
                <span className="text-neutral-600">
                  {"// GET /api/auth/better-auth-devtools/session"}
                </span>
                {"\n{\n  "}
                <span className="text-neutral-300">user</span>
                {": { "}
                <span className="text-neutral-300">email</span>
                {": "}
                <span className="text-amber-200/90">
                  &quot;{user.email}&quot;
                </span>
                {", "}
                <span className="text-neutral-300">role</span>
                {": "}
                <span className="text-amber-200/90">
                  &quot;{user.role}&quot;
                </span>
                {" },\n  "}
                <span className="text-neutral-300">session</span>
                {": { "}
                <span className="text-neutral-300">token</span>
                {": "}
                <span className="text-neutral-600">&quot;[redacted]&quot;</span>
                {" }\n}"}
              </pre>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Panel({
  users,
  currentId,
  pending,
  onCreate,
  onSwitch,
  onRoleChange,
}: {
  users: DemoUser[]
  currentId: string
  pending: boolean
  onCreate: (role: Role) => void
  onSwitch: (id: string) => void
  onRoleChange: (role: Role) => void
}) {
  const reduce = useReducedMotion()
  const current = users.find((u) => u.id === currentId) ?? users[0]

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#141416]/95 font-mono text-[12px] text-neutral-300 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-neutral-100">
          <span aria-hidden className="size-1.5 rounded-full bg-amber-300" />
          Auth DevTools
        </span>
        <X aria-hidden className="size-3.5 text-neutral-600" />
      </div>

      <div className="border-b border-white/[0.06] px-3.5 py-3">
        <p className="mb-2 text-[10px] tracking-wider text-neutral-500 uppercase">
          Create test user
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATES.map((template) => (
            <button
              key={template.role}
              type="button"
              onClick={() => onCreate(template.role)}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-neutral-300 transition-[border-color,color,scale] duration-(--duration-quick) ease-out hover:border-amber-300/30 hover:text-amber-200 active:scale-(--scale-medium)"
            >
              + {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-white/[0.06] px-3.5 py-3">
        <p className="mb-2 flex justify-between text-[10px] tracking-wider text-neutral-500 uppercase">
          Managed users <Count value={users.length} />
        </p>
        <ul className="max-h-[136px] space-y-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {users.map((user) => {
              const active = user.id === currentId
              return (
                <m.li
                  key={user.id}
                  initial={{
                    opacity: 0,
                    filter: reduce ? BLUR.none : BLUR.small,
                  }}
                  animate={{ opacity: 1, filter: BLUR.none }}
                  transition={{
                    duration: reduce ? 0 : DURATION.fast,
                    ease: EASE_SMOOTH_OUT,
                  }}
                  className="flex items-center justify-between gap-2 rounded-md bg-white/[0.03] px-2 py-1.5"
                >
                  <span className="min-w-0">
                    <span className="block text-neutral-100">{user.name}</span>
                    <span className="block truncate text-[10px] text-neutral-500">
                      {user.email}
                    </span>
                  </span>
                  {active ? (
                    <span className="flex shrink-0 items-center gap-1 px-2 text-[10px] text-amber-300">
                      <span
                        aria-hidden
                        className="size-1 rounded-full bg-amber-300"
                      />
                      active
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onSwitch(user.id)}
                      className="shrink-0 rounded bg-amber-300 px-2 py-1 text-[11px] font-medium text-neutral-950 transition-[background-color,scale,opacity] duration-(--duration-quick) ease-out hover:bg-amber-200 active:scale-(--scale-medium) disabled:opacity-50"
                    >
                      Switch
                    </button>
                  )}
                </m.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </div>

      <div className="px-3.5 py-3">
        <p className="mb-2 text-[10px] tracking-wider text-neutral-500 uppercase">
          Edit session
        </p>
        <label className="flex items-center justify-between gap-3">
          <span className="text-neutral-400">Role</span>
          <select
            value={current.role}
            disabled={pending}
            onChange={(event) => onRoleChange(event.target.value as Role)}
            className="rounded-md border border-white/10 bg-[#1c1c1f] px-2 py-1 text-neutral-100 outline-none focus-visible:border-amber-300/50"
          >
            {TEMPLATES.map((template) => (
              <option key={template.role} value={template.role}>
                {template.role}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export function ProductDemo() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [currentId, setCurrentId] = useState(INITIAL_USERS[0].id)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [toast, setToast] = useState({ open: false, text: "" })
  const switchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const current = users.find((u) => u.id === currentId) ?? users[0]
  const pending = users.find((u) => u.id === pendingId) ?? null

  useEffect(
    () => () => {
      clearTimeout(switchTimer.current)
      clearTimeout(toastTimer.current)
    },
    []
  )

  const showToast = (text: string) => {
    setToast({ open: true, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(
      () => setToast((prev) => ({ ...prev, open: false })),
      TOAST_DURATION
    )
  }

  const createUser = (role: Role) => {
    const label = TEMPLATES.find((t) => t.role === role)?.label ?? role
    const user: DemoUser = {
      id: `${role}-${Date.now()}`,
      name: label,
      email: `${role}+${randomSuffix()}@test.local`,
      role,
    }
    setUsers((prev) => {
      const next = [user, ...prev]
      const recent = next.slice(0, 6)
      if (recent.some((entry) => entry.id === currentId)) return recent

      const selected = prev.find((entry) => entry.id === currentId)
      return selected ? [...next.slice(0, 5), selected] : recent
    })
  }

  const switchUser = (id: string) => {
    const target = users.find((u) => u.id === id)
    if (!target) return
    setPendingId(id)
    clearTimeout(switchTimer.current)
    switchTimer.current = setTimeout(() => {
      setCurrentId(id)
      setPendingId(null)
      showToast(`Switched to ${target.name}. Page reloaded.`)
    }, SWITCH_DELAY)
  }

  const changeRole = (role: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === current.id ? { ...u, role } : u))
    )
    showToast(`Updated role to ${role}.`)
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0d] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-black/40">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="size-2.5 rounded-full bg-white/10" />
          </div>
          <div className="mx-auto rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-neutral-500">
            localhost:3000/dashboard
          </div>
          <div aria-hidden className="w-[42px]" />
        </div>
        <div className="relative grid md:grid-cols-[1fr_320px]">
          <div className="min-w-0 border-b border-white/[0.06] md:border-r md:border-b-0">
            <AppPreview user={current} pendingEmail={pending?.email ?? null} />
          </div>
          <div className="bg-[radial-gradient(circle_at_top,rgba(252,211,77,0.06),transparent_70%)] p-4">
            <Panel
              users={users}
              currentId={current.id}
              pending={pending !== null}
              onCreate={createUser}
              onSwitch={switchUser}
              onRoleChange={changeRole}
            />
          </div>

          <div
            role="status"
            aria-live="polite"
            className={cn(
              "t-toast pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/10 bg-[#18181b] px-3 py-2 text-xs text-neutral-200 shadow-xl shadow-black/50",
              toast.open && "is-open"
            )}
          >
            <span
              aria-hidden
              className="grid size-4 place-items-center rounded-full bg-amber-300 text-neutral-950"
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            {toast.text}
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
