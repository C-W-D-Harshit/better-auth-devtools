export { devtoolsPlugin } from "./server-plugin.js";
export { devtoolsClientPlugin } from "./client-plugin.js";

export type {
  DevtoolsPluginConfig,
  DevtoolsTemplateKey,
  ManagedTestUserTemplate,
  ManagedTestUserRecord,
  DevtoolsSessionView,
  DevtoolsSessionPatch,
  EditableFieldConfig,
  CreateManagedUserArgs,
  GetSessionViewArgs,
  PatchSessionArgs,
  ListUsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
  SessionResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
} from "@better-auth-devtools/core";
