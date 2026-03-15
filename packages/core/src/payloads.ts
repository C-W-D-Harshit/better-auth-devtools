import type { ManagedTestUserRecord, DevtoolsSessionView } from "./types.js";

/** GET /better-auth-devtools/users response */
export type ListUsersResponse = ManagedTestUserRecord[];

/** POST /better-auth-devtools/users request */
export interface CreateUserRequest {
  template: string;
}

/** POST /better-auth-devtools/users response */
export interface CreateUserResponse {
  user: ManagedTestUserRecord;
}

/** POST /better-auth-devtools/login request */
export interface LoginRequest {
  userId: string;
}

/** POST /better-auth-devtools/login response */
export interface LoginResponse {
  session: DevtoolsSessionView;
}

/** GET /better-auth-devtools/session response */
export interface SessionResponse {
  session: DevtoolsSessionView | null;
}

/** POST /better-auth-devtools/update-session request */
export interface UpdateSessionRequest {
  patch: Record<string, unknown>;
}

/** POST /better-auth-devtools/update-session response */
export interface UpdateSessionResponse {
  session: DevtoolsSessionView;
}

/** Standard error response */
export interface DevtoolsErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
