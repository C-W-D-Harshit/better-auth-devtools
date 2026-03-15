/** Key identifying a test user template */
export type DevtoolsTemplateKey = string;

/** Template definition for creating managed test users */
export interface ManagedTestUserTemplate {
  /** Display label for the template (e.g., "Admin", "Editor") */
  label: string;
  /** Default email pattern. Use {{n}} for auto-incrementing number */
  emailPattern?: string;
  /** Additional metadata passed to createManagedUser */
  meta?: Record<string, unknown>;
}

/** A managed test user record stored by the plugin */
export interface ManagedTestUserRecord {
  id: string;
  userId: string;
  templateKey: string;
  label: string;
  email: string;
  createdAt: string;
}

/** Session view returned to the DevTools UI */
export interface DevtoolsSessionView {
  userId: string;
  email?: string;
  label?: string;
  fields: Record<string, unknown>;
  editableFields?: string[];
}

/** Partial patch for session metadata */
export type DevtoolsSessionPatch = Record<string, unknown>;

/** Configuration for an editable session field */
export interface EditableFieldConfig {
  /** The field key */
  key: string;
  /** Display label */
  label: string;
  /** Field type hint for UI rendering */
  type?: "string" | "number" | "boolean" | "select";
  /** Allowed values for select type */
  options?: string[];
  /** Validation function */
  validate?: (value: unknown) => boolean;
}

/** Arguments passed to the host createManagedUser callback */
export interface CreateManagedUserArgs {
  templateKey: string;
  template: ManagedTestUserTemplate;
  email: string;
}

/** Arguments passed to the host getSessionView callback */
export interface GetSessionViewArgs {
  userId: string;
  sessionId: string;
}

/** Arguments passed to the host patchSession callback */
export interface PatchSessionArgs {
  userId: string;
  sessionId: string;
  patch: DevtoolsSessionPatch;
}

/** Plugin configuration provided by the host app */
export interface DevtoolsPluginConfig {
  /** Available test user templates */
  templates: Record<DevtoolsTemplateKey, ManagedTestUserTemplate>;
  /** Editable session fields */
  editableFields?: EditableFieldConfig[];
  /** Create a managed user in the host app. Returns the userId and display info. */
  createManagedUser: (args: CreateManagedUserArgs) => Promise<{
    userId: string;
    email?: string;
    label?: string;
    extra?: Record<string, unknown>;
  }>;
  /** Get session view for the DevTools UI */
  getSessionView: (args: GetSessionViewArgs) => Promise<DevtoolsSessionView>;
  /** Patch session metadata */
  patchSession: (args: PatchSessionArgs) => Promise<DevtoolsSessionView>;
}
