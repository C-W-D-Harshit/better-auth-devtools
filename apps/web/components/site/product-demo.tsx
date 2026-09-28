"use client"

import { useState } from "react"
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react"
import { Lock, ShieldCheck } from "lucide-react"

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

const ACCESS: Record<Role, { title: string; allowed: boolean }[]> = {
  admin: [
    { title: "Billing", allowed: true },
    { title: "Members", allowed: true },
    { title: "Publish posts", allowed: true },
  ],
  editor: [
    { title: "Billing", allowed: false },
    { title: "Members", allowed: false },
    { title: "Publish posts", allowed: true },
  ],
  viewer: [
    { title: "Billing", allowed: false },
    { title: "Members", allowed: false },
    { title: "Publish posts", allowed: false },
  ],
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6)
}

function AppPreview({ user }: { user: DemoUser }) {
  const reduce = useReducedMotion()

  return (
    <div className="flex h-full flex-col p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-200">acme.app</span>
        <span className="flex items-center gap-2 text-xs text-neutral-500">
          <span
            aria-hidden
            className="grid size-6 place-items-center rounded-full bg-white/[0.07] font-mono text-[10px] text-neutral-300"
          >
            {user.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden sm:inline">{user.email}</span>
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={user.id + user.role}
          initial={{ opacity: 0, filter: reduce ? BLUR.none : BLUR.small }}
          animate={{ opacity: 1, filter: BLUR.none }}
          exit={{ opacity: 0, filter: reduce ? BLUR.none : BLUR.small }}
          transition={{
            duration: reduce ? 0 : DURATION.quick,
            ease: EASE_SMOOTH_OUT,
          }}
          className="mt-8"
        >
          <p className="text-xs text-neutral-500">Signed in as</p>
          <p className="mt-1 text-xl font-medium text-neutral-100">
            {user.name}{" "}
            <span className="ml-1 rounded-md border border-amber-300/25 bg-amber-300/10 px-1.5 py-0.5 align-middle font-mono text-[11px] text-amber-200">
              role: {user.role}
            </span>
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-3">
            {ACCESS[user.role].map((item) => (
              <li
                key={item.title}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm",
                  item.allowed
                    ? "border-white/10 bg-white/[0.03] text-neutral-200"
                    : "border-white/[0.05] text-neutral-600"
                )}
              >
                {item.title}
                {item.allowed ? (
                  <ShieldCheck
                    aria-hidden
                    className="size-3.5 text-amber-300"
                  />
                ) : (
                  <Lock aria-hidden className="size-3.5" />
                )}
                <span className="sr-only">
                  {item.allowed ? "allowed" : "locked"}
                </span>
              </li>
            ))}
          </ul>
          <pre className="mt-6 overflow-x-auto rounded-lg border border-white/[0.05] bg-black/30 p-4 font-mono text-[11px] leading-5 text-neutral-500">
            <span className="text-neutral-600">
              {"// Current session, as shown in the panel"}
            </span>
            {"\n{\n  "}
            <span className="text-neutral-300">user</span>
            {": { "}
            <span className="text-neutral-300">email</span>
            {": "}
            <span className="text-amber-200/90">&quot;{user.email}&quot;</span>
            {", "}
            <span className="text-neutral-300">role</span>
            {": "}
            <span className="text-amber-200/90">&quot;{user.role}&quot;</span>
            {" },\n  "}
            <span className="text-neutral-300">session</span>
            {": { "}
            <span className="text-neutral-300">token</span>
            {": "}
            <span className="text-neutral-600">&quot;[redacted]&quot;</span>
            {" }\n}"}
          </pre>
        </m.div>
      </AnimatePresence>
    </div>
  )
}

function Panel({
  users,
  currentId,
  onCreate,
  onSwitch,
  onRoleChange,
}: {
  users: DemoUser[]
  currentId: string
  onCreate: (role: Role) => void
  onSwitch: (id: string) => void
  onRoleChange: (role: Role) => void
}) {
  const current = users.find((u) => u.id === currentId) ?? users[0]

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#141416]/95 font-mono text-[12px] text-neutral-300 shadow-2xl shadow-black/60 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-neutral-100">
          <span aria-hidden className="size-1.5 rounded-full bg-amber-300" />
          Auth DevTools
        </span>
        <span className="text-[10px] text-neutral-600">development</span>
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
          Managed users <span>{users.length}</span>
        </p>
        <ul className="max-h-[132px] space-y-1 overflow-y-auto">
          {users.map((user) => {
            const active = user.id === currentId
            return (
              <li
                key={user.id}
                className="flex items-center justify-between gap-2 rounded-md bg-white/[0.03] px-2 py-1.5"
              >
                <span className="min-w-0">
                  <span className="block text-neutral-100">{user.name}</span>
                  <span className="block truncate text-[10px] text-neutral-500">
                    {user.email}
                  </span>
                </span>
                {active ? (
                  <span className="shrink-0 px-2 text-[10px] text-amber-300">
                    active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSwitch(user.id)}
                    className="shrink-0 rounded bg-amber-300 px-2 py-1 text-[11px] font-medium text-neutral-950 transition-[background-color,scale] duration-(--duration-quick) ease-out hover:bg-amber-200 active:scale-(--scale-medium)"
                  >
                    Switch
                  </button>
                )}
              </li>
            )
          })}
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
  const current = users.find((u) => u.id === currentId) ?? users[0]

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

  const changeRole = (role: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === current.id ? { ...u, role } : u))
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0d] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
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
        <div className="grid md:grid-cols-[1fr_320px]">
          <div className="min-h-[260px] min-w-0 border-b border-white/[0.06] md:border-r md:border-b-0">
            <AppPreview user={current} />
          </div>
          <div className="bg-[radial-gradient(circle_at_top,rgba(252,211,77,0.06),transparent_70%)] p-4">
            <Panel
              users={users}
              currentId={current.id}
              onCreate={createUser}
              onSwitch={setCurrentId}
              onRoleChange={changeRole}
            />
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
