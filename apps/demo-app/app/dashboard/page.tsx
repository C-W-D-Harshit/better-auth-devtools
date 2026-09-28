"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

type ActionResult = { status: "idle" | "pending" | "allowed" | "denied" | "error"; message: string };

export default function Dashboard() {
  const { data: session, isPending, error, refetch } = useSession();
  const [action, setAction] = useState<ActionResult>({ status: "idle", message: "" });

  async function checkAdminAccess() {
    setAction({ status: "pending", message: "Checking on the server..." });
    try {
      const response = await fetch("/api/admin-check", { method: "POST" });
      if (!response.ok) {
        const failure = (await response.json()) as { message?: string };
        setAction({
          status: response.status === 403 ? "denied" : "error",
          message: failure.message ?? `Request failed (${response.status})`,
        });
        return;
      }
      const body = (await response.json()) as { message?: string };
      setAction({
        status: "allowed",
        message: body.message ?? `Request failed (${response.status})`,
      });
    } catch (cause) {
      setAction({ status: "error", message: cause instanceof Error ? cause.message : "Request failed" });
    }
  }

  async function handleSignOut() {
    const result = await signOut();
    if (result.error) {
      setAction({ status: "error", message: result.error.message ?? "Could not sign out" });
      return;
    }
    window.location.reload();
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Application session</h1>
      <p>DevTools creates and switches managed test users. This page reads the normal Better Auth session. The access check below runs in this app&apos;s server route.</p>
      {isPending ? <p role="status">Loading application session...</p> : error ? (
        <div role="alert">
          <p>Could not read the application session: {error.message}</p>
          <button type="button" onClick={() => void refetch()}>Retry</button>
        </div>
      ) : !session ? (
        <p>Signed out. Open Auth DevTools, create a Viewer or Admin, then choose Switch.</p>
      ) : (
        <section style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
          <h2>Signed in as {session.user.name}</h2>
          <p>Email: {session.user.email}</p>
          <p>Role: <strong>{session.user.role}</strong></p>
          <button type="button" onClick={() => void checkAdminAccess()} disabled={action.status === "pending"}>
            Check admin access
          </button>
          {action.message ? <p role="status">{action.message}</p> : null}
          <p><button type="button" onClick={() => void handleSignOut()}>Sign out</button></p>
        </section>
      )}
      <p><Link href="/">Back to demo guide</Link></p>
    </main>
  );
}
