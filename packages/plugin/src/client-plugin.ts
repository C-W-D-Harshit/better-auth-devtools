import type { BetterAuthClientPlugin } from "better-auth/client";
import { ENDPOINTS } from "./endpoints.js";
import type {
  CreateUserRequest,
  CreateUserResponse,
  DevtoolsErrorResponse,
  ListUsersResponse,
  LoginRequest,
  LoginResponse,
  SessionResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
} from "./payloads.js";
import type { devtoolsPlugin } from "./server-plugin.js";
import type {
  DevtoolsPluginConfig,
  InferDevtoolsEditableKey,
  InferDevtoolsSessionFields,
  InferDevtoolsTemplateKey,
} from "./types.js";

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

export interface DevtoolsClientActions<
  TTemplateKey extends string = string,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  listDevtoolsUsers: () => DevtoolsFetchResult<ListUsersResponse>;
  createDevtoolsUser: (
    data: CreateUserRequest<TTemplateKey>
  ) => DevtoolsFetchResult<CreateUserResponse>;
  loginAsDevtoolsUser: (
    data: LoginRequest
  ) => DevtoolsFetchResult<LoginResponse<TFields, TEditableKey>>;
  getDevtoolsSession: () => DevtoolsFetchResult<
    SessionResponse<TFields, TEditableKey>
  >;
  updateDevtoolsSession: (
    data: UpdateSessionRequest<TFields, TEditableKey>
  ) => DevtoolsFetchResult<UpdateSessionResponse<TFields, TEditableKey>>;
}

export interface DevtoolsClientPlugin<
  TTemplateKey extends string = string,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> extends BetterAuthClientPlugin {
  getActions?: (
    $fetch: <TData, TError = DevtoolsFetchError>(
      path: string,
      options?: Record<string, unknown>
    ) => Promise<TData>
  ) => DevtoolsClientActions<TTemplateKey, TFields, TEditableKey>;
  $InferServerPlugin: ReturnType<typeof devtoolsPlugin>;
}

/**
 * Recommended client-side Better Auth integration for the devtools.
 * Use this in your auth client, and in Next.js App Router pass `panelProps`
 * from a server layout into a separate client wrapper instead of importing a
 * DB-backed devtools config module into a client component.
 */
export const devtoolsClientPlugin = <
  TTemplateKey extends string = string,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
>(): DevtoolsClientPlugin<TTemplateKey, TFields, TEditableKey> => {
  const plugin = {
    id: "better-auth-devtools",
    $InferServerPlugin: {} as ReturnType<typeof devtoolsPlugin>,
    getActions: ($fetch) => {
      return {
        listDevtoolsUsers: async () => {
          return $fetch<ListUsersResponse, DevtoolsFetchError>(
            ENDPOINTS.LIST_USERS
          );
        },
        createDevtoolsUser: async (data: CreateUserRequest<TTemplateKey>) => {
          return $fetch<CreateUserResponse, DevtoolsFetchError>(
            ENDPOINTS.CREATE_USER,
            {
              method: "POST",
              body: data,
            }
          );
        },
        loginAsDevtoolsUser: async (data: LoginRequest) => {
          return $fetch<LoginResponse<TFields, TEditableKey>, DevtoolsFetchError>(
            ENDPOINTS.LOGIN,
            {
              method: "POST",
              body: data,
            }
          );
        },
        getDevtoolsSession: async () => {
          return $fetch<
            SessionResponse<TFields, TEditableKey>,
            DevtoolsFetchError
          >(ENDPOINTS.SESSION);
        },
        updateDevtoolsSession: async (
          data: UpdateSessionRequest<TFields, TEditableKey>
        ) => {
          return $fetch<
            UpdateSessionResponse<TFields, TEditableKey>,
            DevtoolsFetchError
          >(ENDPOINTS.UPDATE_SESSION, {
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

  return plugin as DevtoolsClientPlugin<TTemplateKey, TFields, TEditableKey>;
};

/**
 * Use this when you want typed client actions derived from your devtools config type.
 * In Next.js App Router, pass a type-only import or shared type alias here instead of
 * importing a DB-backed runtime config module into client code.
 */
export const devtoolsClientPluginFor = <
  TConfig extends DevtoolsPluginConfig<any, any, any>,
>() =>
  devtoolsClientPlugin<
    InferDevtoolsTemplateKey<TConfig>,
    InferDevtoolsSessionFields<TConfig>,
    InferDevtoolsEditableKey<TConfig>
  >();

export type { DevtoolsFetchError, DevtoolsFetchResult };
