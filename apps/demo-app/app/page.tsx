"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Better Auth DevTools Demo</h1>
      <p>
        This app demonstrates the Better Auth DevTools plugin. Use the floating
        panel in the bottom-right corner to create test users, switch between
        them, and patch session data.
      </p>

      {isPending && <p>Loading session...</p>}

      {!isPending && !session && (
        <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
          <p>Not signed in. Use the DevTools panel to login as a test user.</p>
        </div>
      )}

      {!isPending && session && (
        <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
          <h2>Welcome, {session.user.name}</h2>
          <p>Email: {session.user.email}</p>
          <Link
            href="/dashboard"
            style={{ color: "#3a5a8a", textDecoration: "underline" }}
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </main>
  );
}
