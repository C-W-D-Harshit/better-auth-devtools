"use client";

import { useCallback, useEffect, useState } from "react";
import { ENDPOINTS } from "../endpoints.js";
import type {
  DevtoolsSessionView,
  DevtoolsPanelFieldConfig,
  ManagedTestUserRecord,
} from "../types.js";
import { styles } from "./styles.js";

export interface BetterAuthDevtoolsProps {
  enabled?: boolean;
  basePath?: string;
  templates?: string[];
  editableFields?: DevtoolsPanelFieldConfig[];
  defaultOpen?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  triggerLabel?: string;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

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
  }, [enabled, fetchSession, fetchUsers, isOpen]);

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
      setActionError(e instanceof Error ? e.message : "Failed to create user");
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
        if (value !== "") {
          patch[key] = value;
        }
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

  if (!enabled) {
    return null;
  }

  const positionStyle = {
    "bottom-right": { bottom: "16px", right: "16px" },
    "bottom-left": { bottom: "16px", left: "16px" },
    "top-right": { top: "16px", right: "16px" },
    "top-left": { top: "16px", left: "16px" },
  }[position];

  const filteredUsers =
    users.data?.filter(
      (user) =>
        !searchQuery ||
        user.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.templateKey.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  return (
    <div style={{ ...styles.container, ...positionStyle }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.trigger}
          title={triggerLabel}
        >
          {triggerLabel}
        </button>
      ) : (
        <div style={styles.panel}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>{triggerLabel}</span>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              x
            </button>
          </div>

          {actionError ? (
            <div style={styles.errorBanner}>{actionError}</div>
          ) : null}

          {templates.length > 0 ? (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Create Test User</div>
              <div style={styles.templateGrid}>
                {templates.map((template) => (
                  <button
                    key={template}
                    onClick={() => createUser(template)}
                    disabled={actionLoading}
                    style={styles.templateButton}
                  >
                    + {template}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              Managed Users
              <button onClick={fetchUsers} style={styles.refreshButton}>
                refresh
              </button>
            </div>
            <input
              placeholder="Search users..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {users.loading ? (
              <div style={styles.muted}>Loading users...</div>
            ) : users.error ? (
              <div style={styles.errorText}>{users.error}</div>
            ) : filteredUsers.length === 0 ? (
              <div style={styles.muted}>No test users found</div>
            ) : (
              <div style={styles.userList}>
                {filteredUsers.map((user) => (
                  <div key={user.id} style={styles.userRow}>
                    <div style={styles.userInfo}>
                      <div style={styles.userLabel}>{user.label}</div>
                      <div style={styles.userEmail}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => loginAs(user.userId)}
                      disabled={actionLoading}
                      style={styles.loginButton}
                    >
                      switch
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              Current Session
              <button onClick={fetchSession} style={styles.refreshButton}>
                refresh
              </button>
            </div>
            {session.loading ? (
              <div style={styles.muted}>Loading session...</div>
            ) : session.error ? (
              <div style={styles.errorText}>{session.error}</div>
            ) : !session.data ? (
              <div style={styles.muted}>No active session</div>
            ) : (
              <div style={styles.sessionFields}>
                {Object.entries(session.data.fields).map(([key, value]) => (
                  <div key={key} style={styles.fieldRow}>
                    <span style={styles.fieldKey}>{key}</span>
                    <span style={styles.fieldValue}>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {editableFields.length > 0 && session.data ? (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Edit Session</div>
              {editableFields.map((field) => (
                <div key={field.key} style={styles.editFieldRow}>
                  <label style={styles.editFieldLabel}>{field.label}</label>
                  {field.type === "select" && field.options ? (
                    <select
                      style={styles.editInput}
                      value={patchValues[field.key] ?? ""}
                      onChange={(event) =>
                        setPatchValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select...</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={styles.editInput}
                      value={patchValues[field.key] ?? ""}
                      onChange={(event) =>
                        setPatchValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              ))}
              <button
                onClick={patchSession}
                disabled={actionLoading}
                style={styles.saveButton}
              >
                Save & Reload
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
