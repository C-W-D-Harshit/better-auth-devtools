"use client";

import { useCallback, useEffect, useState } from "react";
import { ENDPOINTS } from "../endpoints.js";
import type {
  DevtoolsSessionView,
  DevtoolsPanelFieldConfig,
  ManagedTestUserRecord,
} from "../types.js";
import type { DevtoolsPublicConfig } from "../payloads.js";
import { styles } from "./styles.js";

export interface BetterAuthDevtoolsProps {
  enabled?: boolean;
  basePath?: string;
  templates?: string[];
  editableFields?: DevtoolsPanelFieldConfig[];
  defaultOpen?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  triggerLabel?: string;
  /** Reload the host app after switching or editing so auth state refreshes. */
  reloadOnSessionChange?: boolean;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function getErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback;
  const payload = data as {
    message?: unknown;
    error?: { message?: unknown };
  };
  if (typeof payload.error?.message === "string") return payload.error.message;
  return typeof payload.message === "string" ? payload.message : fallback;
}

export function BetterAuthDevtools({
  enabled: enabledProp,
  basePath = "/api/auth",
  templates = [],
  editableFields = [],
  defaultOpen = false,
  position = "bottom-right",
  triggerLabel = "Auth DevTools",
  reloadOnSessionChange = true,
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
  const [patchValues, setPatchValues] = useState<
    Record<string, string | boolean>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [serverConfig, setServerConfig] = useState<
    DevtoolsPublicConfig | null | undefined
  >(undefined);

  const apiUrl = useCallback(
    (endpoint: string) => `${basePath}${endpoint}`,
    [basePath]
  );

  useEffect(() => {
    if (enabledProp === false) {
      setServerConfig(null);
      return;
    }

    const controller = new AbortController();
    fetch(apiUrl(ENDPOINTS.CONFIG), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          setServerConfig(null);
          return;
        }
        setServerConfig((await response.json()) as DevtoolsPublicConfig);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setServerConfig(null);
        }
      });

    return () => controller.abort();
  }, [apiUrl, enabledProp]);

  const enabled = enabledProp ?? serverConfig?.enabled ?? false;
  const templateOptions =
    templates.length > 0
      ? templates.map((key) => ({ key, label: key }))
      : (serverConfig?.templates ?? []);
  const activeEditableFields =
    editableFields.length > 0
      ? editableFields
      : (serverConfig?.editableFields ?? []);

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
          error: getErrorMessage(data, "Failed to fetch users"),
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
  }, [apiUrl]);

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
          error: getErrorMessage(data, "Failed to fetch session"),
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
  }, [apiUrl]);

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
        setActionError(getErrorMessage(data, "Failed to create user"));
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
        setActionError(getErrorMessage(data, "Failed to login"));
        return;
      }
      setSession({ data: data.session, loading: false, error: null });
      if (reloadOnSessionChange) {
        window.location.reload();
      }
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
      for (const field of activeEditableFields) {
        const value = patchValues[field.key];
        if (value !== undefined && value !== "") {
          patch[field.key] =
            field.type === "number" && typeof value === "string"
              ? Number(value)
              : value;
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
        setActionError(getErrorMessage(data, "Failed to update session"));
        return;
      }
      setSession({ data: data.session, loading: false, error: null });
      if (reloadOnSessionChange) {
        window.location.reload();
      }
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to update session"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId: string, label: string) => {
    if (!window.confirm(`Delete the managed test user “${label}”?`)) {
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(apiUrl(ENDPOINTS.DELETE_USER), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(getErrorMessage(data, "Failed to delete user"));
        return;
      }
      await fetchUsers();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (!enabled || serverConfig === undefined) {
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
          type="button"
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
              type="button"
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              aria-label="Close Better Auth DevTools"
            >
              ×
            </button>
          </div>

          {actionError ? (
            <div style={styles.errorBanner}>{actionError}</div>
          ) : null}

          {templateOptions.length > 0 ? (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Create Test User</div>
              <div style={styles.templateGrid}>
                {templateOptions.map((template) => (
                  <button
                    type="button"
                    key={template.key}
                    onClick={() => createUser(template.key)}
                    disabled={actionLoading}
                    style={styles.templateButton}
                  >
                    + {template.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              Managed Users
              <button
                type="button"
                onClick={fetchUsers}
                style={styles.refreshButton}
              >
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
                      type="button"
                      onClick={() => loginAs(user.userId)}
                      disabled={actionLoading}
                      style={styles.loginButton}
                    >
                      switch
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUser(user.userId, user.label)}
                      disabled={actionLoading}
                      style={styles.deleteButton}
                      aria-label={`Delete ${user.label}`}
                    >
                      delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              Current Session
              <button
                type="button"
                onClick={fetchSession}
                style={styles.refreshButton}
              >
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
                    <span style={styles.fieldValue}>
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {activeEditableFields.length > 0 && session.data ? (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Edit Session</div>
              {activeEditableFields.map((field) => (
                <div key={field.key} style={styles.editFieldRow}>
                  <label
                    htmlFor={`better-auth-devtools-${field.key}`}
                    style={styles.editFieldLabel}
                  >
                    {field.label}
                  </label>
                  {field.type === "boolean" ? (
                    <input
                      id={`better-auth-devtools-${field.key}`}
                      type="checkbox"
                      checked={Boolean(patchValues[field.key])}
                      onChange={(event) =>
                        setPatchValues((current) => ({
                          ...current,
                          [field.key]: event.target.checked,
                        }))
                      }
                    />
                  ) : field.type === "select" && field.options ? (
                    <select
                      id={`better-auth-devtools-${field.key}`}
                      style={styles.editInput}
                      value={String(patchValues[field.key] ?? "")}
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
                      id={`better-auth-devtools-${field.key}`}
                      type={field.type === "number" ? "number" : "text"}
                      style={styles.editInput}
                      value={String(patchValues[field.key] ?? "")}
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
                type="button"
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
