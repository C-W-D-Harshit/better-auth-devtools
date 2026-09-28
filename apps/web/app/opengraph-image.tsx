import { ImageResponse } from "next/og"

import { HOME_PAGE, SITE } from "@/lib/site-content"

export const alt = "Better Auth DevTools: switch Better Auth users in one click"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const USERS = [
  { name: "Admin", email: "admin+k3f9@test.local", active: true },
  { name: "Editor", email: "editor+w8q2@test.local", active: false },
  { name: "Viewer", email: "viewer+p2m1@test.local", active: false },
]

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "radial-gradient(ellipse 70% 60% at 20% 0%, rgba(252,211,77,0.16), transparent), #09090b",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#d4d4d4",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(#ffbb00, #ffe31f)",
            }}
          />
          {SITE.name}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {HOME_PAGE.headline}
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 22px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#0f0f10",
            fontFamily: "monospace",
            fontSize: 26,
          }}
        >
          <span style={{ color: "#fcd34d" }}>$</span>
          {HOME_PAGE.installCommand}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 380,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "#141416",
          fontFamily: "monospace",
          fontSize: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "18px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              background: "#fcd34d",
            }}
          />
          Auth DevTools
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 18,
          }}
        >
          {USERS.map((user) => (
            <div
              key={user.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{user.name}</span>
                <span style={{ fontSize: 14, color: "#737373" }}>
                  {user.email}
                </span>
              </div>
              {user.active ? (
                <span style={{ fontSize: 15, color: "#fcd34d" }}>active</span>
              ) : (
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    background: "#fcd34d",
                    color: "#09090b",
                    fontSize: 15,
                  }}
                >
                  Switch
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    size
  )
}
