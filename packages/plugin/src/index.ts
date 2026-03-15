export { devtoolsPlugin } from "./server-plugin.js";
export { devtoolsClientPlugin } from "./client-plugin.js";
export { ENDPOINTS, ROUTE_PREFIX } from "./endpoints.js";
export { filterAllowedPatchKeys, isValidTemplateKey } from "./validation.js";
export { DevtoolsError, ErrorCode } from "./errors.js";
export { isDevtoolsEnabled } from "./guards.js";
export {
  createDevtoolsIntegration,
  createDevtoolsPanelProps,
  defineDevtoolsConfig,
} from "./setup.js";

export type {
  DevtoolsPluginConfig,
  DevtoolsTemplateKey,
  ManagedTestUserTemplate,
  ManagedTestUserRecord,
  DevtoolsSessionView,
  DevtoolsSessionPatch,
  EditableFieldConfig,
  DevtoolsPanelFieldConfig,
  CreateManagedUserArgs,
  GetSessionViewArgs,
  PatchSessionArgs,
} from "./types.js";

export type {
  DevtoolsIntegration,
  DevtoolsPanelConfig,
  DevtoolsPanelProps,
} from "./setup.js";

export type {
  ListUsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
  SessionResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
  DevtoolsErrorResponse,
} from "./payloads.js";
