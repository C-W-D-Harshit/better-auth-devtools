import { describe, expect, it } from "vitest";
import { devtoolsClientPlugin } from "./client-plugin.js";
import { ENDPOINTS } from "./endpoints.js";

describe("devtoolsClientPlugin", () => {
  it("exposes typed action factories and path methods", async () => {
    const plugin = devtoolsClientPlugin();
    const calls: Array<{ path: string; options?: Record<string, unknown> }> = [];
    const $fetch = async (path: string, options?: Record<string, unknown>) => {
      calls.push({ path, options });
      return { ok: true };
    };

    expect(plugin.pathMethods).toMatchObject({
      [ENDPOINTS.CREATE_USER]: "POST",
      [ENDPOINTS.DELETE_USER]: "POST",
      [ENDPOINTS.LOGIN]: "POST",
      [ENDPOINTS.UPDATE_SESSION]: "POST",
    });

    const actions = plugin.getActions?.($fetch);
    expect(actions).toBeTruthy();

    await actions?.getDevtoolsConfig();
    await actions?.createDevtoolsUser({ template: "admin" });
    await actions?.deleteDevtoolsUser({ userId: "user_old" });
    await actions?.loginAsDevtoolsUser({ userId: "user_admin_1" });
    await actions?.getDevtoolsSession();

    expect(calls).toEqual([
      {
        path: ENDPOINTS.CONFIG,
        options: undefined,
      },
      {
        path: ENDPOINTS.CREATE_USER,
        options: { method: "POST", body: { template: "admin" } },
      },
      {
        path: ENDPOINTS.DELETE_USER,
        options: { method: "POST", body: { userId: "user_old" } },
      },
      {
        path: ENDPOINTS.LOGIN,
        options: { method: "POST", body: { userId: "user_admin_1" } },
      },
      {
        path: ENDPOINTS.SESSION,
        options: undefined,
      },
    ]);
  });
});
