import type {
  DevtoolsPanelFieldConfig,
  DevtoolsSessionPatch,
  DevtoolsSessionView,
  ManagedTestUserRecord,
} from "./types.js";

export interface DevtoolsPublicConfig {
  enabled: true;
  templates: Array<{ key: string; label: string }>;
  editableFields: DevtoolsPanelFieldConfig[];
  capabilities: {
    createUsers: true;
    deleteUsers: true;
    editSession: boolean;
    /** Default editing writes Better Auth user fields; a patch hook owns custom data. */
    editTarget?: "user" | "custom";
  };
}

export type ListUsersResponse = ManagedTestUserRecord[];

export interface SearchUsersRequest {
  query?: string;
  cursor?: string;
  limit?: number;
}

export interface SearchUsersResponse {
  users: ManagedTestUserRecord[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CreateUserRequest<TTemplateKey extends string = string> {
  template: TTemplateKey;
}

export interface CreateUserResponse {
  user: ManagedTestUserRecord;
}

export interface DeleteUserRequest {
  userId: string;
}

export interface DeleteUserResponse {
  success: true;
}

export interface LoginRequest {
  userId: string;
}

export interface LoginResponse<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  session: DevtoolsSessionView<TFields, TEditableKey>;
  managedUser?: ManagedTestUserRecord;
}

export interface SessionResponse<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  session: DevtoolsSessionView<TFields, TEditableKey> | null;
  managedUser?: ManagedTestUserRecord | null;
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
  code: string;
  message: string;
  retryAfter?: number;
}
