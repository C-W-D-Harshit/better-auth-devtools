export type DevtoolsTemplateKey = string;

export interface ManagedTestUserTemplate {
  label: string;
  emailPattern?: string;
  meta?: Record<string, unknown>;
}

export interface ManagedTestUserRecord {
  id: string;
  userId: string;
  templateKey: string;
  label: string;
  email: string;
  createdAt: string;
}

export interface DevtoolsSessionView {
  userId: string;
  email?: string;
  label?: string;
  fields: Record<string, unknown>;
  editableFields?: string[];
}

export type DevtoolsSessionPatch = Record<string, unknown>;

export interface EditableFieldConfig {
  key: string;
  label: string;
  type?: "string" | "number" | "boolean" | "select";
  options?: string[];
  validate?: (value: unknown) => boolean;
}

export interface CreateManagedUserArgs {
  templateKey: string;
  template: ManagedTestUserTemplate;
  email: string;
}

export interface GetSessionViewArgs {
  userId: string;
  sessionId: string;
}

export interface PatchSessionArgs {
  userId: string;
  sessionId: string;
  patch: DevtoolsSessionPatch;
}

export interface DevtoolsPluginConfig {
  templates: Record<DevtoolsTemplateKey, ManagedTestUserTemplate>;
  editableFields?: EditableFieldConfig[];
  createManagedUser: (args: CreateManagedUserArgs) => Promise<{
    userId: string;
    email?: string;
    label?: string;
    extra?: Record<string, unknown>;
  }>;
  getSessionView: (args: GetSessionViewArgs) => Promise<DevtoolsSessionView>;
  patchSession: (args: PatchSessionArgs) => Promise<DevtoolsSessionView>;
}
