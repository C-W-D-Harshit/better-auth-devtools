import type { BetterAuthClientPlugin } from "better-auth/client";
import { ENDPOINTS } from "./endpoints.js";
import type {
  CreateUserResponse,
  DevtoolsErrorResponse,
  ListUsersResponse,
  LoginResponse,
  SessionResponse,
  UpdateSessionResponse,
} from "./payloads.js";
import type { devtoolsPlugin } from "./server-plugin.js";

type DevtoolsFetchError = DevtoolsErrorResponse["error"] & {
  status: number;
  statusText: string;
};

type DevtoolsFetchResult<T> = Promise<
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: DevtoolsFetchError;
    }
>;

interface DevtoolsClientActions {
  listDevtoolsUsers: () => DevtoolsFetchResult<ListUsersResponse>;
  createDevtoolsUser: (data: { template: string }) => DevtoolsFetchResult<CreateUserResponse>;
  loginAsDevtoolsUser: (data: { userId: string }) => DevtoolsFetchResult<LoginResponse>;
  getDevtoolsSession: () => DevtoolsFetchResult<SessionResponse>;
  updateDevtoolsSession: (data: {
    patch: Record<string, unknown>;
  }) => DevtoolsFetchResult<UpdateSessionResponse>;
}

export const devtoolsClientPlugin = () => {
  return {
    id: "better-auth-devtools",
    $InferServerPlugin: {} as ReturnType<typeof devtoolsPlugin>,
    getActions: ($fetch): DevtoolsClientActions => {
      return {
        listDevtoolsUsers: async () => {
          return $fetch<ListUsersResponse, DevtoolsFetchError>(
            ENDPOINTS.LIST_USERS
          );
        },
        createDevtoolsUser: async (data: { template: string }) => {
          return $fetch<CreateUserResponse, DevtoolsFetchError>(
            ENDPOINTS.CREATE_USER,
            {
            method: "POST",
            body: data,
            }
          );
        },
        loginAsDevtoolsUser: async (data: { userId: string }) => {
          return $fetch<LoginResponse, DevtoolsFetchError>(ENDPOINTS.LOGIN, {
            method: "POST",
            body: data,
          });
        },
        getDevtoolsSession: async () => {
          return $fetch<SessionResponse, DevtoolsFetchError>(ENDPOINTS.SESSION);
        },
        updateDevtoolsSession: async (data: {
          patch: Record<string, unknown>;
        }) => {
          return $fetch<UpdateSessionResponse, DevtoolsFetchError>(
            ENDPOINTS.UPDATE_SESSION,
            {
              method: "POST",
              body: data,
            }
          );
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
