import type { BetterAuthClientPlugin } from "better-auth/client";
import { ENDPOINTS } from "./endpoints.js";
import type { devtoolsPlugin } from "./server-plugin.js";

export const devtoolsClientPlugin = () => {
  return {
    id: "better-auth-devtools",
    $InferServerPlugin: {} as ReturnType<typeof devtoolsPlugin>,
    getActions: ($fetch) => {
      return {
        listDevtoolsUsers: async () => {
          return $fetch(ENDPOINTS.LIST_USERS);
        },
        createDevtoolsUser: async (data: { template: string }) => {
          return $fetch(ENDPOINTS.CREATE_USER, {
            method: "POST",
            body: data,
          });
        },
        loginAsDevtoolsUser: async (data: { userId: string }) => {
          return $fetch(ENDPOINTS.LOGIN, {
            method: "POST",
            body: data,
          });
        },
        getDevtoolsSession: async () => {
          return $fetch(ENDPOINTS.SESSION);
        },
        updateDevtoolsSession: async (data: {
          patch: Record<string, unknown>;
        }) => {
          return $fetch(ENDPOINTS.UPDATE_SESSION, {
            method: "POST",
            body: data,
          });
        },
      };
    },
    pathMethods: {
      [ENDPOINTS.CREATE_USER]: "POST",
      [ENDPOINTS.LOGIN]: "POST",
      [ENDPOINTS.UPDATE_SESSION]: "POST",
    },
  } satisfies BetterAuthClientPlugin;
};
