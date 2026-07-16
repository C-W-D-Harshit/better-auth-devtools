export const ErrorCode = {
  FEATURE_DISABLED: "FEATURE_DISABLED",
  INVALID_TEMPLATE: "INVALID_TEMPLATE",
  UNMANAGED_USER: "UNMANAGED_USER",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  NO_ACTIVE_SESSION: "NO_ACTIVE_SESSION",
  INVALID_PATCH: "INVALID_PATCH",
  CREATION_FAILED: "CREATION_FAILED",
  SESSION_CREATION_FAILED: "SESSION_CREATION_FAILED",
  INVALID_CONFIG: "INVALID_CONFIG",
  UNTRUSTED_ORIGIN: "UNTRUSTED_ORIGIN",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class DevtoolsError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = "DevtoolsError";
    this.code = code;
  }
}
