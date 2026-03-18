"use client";

import { useState, useEffect, useCallback, createElement } from "react";
import type {
  ManagedTestUserRecord,
  DevtoolsSessionView,
  EditableFieldConfig,
} from "better-auth-devtools/plugin";
import { ENDPOINTS } from "better-auth-devtools/plugin";
import { styles } from "./styles.js";

export interface BetterAuthDevtoolsProps {
  /** Explicitly enable or disable the panel. Recommended for SSR apps. */
  enabled?: boolean;
  /** The Better Auth base URL (defaults to current origin + /api/auth) */
  basePath?: string;
  /** Template keys available for user creation */
  templates?: string[];
  /** Editable field configs for session patch UI */
  editableFields?: EditableFieldConfig[];
  /** Whether the panel starts open */
  defaultOpen?: boolean;
  /** Panel position */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Custom trigger label */
  triggerLabel?: string;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/* ── Inline SVG icons (no deps) ──────────────── */

function ShieldIcon() {
  return createElement(
    "svg",
    {
      width: 12,
      height: 12,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#0c0c0f",
      strokeWidth: 2.5,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    },
    createElement("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    })
  );
}

function XIcon() {
  return createElement(
    "svg",
    {
      width: 14,
      height: 14,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    },
    createElement("line", { x1: 18, y1: 6, x2: 6, y2: 18 }),
    createElement("line", { x1: 6, y1: 6, x2: 18, y2: 18 })
  );
}

function RefreshIcon() {
  return createElement(
    "svg",
    {
      width: 11,
      height: 11,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    },
    createElement("polyline", { points: "23 4 23 10 17 10" }),
    createElement("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })
  );
}

function PlusIcon() {
  return createElement(
    "svg",
    {
      width: 11,
      height: 11,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    },
    createElement("line", { x1: 12, y1: 5, x2: 12, y2: 19 }),
    createElement("line", { x1: 5, y1: 12, x2: 19, y2: 12 })
  );
}

function AlertIcon() {
  return createElement(
    "svg",
    {
      width: 13,
      height: 13,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    },
    createElement("circle", { cx: 12, cy: 12, r: 10 }),
    createElement("line", { x1: 12, y1: 8, x2: 12, y2: 12 }),
    createElement("line", { x1: 12, y1: 16, x2: 12.01, y2: 16 })
  );
}

/* ── Component ───────────────────────────────── */

export function BetterAuthDevtools({
  enabled: enabledProp,
  basePath = "/api/auth",
  templates = [],
  editableFields = [],
  defaultOpen = false,
  position = "bottom-right",
  triggerLabel = "Auth DevTools",
}: BetterAuthDevtoolsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [users, setUsers] = useState<FetchState<ManagedTestUserRecord[]>>({
    data: null,
    loading: false,
    error: null,
  });
  const [session, setSession] = useState<FetchState<DevtoolsSessionView>>({
    data: null,
    loading: false,
    error: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [patchValues, setPatchValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const [enabled, setEnabled] = useState(enabledProp ?? true);

  useEffect(() => {
    setEnabled(enabledProp ?? true);
  }, [enabledProp]);

  const apiUrl = (endpoint: string) => `${basePath}${endpoint}`;

  const fetchUsers = useCallback(async () => {
    setUsers({ data: null, loading: true, error: null });
    try {
      const res = await fetch(apiUrl(ENDPOINTS.LIST_USERS), {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setUsers({
          data: null,
          loading: false,
          error: data.error?.message ?? "Failed to fetch users",
        });
        return;
      }
      setUsers({ data, loading: false, error: null });
    } catch (e) {
      setUsers({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch users",
      });
    }
  }, [basePath]);

  const fetchSession = useCallback(async () => {
    setSession({ data: null, loading: true, error: null });
    try {
      const res = await fetch(apiUrl(ENDPOINTS.SESSION), {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setSession({
          data: null,
          loading: false,
          error: data.error?.message ?? "Failed to fetch session",
        });
        return;
      }
      setSession({ data: data.session, loading: false, error: null });
    } catch (e) {
      setSession({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch session",
      });
    }
  }, [basePath]);

  useEffect(() => {
    if (isOpen && enabled) {
      fetchUsers();
      fetchSession();
    }
  }, [isOpen, enabled, fetchUsers, fetchSession]);

  const createUser = async (templateKey: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(apiUrl(ENDPOINTS.CREATE_USER), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ template: templateKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error?.message ?? "Failed to create user");
        return;
      }
      await fetchUsers();
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to create user"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const loginAs = async (userId: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(apiUrl(ENDPOINTS.LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error?.message ?? "Failed to login");
        return;
      }
      setSession({ data: data.session, loading: false, error: null });
      window.location.reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to login");
    } finally {
      setActionLoading(false);
    }
  };

  const patchSession = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const patch: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(patchValues)) {
        if (value !== "") patch[key] = value;
      }
      const res = await fetch(apiUrl(ENDPOINTS.UPDATE_SESSION), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error?.message ?? "Failed to update session");
        return;
      }
      setSession({ data: data.session, loading: false, error: null });
      window.location.reload();
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to update session"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (!enabled) return null;

  const positionStyle = {
    "bottom-right": { bottom: "16px", right: "16px" },
    "bottom-left": { bottom: "16px", left: "16px" },
    "top-right": { top: "16px", right: "16px" },
    "top-left": { top: "16px", left: "16px" },
  }[position];

  const filteredUsers =
    users.data?.filter(
      (u) =>
        !searchQuery ||
        u.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.templateKey.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  return (
    <div style={{ ...styles.container, ...positionStyle }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.trigger}
          title={triggerLabel}
        >
          <span style={styles.triggerIcon}>
            <ShieldIcon />
          </span>
          {triggerLabel}
        </button>
      ) : (
        <div style={styles.panel}>
          {/* ── Header ──────────────────────── */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>
                <ShieldIcon />
              </span>
              <span style={styles.headerTitle}>{triggerLabel}</span>
              <span style={styles.headerBadge}>dev</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              title="Close"
            >
              <XIcon />
            </button>
          </div>

          {/* ── Error banner ────────────────── */}
          {actionError && (
            <div style={styles.errorBanner}>
              <AlertIcon />
              <span>{actionError}</span>
            </div>
          )}

          {/* ── Templates ──────────────────── */}
          {templates.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Create Test User</div>
              <div style={styles.templateGrid}>
                {templates.map((t) => (
                  <button
                    key={t}
                    onClick={() => createUser(t)}
                    disabled={actionLoading}
                    style={styles.templateButton}
                  >
                    <PlusIcon /> {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── User list ──────────────────── */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>
                Managed Users
                {users.data && (
                  <span style={{ fontWeight: 400, color: "#55555e", marginLeft: "6px" }}>
                    {users.data.length}
                  </span>
                )}
              </span>
            </div>
            {users.loading && <div style={styles.muted}>Loading users...</div>}
            {users.error && <div style={styles.errorText}>{users.error}</div>}
            {users.data && users.data.length > 5 && (
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            )}
            {users.data && filteredUsers.length === 0 && (
              <div style={styles.emptyState}>No managed users yet</div>
            )}
            <div style={styles.userList}>
              {filteredUsers.map((u) => (
                <div key={u.id} style={styles.userRow}>
                  <div style={styles.userInfo}>
                    <div style={styles.userLabel}>{u.label}</div>
                    <div style={styles.userEmail}>{u.email}</div>
                  </div>
                  <button
                    onClick={() => loginAs(u.userId)}
                    disabled={actionLoading}
                    style={styles.loginButton}
                  >
                    Login
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Session inspector ──────────── */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={{ display: "flex", alignItems: "center" }}>
                Session
                {session.data ? (
                  <span style={styles.statusDot} title="Active" />
                ) : !session.loading ? (
                  <span style={styles.statusDotInactive} title="No session" />
                ) : null}
              </span>
              <button
                onClick={fetchSession}
                style={styles.refreshButton}
                title="Refresh session"
              >
                <RefreshIcon /> Refresh
              </button>
            </div>
            {session.loading && (
              <div style={styles.muted}>Loading session...</div>
            )}
            {session.error && (
              <div style={styles.errorText}>{session.error}</div>
            )}
            {!session.loading && !session.data && !session.error && (
              <div style={styles.emptyState}>No active session</div>
            )}
            {session.data && (
              <div style={styles.sessionFields}>
                {Object.entries(session.data.fields).map(([key, value]) => (
                  <div key={key} style={styles.fieldRow}>
                    <span style={styles.fieldKey}>{key}</span>
                    <span style={styles.fieldValue}>
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value ?? "")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Session patch editor ───────── */}
          {editableFields.length > 0 && session.data && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Edit Session</div>
              {editableFields.map((field) => (
                <div key={field.key} style={styles.editFieldRow}>
                  <label style={styles.editFieldLabel}>{field.label}</label>
                  {field.type === "select" && field.options ? (
                    <select
                      value={
                        patchValues[field.key] ??
                        String(session.data?.fields[field.key] ?? "")
                      }
                      onChange={(e) =>
                        setPatchValues((p) => ({
                          ...p,
                          [field.key]: e.target.value,
                        }))
                      }
                      style={styles.editInput}
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={
                        patchValues[field.key] ??
                        String(session.data?.fields[field.key] ?? "")
                      }
                      onChange={(e) =>
                        setPatchValues((p) => ({
                          ...p,
                          [field.key]: e.target.value,
                        }))
                      }
                      style={styles.editInput}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={patchSession}
                disabled={actionLoading}
                style={styles.saveButton}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
