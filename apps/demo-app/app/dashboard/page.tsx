"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Fetch the devtools session to get the role
  useEffect(() => {
    if (session) {
      fetch("/api/auth/better-auth-devtools/session", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.session?.fields?.role) {
            setUserRole(data.session.fields.role);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  if (isPending) return <p>Loading...</p>;
  if (!session) return null;

  const role = userRole ?? "viewer";

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Dashboard</h1>
      <div style={{ padding: 16, background: "#fff", borderRadius: 8, marginBottom: 16 }}>
        <p><strong>User:</strong> {session.user.name}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Role:</strong> <span style={{
          background: role === "admin" ? "#dc3545" : role === "editor" ? "#ffc107" : "#28a745",
          color: role === "admin" ? "#fff" : role === "editor" ? "#000" : "#fff",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 600,
        }}>{role}</span></p>
      </div>

      {role === "admin" && (
        <div style={{ padding: 16, background: "#ffe0e0", borderRadius: 8, marginBottom: 16 }}>
          <h3>Admin Panel</h3>
          <p>You have full access. This section is only visible to admins.</p>
        </div>
      )}

      {(role === "admin" || role === "editor") && (
        <div style={{ padding: 16, background: "#fff3cd", borderRadius: 8, marginBottom: 16 }}>
          <h3>Editor Tools</h3>
          <p>You can edit content. This section is visible to admins and editors.</p>
        </div>
      )}

      <div style={{ padding: 16, background: "#d4edda", borderRadius: 8, marginBottom: 16 }}>
        <h3>Content</h3>
        <p>This section is visible to all authenticated users.</p>
      </div>

      <button
        onClick={() => signOut().then(() => router.push("/"))}
        style={{
          background: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>
    </main>
  );
}
