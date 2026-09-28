"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ENDPOINTS } from "../endpoints.js";
import type { DevtoolsPublicConfig, SearchUsersResponse } from "../payloads.js";
import type {
  DevtoolsPanelFieldConfig,
  DevtoolsSessionView,
  ManagedTestUserRecord,
} from "../types.js";
import { changedFields, fieldValue, type DraftValue } from "./edit-fields.js";
import { styles } from "./styles.js";

const EMPTY_TEMPLATES: string[] = [];
const EMPTY_EDITABLE_FIELDS: DevtoolsPanelFieldConfig[] = [];
const production = process.env.NODE_ENV === "production";

type Action =
  | "create"
  | "create-switch"
  | "switch"
  | "delete"
  | "edit"
  | "sign-out"
  | null;
type SessionChange = "switch" | "edit" | "delete" | "sign-out";
interface RequestFailure {
  code: string;
  message: string;
  status: number;
  retryAfter?: number;
}
interface Resource<T> {
  data: T | null;
  loading: boolean;
  error: RequestFailure | null;
}

export interface BetterAuthDevtoolsProps {
  enabled?: boolean;
  basePath?: string;
  templates?: string[];
  editableFields?: DevtoolsPanelFieldConfig[];
  defaultOpen?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  triggerLabel?: string;
  /** Reload the host after auth changes. Defaults to true. When false, supply onSessionChange. */
  reloadOnSessionChange?: boolean;
  /** Refresh the host auth client when reloadOnSessionChange is false. */
  onSessionChange?: (action: SessionChange) => void | Promise<void>;
  /** Override the tab-scoped open-state key for apps sharing one auth path. */
  persistenceKey?: string;
}

function failure(error: unknown): RequestFailure {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "message" in error
  ) {
    return error as RequestFailure;
  }
  return {
    code: "NETWORK_ERROR",
    message: "Could not reach the auth server. Check the connection and retry.",
    status: 0,
  };
}

function discoveryMessage(error: RequestFailure, endpoint: string) {
  if (error.status === 404)
    return `DevTools was not found at ${endpoint}. Check that devtools({ enabled: true }) is installed and basePath matches the auth route.`;
  if (error.code === "MIGRATION_REQUIRED")
    return "The DevTools user table is missing. Run the Better Auth migration, then retry.";
  if (error.status === 429)
    return `DevTools is rate limited. Retry${error.retryAfter ? ` in ${error.retryAfter} seconds` : " shortly"}.`;
  if (error.status === 0) return `${error.message} Requested ${endpoint}.`;
  return `Could not load DevTools at ${endpoint}. ${error.message}`;
}

export function BetterAuthDevtools({
  enabled: enabledProp,
  basePath = "/api/auth",
  templates = EMPTY_TEMPLATES,
  editableFields = EMPTY_EDITABLE_FIELDS,
  defaultOpen = false,
  position = "bottom-right",
  triggerLabel = "Auth DevTools",
  reloadOnSessionChange = true,
  onSessionChange,
  persistenceKey,
}: BetterAuthDevtoolsProps) {
  const normalizedBasePath = basePath.replace(/\/$/, "");
  const endpoint = useCallback(
    (path: string) => `${normalizedBasePath}${path}`,
    [normalizedBasePath],
  );
  const storageKey =
    persistenceKey ??
    (typeof window === "undefined"
      ? ""
      : `better-auth-devtools:open:${window.location.origin}:${normalizedBasePath}`);
  const flashKey = `${storageKey}:notice`;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [config, setConfig] = useState<Resource<DevtoolsPublicConfig>>({
    data: null,
    loading: true,
    error: null,
  });
  const [users, setUsers] = useState<Resource<SearchUsersResponse>>({
    data: null,
    loading: false,
    error: null,
  });
  const [session, setSession] = useState<Resource<DevtoolsSessionView>>({
    data: null,
    loading: false,
    error: null,
  });
  const [managedUser, setManagedUser] = useState<ManagedTestUserRecord | null>(
    null,
  );
  const [action, setAction] = useState<Action>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [createdToRetry, setCreatedToRetry] =
    useState<ManagedTestUserRecord | null>(null);
  const [pendingDeletion, setPendingDeletion] =
    useState<ManagedTestUserRecord | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, Record<string, DraftValue>>
  >({});
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [retry, setRetry] = useState(0);
  const sequence = useRef({ config: 0, users: 0, session: 0 });
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cancelDeletionRef = useRef<HTMLButtonElement>(null);

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      const response = await fetch(endpoint(path), {
        credentials: "include",
        ...init,
      });
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const body =
          payload && typeof payload === "object"
            ? (payload as Record<string, unknown>)
            : {};
        const headerRetry = Number(response.headers.get("retry-after"));
        throw {
          code: typeof body.code === "string" ? body.code : "HTTP_ERROR",
          message:
            typeof body.message === "string"
              ? body.message
              : `Request failed (${response.status}).`,
          status: response.status,
          retryAfter:
            typeof body.retryAfter === "number"
              ? body.retryAfter
              : Number.isFinite(headerRetry) && headerRetry > 0
                ? headerRetry
                : undefined,
        } satisfies RequestFailure;
      }
      return (await response.json()) as T;
    },
    [endpoint],
  );

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (sessionStorage.getItem(storageKey) === "true") setIsOpen(true);
    } catch {
      /* Storage may be unavailable. */
    }
  }, [storageKey]);
  useEffect(() => {
    if (!storageKey) return;
    try {
      const message = sessionStorage.getItem(flashKey);
      if (message) {
        setNotice(message);
        sessionStorage.removeItem(flashKey);
      }
    } catch {
      /* Storage may be unavailable. */
    }
  }, [flashKey, storageKey]);
  useEffect(() => {
    if (!storageKey) return;
    try {
      sessionStorage.setItem(storageKey, String(isOpen));
    } catch {
      /* Storage may be unavailable. */
    }
  }, [isOpen, storageKey]);

  useEffect(() => {
    if (production || enabledProp === false) return;
    const sequenceState = sequence.current;
    const number = ++sequenceState.config;
    setConfig((previous) => ({ ...previous, loading: true, error: null }));
    request<DevtoolsPublicConfig>(ENDPOINTS.CONFIG)
      .then((data) => {
        if (number === sequence.current.config)
          setConfig({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (number === sequence.current.config)
          setConfig({ data: null, loading: false, error: failure(error) });
      });
    return () => {
      sequenceState.config += 1;
    };
  }, [enabledProp, request, retry]);

  const templateOptions = useMemo(
    () =>
      templates.length
        ? templates.map((key) => ({ key, label: key }))
        : (config.data?.templates ?? []),
    [templates, config.data],
  );
  const configuredFields = useMemo(
    () =>
      editableFields.length
        ? editableFields
        : (config.data?.editableFields ?? []),
    [editableFields, config.data],
  );
  const activeFields = useMemo(() => {
    const allowed = session.data?.editableFields
      ? new Set(session.data.editableFields)
      : null;
    return configuredFields.filter(
      (field) => !allowed || allowed.has(field.key),
    );
  }, [configuredFields, session.data]);
  const currentDraft = session.data ? (drafts[session.data.userId] ?? {}) : {};
  const { patch, errors: fieldErrors } = changedFields(
    session.data,
    activeFields,
    currentDraft,
  );
  const isDirty =
    Object.keys(patch).length > 0 || Object.keys(fieldErrors).length > 0;

  const loadUsers = useCallback(
    async (query = "", cursor?: string) => {
      const number = ++sequence.current.users;
      setUsers((previous) => ({
        data: cursor ? previous.data : null,
        loading: true,
        error: null,
      }));
      const params = new URLSearchParams({ limit: "25" });
      if (query.trim()) params.set("query", query.trim());
      if (cursor) params.set("cursor", cursor);
      try {
        const page = await request<SearchUsersResponse>(
          `${ENDPOINTS.SEARCH_USERS}?${params}`,
        );
        if (number !== sequence.current.users) return;
        setUsers((previous) => ({
          data:
            cursor && previous.data
              ? { ...page, users: [...previous.data.users, ...page.users] }
              : page,
          loading: false,
          error: null,
        }));
      } catch (error) {
        if (number === sequence.current.users)
          setUsers((previous) => ({
            ...previous,
            loading: false,
            error: failure(error),
          }));
      }
    },
    [request],
  );

  const loadSession = useCallback(async () => {
    const number = ++sequence.current.session;
    setSession((previous) => ({ ...previous, loading: true, error: null }));
    try {
      const data = await request<{
        session: DevtoolsSessionView | null;
        managedUser?: ManagedTestUserRecord | null;
      }>(ENDPOINTS.SESSION);
      if (number !== sequence.current.session) return;
      setSession({ data: data.session, loading: false, error: null });
      setManagedUser(data.managedUser ?? null);
    } catch (error) {
      if (number === sequence.current.session)
        setSession({ data: null, loading: false, error: failure(error) });
      if (number === sequence.current.session) setManagedUser(null);
    }
  }, [request]);

  useEffect(() => {
    if (!isOpen || !config.data) return;
    const sequenceState = sequence.current;
    const timer = window.setTimeout(() => {
      void loadUsers(deferredSearch);
    }, 250);
    return () => {
      window.clearTimeout(timer);
      sequenceState.users += 1;
    };
  }, [isOpen, config.data, deferredSearch, loadUsers]);
  useEffect(() => {
    if (!isOpen || !config.data) return;
    const sequenceState = sequence.current;
    void loadSession();
    return () => {
      sequenceState.session += 1;
    };
  }, [isOpen, config.data, loadSession]);

  const close = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);
  useEffect(() => {
    if (pendingDeletion) cancelDeletionRef.current?.focus();
  }, [pendingDeletion]);

  const post = useCallback(
    <T,>(path: string, body: unknown) =>
      request<T>(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    [request],
  );
  const syncHost = useCallback(
    async (kind: SessionChange, message: string) => {
      if (reloadOnSessionChange === false && onSessionChange) {
        try {
          await onSessionChange(kind);
          return;
        } catch {
          /* A reload is still required to synchronize the host. */
        }
      }
      try {
        sessionStorage.setItem(flashKey, message);
      } catch {
        /* Storage may be unavailable. */
      }
      window.location.reload();
    },
    [flashKey, onSessionChange, reloadOnSessionChange],
  );
  const discardIfDirty = () => {
    if (!isDirty || !session.data) return true;
    if (!window.confirm("Discard unsaved user edits?")) return false;
    const userId = session.data.userId;
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[userId];
      return next;
    });
    return true;
  };
  const run = async (
    kind: Exclude<Action, null>,
    work: () => Promise<void>,
  ) => {
    if (action) return;
    setAction(kind);
    setActionError(null);
    setNotice(null);
    sequence.current.session += 1;
    setSession((previous) => ({ ...previous, loading: false }));
    try {
      await work();
    } catch (error) {
      const detail = failure(error);
      setActionError(
        detail.code === "NETWORK_ERROR"
          ? detail.message
          : `${detail.code}: ${detail.message}`,
      );
      if (kind !== "create") await loadSession();
    } finally {
      setAction(null);
    }
  };

  const switchTo = async (user: ManagedTestUserRecord) => {
    if (session.data?.userId === user.userId) {
      setNotice(`${user.email} is already active.`);
      return;
    }
    if (!discardIfDirty()) return;
    await run("switch", async () => {
      const data = await post<{ session: DevtoolsSessionView }>(
        ENDPOINTS.LOGIN,
        { userId: user.userId },
      );
      sequence.current.session += 1;
      setSession({ data: data.session, loading: false, error: null });
      setManagedUser(user);
      setCreatedToRetry(null);
      setNotice(`Switched to ${user.email}.`);
      await syncHost("switch", `Switched to ${user.email}.`);
    });
  };
  const create = async (template: string, switchAfter: boolean) => {
    if (switchAfter && !discardIfDirty()) return;
    await run(switchAfter ? "create-switch" : "create", async () => {
      const data = await post<{ user: ManagedTestUserRecord }>(
        ENDPOINTS.CREATE_USER,
        { template },
      );
      setNotice(`Created ${data.user.email}.`);
      await loadUsers(deferredSearch);
      if (!switchAfter) {
        await loadSession();
        return;
      }
      setCreatedToRetry(data.user);
      try {
        const login = await post<{ session: DevtoolsSessionView }>(
          ENDPOINTS.LOGIN,
          { userId: data.user.userId },
        );
        sequence.current.session += 1;
        setSession({ data: login.session, loading: false, error: null });
        setManagedUser(data.user);
        setCreatedToRetry(null);
        setNotice(`Created and switched to ${data.user.email}.`);
        await syncHost("switch", `Created and switched to ${data.user.email}.`);
      } catch (error) {
        throw {
          ...failure(error),
          message: `Created ${data.user.email}, but switching failed. Use Retry switch; it will not create another user. ${failure(error).message}`,
        };
      }
    });
  };
  const signOut = async () => {
    if (!discardIfDirty()) return;
    await run("sign-out", async () => {
      await post<{ success: true }>("/sign-out", {});
      sequence.current.session += 1;
      setSession({ data: null, loading: false, error: null });
      setManagedUser(null);
      setNotice("Signed out.");
      await syncHost("sign-out", "Signed out.");
    });
  };
  const deleteUser = async (user: ManagedTestUserRecord) => {
    if (user.userId === session.data?.userId && !discardIfDirty()) return;
    await run("delete", async () => {
      await post<{ success: true }>(ENDPOINTS.DELETE_USER, {
        userId: user.userId,
      });
      setPendingDeletion(null);
      if (createdToRetry?.userId === user.userId) setCreatedToRetry(null);
      await Promise.all([loadUsers(deferredSearch), loadSession()]);
      setNotice(`Deleted ${user.email}.`);
      if (user.userId === session.data?.userId)
        await syncHost("delete", `Deleted ${user.email}.`);
    });
  };
  const save = async () => {
    if (
      !session.data ||
      session.loading ||
      !isDirty ||
      Object.keys(fieldErrors).length
    )
      return;
    const userId = session.data.userId;
    await run("edit", async () => {
      const data = await post<{ session: DevtoolsSessionView }>(
        ENDPOINTS.UPDATE_SESSION,
        { patch },
      );
      sequence.current.session += 1;
      setSession({ data: data.session, loading: false, error: null });
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[userId];
        return next;
      });
      setNotice("Saved user changes.");
      await syncHost("edit", "Saved user changes.");
    });
  };
  const setField = (field: string, value: DraftValue) => {
    if (!session.data) return;
    const userId = session.data.userId;
    setDrafts((previous) => ({
      ...previous,
      [userId]: { ...previous[userId], [field]: value },
    }));
  };
  const reset = () => {
    if (!session.data) return;
    const userId = session.data.userId;
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[userId];
      return next;
    });
  };

  if (
    production ||
    enabledProp === false ||
    config.error?.code === "FEATURE_DISABLED"
  )
    return null;
  const positionStyle = {
    "bottom-right": { bottom: "16px", right: "16px" },
    "bottom-left": { bottom: "16px", left: "16px" },
    "top-right": { top: "16px", right: "16px" },
    "top-left": { top: "16px", left: "16px" },
  }[position];
  const configEndpoint = endpoint(ENDPOINTS.CONFIG);

  return (
    <div
      data-better-auth-devtools=""
      style={{ ...styles.container, ...positionStyle }}
    >
      <style>{`[data-better-auth-devtools] :is(button,input,select,summary):focus-visible{outline:2px solid #a0c4ff;outline-offset:2px}[data-better-auth-devtools] button:disabled{opacity:.55;cursor:not-allowed}`}</style>
      {!isOpen ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          style={styles.trigger}
        >
          {triggerLabel}
          {config.error ? " · Setup" : ""}
        </button>
      ) : (
        <dialog
          open
          aria-labelledby={`${id}-title`}
          aria-busy={Boolean(action)}
          style={styles.panel}
        >
          <div style={styles.header}>
            <h2 id={`${id}-title`} style={styles.headerTitle}>
              {triggerLabel}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              style={styles.closeButton}
              aria-label="Close Better Auth DevTools"
            >
              ×
            </button>
          </div>
          {config.loading && !config.data ? (
            <div style={styles.section}>Connecting to DevTools…</div>
          ) : null}
          {config.error ? (
            <div style={styles.section} role="alert">
              <p style={styles.errorText}>
                {discoveryMessage(config.error, configEndpoint)}
              </p>
              <button
                type="button"
                style={styles.refreshButton}
                onClick={() => setRetry((value) => value + 1)}
              >
                Retry connection
              </button>
            </div>
          ) : null}
          {config.data ? (
            <>
              <div style={styles.summary}>
                <div style={styles.sectionTitle}>
                  <h3 style={styles.sectionHeading}>Current identity</h3>
                  <button
                    type="button"
                    aria-label="Refresh session"
                    style={styles.refreshButton}
                    onClick={() => void loadSession()}
                    disabled={Boolean(action)}
                  >
                    Refresh
                  </button>
                </div>
                {session.loading && !session.data ? (
                  <span style={styles.muted}>Reading session…</span>
                ) : session.error ? (
                  <span role="alert" style={styles.errorText}>
                    {session.error.message}
                  </span>
                ) : session.data ? (
                  <>
                    <div style={styles.identityName}>
                      {session.data.label ??
                        session.data.email ??
                        session.data.userId}
                    </div>
                    <div style={styles.userEmail}>
                      {session.data.email ?? session.data.userId}
                    </div>
                    <div style={styles.summaryActions}>
                      {managedUser ? (
                        <span style={styles.activeBadge}>Managed · active</span>
                      ) : (
                        <span style={styles.muted}>Current user</span>
                      )}
                      <button
                        type="button"
                        onClick={() => void signOut()}
                        disabled={Boolean(action)}
                        style={styles.refreshButton}
                      >
                        {action === "sign-out" ? "Signing out…" : "Sign out"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={styles.muted}>Signed out</div>
                )}
              </div>
              {actionError ? (
                <div role="alert" style={styles.errorBanner}>
                  {actionError}
                </div>
              ) : null}
              {notice ? (
                <div role="status" style={styles.successBanner}>
                  {notice}
                </div>
              ) : null}
              {createdToRetry ? (
                <div style={styles.retryBox}>
                  <span>{createdToRetry.email} was created.</span>
                  <button
                    type="button"
                    onClick={() => void switchTo(createdToRetry)}
                    disabled={Boolean(action)}
                    style={styles.loginButton}
                  >
                    Retry switch
                  </button>
                </div>
              ) : null}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <h3 style={styles.sectionHeading}>Managed users</h3>
                  <button
                    type="button"
                    aria-label="Refresh managed users"
                    style={styles.refreshButton}
                    onClick={() => void loadUsers(deferredSearch)}
                    disabled={Boolean(action)}
                  >
                    Refresh
                  </button>
                </div>
                <label htmlFor={`${id}-search`} style={styles.srOnly}>
                  Search managed users
                </label>
                <input
                  id={`${id}-search`}
                  type="search"
                  autoComplete="off"
                  placeholder="Search name, email, template…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={styles.searchInput}
                />
                {users.loading && !users.data ? (
                  <div style={styles.muted}>Loading users…</div>
                ) : null}
                {users.error ? (
                  <div role="alert" style={styles.errorText}>
                    {users.error.message}{" "}
                    <button
                      type="button"
                      style={styles.refreshButton}
                      onClick={() => void loadUsers(deferredSearch)}
                    >
                      Retry
                    </button>
                  </div>
                ) : null}
                {users.data?.users.length === 0 && !users.loading ? (
                  <div style={styles.muted}>
                    {search.trim()
                      ? "No search results."
                      : "No managed users yet. Create one below."}
                  </div>
                ) : null}
                {users.data?.users.length ? (
                  <div style={styles.userList}>
                    {users.data.users.map((user) => (
                      <div key={user.id} style={styles.userRow}>
                        <div style={styles.userInfo}>
                          <div style={styles.userLabel}>
                            {user.label}{" "}
                            {session.data?.userId === user.userId ? (
                              <span style={styles.activeBadge}>Active</span>
                            ) : null}
                          </div>
                          <div style={styles.userEmail} title={user.email}>
                            {user.email}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void switchTo(user)}
                          disabled={
                            Boolean(action) ||
                            session.loading ||
                            Boolean(session.error) ||
                            user.userId === session.data?.userId
                          }
                          style={styles.loginButton}
                        >
                          {action === "switch"
                            ? "Switching…"
                            : user.userId === session.data?.userId
                              ? "Current"
                              : "Switch"}
                        </button>
                        <details style={styles.rowDetails}>
                          <summary
                            aria-label={`More actions for ${user.email}`}
                            style={styles.rowMore}
                          >
                            ⋯
                          </summary>
                          <button
                            type="button"
                            onClick={() => setPendingDeletion(user)}
                            disabled={Boolean(action)}
                            style={styles.deleteButton}
                            aria-label={`Delete ${user.email}`}
                          >
                            Delete user
                          </button>
                        </details>
                      </div>
                    ))}
                  </div>
                ) : null}
                {pendingDeletion ? (
                  <dialog
                    open
                    role="alertdialog"
                    aria-label={`Confirm deletion of ${pendingDeletion.email}`}
                    style={styles.confirmBox}
                  >
                    <p>
                      Delete <strong>{pendingDeletion.email}</strong> (
                      {pendingDeletion.userId})? This cannot be undone.
                    </p>
                    <div style={styles.confirmActions}>
                      <button
                        ref={cancelDeletionRef}
                        type="button"
                        onClick={() => setPendingDeletion(null)}
                        style={styles.refreshButton}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteUser(pendingDeletion)}
                        disabled={Boolean(action)}
                        style={styles.deleteButton}
                      >
                        {action === "delete" ? "Deleting…" : "Confirm delete"}
                      </button>
                    </div>
                  </dialog>
                ) : null}
                {users.data?.hasMore ? (
                  <button
                    type="button"
                    style={styles.moreButton}
                    onClick={() =>
                      void loadUsers(
                        deferredSearch,
                        users.data?.nextCursor ?? undefined,
                      )
                    }
                    disabled={users.loading || Boolean(action)}
                  >
                    {users.loading ? "Loading…" : "Load more users"}
                  </button>
                ) : null}
              </div>
              {templateOptions.length ? (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Create test user</h3>
                  <div style={styles.templateGrid}>
                    {templateOptions.map((template) => (
                      <div key={template.key} style={styles.templateRow}>
                        <span>{template.label}</span>
                        <div style={styles.templateActions}>
                          <button
                            type="button"
                            onClick={() => void create(template.key, false)}
                            disabled={Boolean(action)}
                            style={styles.templateButton}
                          >
                            {action === "create" ? "Creating…" : "Create"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void create(template.key, true)}
                            disabled={Boolean(action)}
                            style={styles.loginButton}
                          >
                            {action === "create-switch"
                              ? "Creating…"
                              : "Create & Switch"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <details style={styles.section}>
                <summary style={styles.detailsSummary}>
                  Inspect current session
                </summary>
                {session.data ? (
                  <>
                    <p style={styles.helper}>
                      Fresh server read. Session token and sensitive fields are
                      hidden.
                    </p>
                    <div style={styles.sessionFields}>
                      {Object.entries(session.data.fields).map(
                        ([key, value]) => (
                          <div key={key} style={styles.fieldRow}>
                            <span style={styles.fieldKey}>{key}</span>
                            <span style={styles.fieldValue}>
                              {typeof value === "object" && value !== null
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </>
                ) : (
                  <p style={styles.muted}>No active session.</p>
                )}
              </details>
              {session.data && !session.error && activeFields.length ? (
                <details style={styles.section}>
                  <summary style={styles.detailsSummary}>
                    {config.data.capabilities.editTarget === "custom"
                      ? "Edit application data"
                      : "Edit user fields"}
                    {isDirty ? " · Unsaved" : ""}
                  </summary>
                  <p style={styles.helper}>
                    {config.data.capabilities.editTarget === "custom"
                      ? "Changes use the application's patch hook."
                      : "These changes update persistent Better Auth user fields."}
                  </p>
                  {activeFields.map((field) => (
                    <div key={field.key} style={styles.editFieldRow}>
                      <label
                        htmlFor={`${id}-${field.key}`}
                        style={styles.editFieldLabel}
                      >
                        {field.label}
                      </label>
                      {field.type === "boolean" ? (
                        <input
                          id={`${id}-${field.key}`}
                          type="checkbox"
                          checked={Boolean(
                            Object.hasOwn(currentDraft, field.key)
                              ? currentDraft[field.key]
                              : fieldValue(session.data, field),
                          )}
                          onChange={(event) =>
                            setField(field.key, event.target.checked)
                          }
                        />
                      ) : field.type === "select" ? (
                        <select
                          id={`${id}-${field.key}`}
                          value={String(
                            Object.hasOwn(currentDraft, field.key)
                              ? currentDraft[field.key]
                              : fieldValue(session.data, field),
                          )}
                          onChange={(event) =>
                            setField(field.key, event.target.value)
                          }
                          style={styles.editInput}
                        >
                          <option value="">Select…</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={`${id}-${field.key}`}
                          type={field.type === "number" ? "number" : "text"}
                          value={String(
                            Object.hasOwn(currentDraft, field.key)
                              ? currentDraft[field.key]
                              : fieldValue(session.data, field),
                          )}
                          onChange={(event) =>
                            setField(field.key, event.target.value)
                          }
                          style={styles.editInput}
                        />
                      )}
                      {fieldErrors[field.key] ? (
                        <span role="alert" style={styles.errorText}>
                          {fieldErrors[field.key]}
                        </span>
                      ) : null}
                    </div>
                  ))}
                  <div style={styles.editActions}>
                    <button
                      type="button"
                      onClick={reset}
                      disabled={!isDirty || session.loading || Boolean(action)}
                      style={styles.refreshButton}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => void save()}
                      disabled={
                        !isDirty ||
                        session.loading ||
                        Boolean(action) ||
                        Object.keys(fieldErrors).length > 0
                      }
                      style={styles.saveButton}
                    >
                      {action === "edit"
                        ? "Saving…"
                        : reloadOnSessionChange === false && onSessionChange
                          ? "Save changes"
                          : "Save & Reload"}
                    </button>
                  </div>
                </details>
              ) : null}
            </>
          ) : null}
        </dialog>
      )}
    </div>
  );
}
