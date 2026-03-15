import type { DevtoolsSessionView, ManagedTestUserRecord } from "./types.js";

export type ListUsersResponse = ManagedTestUserRecord[];

export interface CreateUserRequest {
  template: string;
}

export interface CreateUserResponse {
  user: ManagedTestUserRecord;
}

export interface LoginRequest {
  userId: string;
}

export interface LoginResponse {
  session: DevtoolsSessionView;
}

export interface SessionResponse {
  session: DevtoolsSessionView | null;
}

export interface UpdateSessionRequest {
  patch: Record<string, unknown>;
}

export interface UpdateSessionResponse {
  session: DevtoolsSessionView;
}

export interface DevtoolsErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
