import type { BetterAuthClientPlugin } from "better-auth/client";
import { ENDPOINTS } from "@better-auth-devtools/core";
import type { devtoolsPlugin } from "./server-plugin.js";

export const devtoolsClientPlugin = () => {
  return {
    id: "better-auth-devtools",
    $InferServerPlugin: {} as ReturnType<typeof devtoolsPlugin>,
    pathMethods: {
      [ENDPOINTS.CREATE_USER]: "POST",
      [ENDPOINTS.LOGIN]: "POST",
      [ENDPOINTS.UPDATE_SESSION]: "POST",
    },
  } satisfies BetterAuthClientPlugin;
};
