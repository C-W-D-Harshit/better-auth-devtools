// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BetterAuthDevtools } from "./devtools-panel.js";
import { ENDPOINTS } from "../endpoints.js";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("BetterAuthDevtools", () => {
  it("discovers templates from the server and opens with no props", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith(ENDPOINTS.CONFIG)) {
        return json({
          enabled: true,
          templates: [{ key: "admin", label: "Admin" }],
          editableFields: [],
          capabilities: {
            createUsers: true,
            deleteUsers: true,
            editSession: false,
          },
        });
      }
      if (url.endsWith(ENDPOINTS.LIST_USERS)) return json([]);
      if (url.endsWith(ENDPOINTS.SESSION)) return json({ session: null });
      throw new Error(`Unexpected request: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<BetterAuthDevtools />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Auth DevTools" }));

    expect(
      await screen.findByRole("button", { name: "+ Admin" })
    ).toBeTruthy();
    expect(screen.getByText("No active session")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/auth${ENDPOINTS.CONFIG}`,
      expect.objectContaining({ credentials: "include" })
    );
  });

  it("serializes number and boolean edits with their real types", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith(ENDPOINTS.CONFIG)) {
          return json({
            enabled: true,
            templates: [],
            editableFields: [
              { key: "credits", label: "Credits", type: "number" },
              { key: "verified", label: "Verified", type: "boolean" },
            ],
            capabilities: {
              createUsers: true,
              deleteUsers: true,
              editSession: true,
            },
          });
        }
        if (url.endsWith(ENDPOINTS.LIST_USERS)) return json([]);
        if (url.endsWith(ENDPOINTS.SESSION)) {
          return json({
            session: {
              userId: "user-1",
              fields: { credits: 1, verified: false },
            },
          });
        }
        if (url.endsWith(ENDPOINTS.UPDATE_SESSION)) {
          return json({
            session: { userId: "user-1", fields: { credits: 42, verified: true } },
          });
        }
        throw new Error(`Unexpected request: ${url} ${init?.method ?? "GET"}`);
      }
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<BetterAuthDevtools reloadOnSessionChange={false} />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Auth DevTools" }));
    const credits = await screen.findByLabelText("Credits");
    expect((credits as HTMLInputElement).value).toBe("1");
    await user.clear(credits);
    await user.type(credits, "42");
    await user.click(screen.getByLabelText("Verified"));
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      const updateCall = fetchMock.mock.calls.find(([input]) =>
        String(input).endsWith(ENDPOINTS.UPDATE_SESSION)
      );
      expect(updateCall).toBeTruthy();
      expect(JSON.parse(String(updateCall?.[1]?.body))).toEqual({
        patch: { credits: 42, verified: true },
      });
    });
  });

  it("initializes editable values, permits empty strings, and supports Escape", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith(ENDPOINTS.CONFIG)) {
          return json({
            enabled: true,
            templates: [],
            editableFields: [{ key: "nickname", label: "Nickname", type: "string" }],
            capabilities: {
              createUsers: true,
              deleteUsers: true,
              editSession: true,
            },
          });
        }
        if (url.endsWith(ENDPOINTS.LIST_USERS)) return json([]);
        if (url.endsWith(ENDPOINTS.SESSION)) {
          return json({
            session: { userId: "user-1", fields: { nickname: "Harshit" } },
          });
        }
        if (url.endsWith(ENDPOINTS.UPDATE_SESSION)) {
          return json({
            session: { userId: "user-1", fields: { nickname: "" } },
          });
        }
        throw new Error(`Unexpected request: ${url} ${init?.method ?? "GET"}`);
      }
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<BetterAuthDevtools reloadOnSessionChange={false} />);
    const user = userEvent.setup();
    const trigger = await screen.findByRole("button", { name: "Auth DevTools" });
    await user.click(trigger);

    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "Search managed users" })).toBeTruthy();
    const nickname = await screen.findByLabelText("Nickname");
    expect((nickname as HTMLInputElement).value).toBe("Harshit");
    await user.clear(nickname);
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      const updateCall = fetchMock.mock.calls.find(([input]) =>
        String(input).endsWith(ENDPOINTS.UPDATE_SESSION)
      );
      expect(JSON.parse(String(updateCall?.[1]?.body))).toEqual({
        patch: { nickname: "" },
      });
    });

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Auth DevTools" })
      )
    );
  });

  it("stays hidden when the server says DevTools is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ code: "FEATURE_DISABLED" }, 403)));

    const { container } = render(<BetterAuthDevtools />);
    await waitFor(() => expect(container.childElementCount).toBe(0));
  });
});
