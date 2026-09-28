// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BetterAuthDevtools } from "./devtools-panel.js";
import { ENDPOINTS } from "../endpoints.js";

const config = {
  enabled: true,
  templates: [{ key: "admin", label: "Admin" }],
  editableFields: [],
  capabilities: {
    createUsers: true,
    deleteUsers: true,
    editSession: false,
    editTarget: "user",
  },
};
const managed = {
  id: "record-1",
  userId: "user-1",
  label: "Admin",
  email: "admin@test.local",
  templateKey: "admin",
  createdAt: new Date().toISOString(),
};
function json(body: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}
function basicFetch(input: RequestInfo | URL) {
  const url = String(input);
  if (url.endsWith(ENDPOINTS.CONFIG)) return json(config);
  if (url.includes(ENDPOINTS.SEARCH_USERS))
    return json({ users: [], hasMore: false, nextCursor: null });
  if (url.endsWith(ENDPOINTS.SESSION)) return json({ session: null });
  throw new Error(`Unexpected request: ${url}`);
}
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe("BetterAuthDevtools", () => {
  it("discovers the server, shows signed-out state, and exposes both creation paths", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) =>
      basicFetch(input),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<BetterAuthDevtools />);
    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: "Auth DevTools" }));
    expect(await screen.findByText("Signed out")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Create & Switch" }),
    ).toBeTruthy();
    expect(
      await screen.findByText("No managed users yet. Create one below."),
    ).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/auth${ENDPOINTS.CONFIG}`,
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("shows a useful discovery failure and recovers on retry", async () => {
    let available = false;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).endsWith(ENDPOINTS.CONFIG) && !available)
          return json({ code: "NOT_FOUND" }, 404);
        return basicFetch(input);
      }),
    );
    render(<BetterAuthDevtools basePath="/custom/auth" />);
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /Auth DevTools/ }),
    );
    expect(
      await screen.findByText(
        /DevTools was not found at \/custom\/auth\/better-auth-devtools\/config/,
      ),
    ).toBeTruthy();
    available = true;
    await user.click(screen.getByRole("button", { name: "Retry connection" }));
    expect(
      await screen.findByRole("button", { name: "Create & Switch" }),
    ).toBeTruthy();
  });

  it("keeps a rate-limited discovery visible with retry timing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        json({ code: "RATE_LIMITED", message: "Wait", retryAfter: 9 }, 429, {
          "retry-after": "9",
        }),
      ),
    );
    render(<BetterAuthDevtools />);
    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: /Auth DevTools/ }));
    expect(await screen.findByText(/Retry in 9 seconds/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Retry connection" }),
    ).toBeTruthy();
  });

  it("loads another bounded page and sends search to the server", async () => {
    const firstPage = Array.from({ length: 25 }, (_, index) => ({
      ...managed,
      id: `record-${index}`,
      userId: `user-${index}`,
      email: `user-${index}@test.local`,
    }));
    const older = {
      ...managed,
      id: "record-older",
      userId: "user-older",
      email: "older@test.local",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes(ENDPOINTS.SEARCH_USERS)) {
        const params = new URL(url, "http://localhost").searchParams;
        if (params.get("query") === "older")
          return json({ users: [older], hasMore: false, nextCursor: null });
        if (params.get("cursor") === "record-24")
          return json({ users: [older], hasMore: false, nextCursor: null });
        return json({
          users: firstPage,
          hasMore: true,
          nextCursor: "record-24",
        });
      }
      return basicFetch(input);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<BetterAuthDevtools />);
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Auth DevTools" }),
    );
    await user.click(
      await screen.findByRole("button", { name: "Load more users" }),
    );
    expect(await screen.findByText("older@test.local")).toBeTruthy();
    await user.type(
      screen.getByRole("searchbox", { name: "Search managed users" }),
      "older",
    );
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([input]) =>
          String(input).includes("query=older"),
        ),
      ).toBe(true),
    );
    expect(screen.getByText("older@test.local")).toBeTruthy();
  });

  it("retains a created user for retry when Create & Switch fails", async () => {
    let loginAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith(ENDPOINTS.CREATE_USER)) return json({ user: managed });
      if (url.endsWith(ENDPOINTS.LOGIN)) {
        loginAttempts++;
        return loginAttempts === 1
          ? json({ code: "SESSION_CREATION_FAILED", message: "Try again" }, 500)
          : json({
              session: {
                userId: managed.userId,
                email: managed.email,
                fields: {},
              },
            });
      }
      return basicFetch(input);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <BetterAuthDevtools
        reloadOnSessionChange={false}
        onSessionChange={() => {}}
      />,
    );
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Auth DevTools" }),
    );
    await user.click(
      await screen.findByRole("button", { name: "Create & Switch" }),
    );
    expect(
      await screen.findByRole("button", { name: "Retry switch" }),
    ).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Retry switch" }));
    await waitFor(() =>
      expect(
        screen.getByText(/Created and switched|Switched to admin@test.local/),
      ).toBeTruthy(),
    );
    expect(
      fetchMock.mock.calls.filter(([input]) =>
        String(input).endsWith(ENDPOINTS.CREATE_USER),
      ),
    ).toHaveLength(1);
    expect(loginAttempts).toBe(2);
  });

  it("sends only changed fields, validates clearing, and preserves drafts on refresh", async () => {
    const onSessionChange = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith(ENDPOINTS.CONFIG))
        return json({
          ...config,
          editableFields: [
            { key: "credits", label: "Credits", type: "number" },
            { key: "verified", label: "Verified", type: "boolean" },
            { key: "nickname", label: "Nickname", type: "string" },
          ],
          capabilities: { ...config.capabilities, editSession: true },
        });
      if (url.endsWith(ENDPOINTS.SESSION))
        return json({
          session: {
            userId: "user-1",
            fields: { credits: 1, verified: false, nickname: "Old" },
          },
          managedUser: managed,
        });
      if (url.endsWith(ENDPOINTS.UPDATE_SESSION))
        return json({
          session: {
            userId: "user-1",
            fields: { credits: 1, verified: true, nickname: "" },
          },
        });
      return basicFetch(input);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <BetterAuthDevtools
        reloadOnSessionChange={false}
        onSessionChange={onSessionChange}
      />,
    );
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Auth DevTools" }),
    );
    await user.click(await screen.findByText("Edit user fields"));
    await user.clear(await screen.findByLabelText("Credits"));
    expect(
      await screen.findByText(/Clearing this field is not supported/),
    ).toBeTruthy();
    await user.type(screen.getByLabelText("Credits"), "1");
    await user.click(screen.getByRole("button", { name: "Refresh session" }));
    await user.click(screen.getByLabelText("Verified"));
    await user.clear(screen.getByLabelText("Nickname"));
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => {
      const update = fetchMock.mock.calls.find(([input]) =>
        String(input).endsWith(ENDPOINTS.UPDATE_SESSION),
      );
      expect(JSON.parse(String(update?.[1]?.body))).toEqual({
        patch: { verified: true, nickname: "" },
      });
    });
    expect(onSessionChange).toHaveBeenCalledWith("edit");
  });

  it("shows current user and signs out through Better Auth", async () => {
    const onSessionChange = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith(ENDPOINTS.SESSION))
        return json({
          session: { userId: managed.userId, email: managed.email, fields: {} },
          managedUser: managed,
        });
      if (url.includes(ENDPOINTS.SEARCH_USERS))
        return json({ users: [managed], hasMore: false, nextCursor: null });
      if (url.endsWith("/sign-out")) return json({ success: true });
      return basicFetch(input);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <BetterAuthDevtools
        reloadOnSessionChange={false}
        onSessionChange={onSessionChange}
      />,
    );
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Auth DevTools" }),
    );
    const current = await screen.findByRole("button", { name: "Current" });
    expect((current as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([input]) =>
          String(input).endsWith("/sign-out"),
        ),
      ).toBe(true),
    );
    expect(onSessionChange).toHaveBeenCalledWith("sign-out");
    expect(screen.getByText("Signed out")).toBeTruthy();
  });

  it("refreshes identity and users after deleting the active managed user", async () => {
    let deleted = false;
    const onSessionChange = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith(ENDPOINTS.SESSION))
        return json({
          session: deleted
            ? null
            : { userId: managed.userId, email: managed.email, fields: {} },
          managedUser: deleted ? null : managed,
        });
      if (url.includes(ENDPOINTS.SEARCH_USERS))
        return json({
          users: deleted ? [] : [managed],
          hasMore: false,
          nextCursor: null,
        });
      if (url.endsWith(ENDPOINTS.DELETE_USER)) {
        deleted = true;
        return json({ success: true });
      }
      return basicFetch(input);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <BetterAuthDevtools
        reloadOnSessionChange={false}
        onSessionChange={onSessionChange}
      />,
    );
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Auth DevTools" }),
    );
    await user.click(
      await screen.findByLabelText(`More actions for ${managed.email}`),
    );
    await user.click(
      screen.getByRole("button", { name: `Delete ${managed.email}` }),
    );
    expect(
      screen.getByRole("alertdialog", {
        name: `Confirm deletion of ${managed.email}`,
      }).textContent,
    ).toContain(managed.userId);
    await user.click(screen.getByRole("button", { name: "Confirm delete" }));
    await waitFor(() => expect(screen.getByText("Signed out")).toBeTruthy());
    expect(onSessionChange).toHaveBeenCalledWith("delete");
    expect(
      fetchMock.mock.calls.filter(([input]) =>
        String(input).endsWith(ENDPOINTS.SESSION),
      ),
    ).toHaveLength(2);
  });

  it("ignores an older session read after a newer refresh", async () => {
    let resolveOld: ((value: Response) => void) | undefined;
    const oldRead = new Promise<Response>((resolve) => {
      resolveOld = resolve;
    });
    let sessionReads = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith(ENDPOINTS.SESSION)) {
          sessionReads++;
          if (sessionReads === 1) return json({ session: null });
          if (sessionReads === 2) return oldRead;
          return json({
            session: {
              userId: managed.userId,
              email: managed.email,
              fields: {},
            },
            managedUser: managed,
          });
        }
        if (url.includes(ENDPOINTS.SEARCH_USERS))
          return json({ users: [managed], hasMore: false, nextCursor: null });
        return basicFetch(input);
      }),
    );
    render(
      <BetterAuthDevtools
        reloadOnSessionChange={false}
        onSessionChange={() => {}}
      />,
    );
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Auth DevTools" }),
    );
    await screen.findByText("Signed out");
    await user.click(screen.getByRole("button", { name: "Refresh session" }));
    await user.click(screen.getByRole("button", { name: "Refresh session" }));
    resolveOld?.(json({ session: null }));
    await waitFor(() =>
      expect(screen.getByText("Managed · active")).toBeTruthy(),
    );
    expect(screen.queryByText("Signed out")).toBeNull();
  });

  it("restores its open state on remount for the same auth path", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => basicFetch(input)),
    );
    const first = render(<BetterAuthDevtools />);
    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: "Auth DevTools" }));
    await waitFor(() =>
      expect(
        sessionStorage.getItem(
          `better-auth-devtools:open:${window.location.origin}:/api/auth`,
        ),
      ).toBe("true"),
    );
    first.unmount();
    render(<BetterAuthDevtools />);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("stays hidden when the server explicitly disables DevTools", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ code: "FEATURE_DISABLED" }, 403)),
    );
    const { container } = render(<BetterAuthDevtools />);
    await waitFor(() => expect(container.childElementCount).toBe(0));
  });
});
