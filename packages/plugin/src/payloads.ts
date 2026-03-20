import type {
  DevtoolsSessionPatch,
  DevtoolsSessionView,
  ManagedTestUserRecord,
} from "./types.js";

export type ListUsersResponse = ManagedTestUserRecord[];

export interface CreateUserRequest<TTemplateKey extends string = string> {
  template: TTemplateKey;
}

export interface CreateUserResponse {
  user: ManagedTestUserRecord;
}

export interface LoginRequest {
  userId: string;
}

export interface LoginResponse<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  session: DevtoolsSessionView<TFields, TEditableKey>;
}

export interface SessionResponse<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  session: DevtoolsSessionView<TFields, TEditableKey> | null;
}

export interface UpdateSessionRequest<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  patch: DevtoolsSessionPatch<TFields, TEditableKey>;
}

export interface UpdateSessionResponse<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  session: DevtoolsSessionView<TFields, TEditableKey>;
}

export interface DevtoolsErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
