export interface ManagedTestUserTemplate<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> {
  label: string;
  emailPattern?: string;
  meta?: TMeta;
  /** Fields written to Better Auth's user model by the zero-config creator. */
  user?: Record<string, unknown>;
}

export type DevtoolsTemplateKey<
  TTemplates extends Record<string, ManagedTestUserTemplate> = Record<
    string,
    ManagedTestUserTemplate
  >,
> = keyof TTemplates & string;

export interface ManagedTestUserRecord {
  id: string;
  userId: string;
  templateKey: string;
  label: string;
  email: string;
  createdAt: string;
}

export interface EditableFieldConfig<TKey extends string = string> {
  key: TKey;
  label: string;
  type?: "string" | "number" | "boolean" | "select";
  options?: string[];
  validate?: (value: unknown) => boolean;
}

export type DevtoolsPanelFieldConfig<TKey extends string = string> = Omit<
  EditableFieldConfig<TKey>,
  "validate"
>;

export interface DevtoolsSessionView<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  userId: string;
  email?: string;
  label?: string;
  fields: TFields;
  editableFields?: TEditableKey[];
}

export type DevtoolsSessionPatch<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> = Partial<Pick<TFields, TEditableKey>>;

export interface CreateManagedUserArgs<
  TTemplates extends Record<string, ManagedTestUserTemplate> = Record<
    string,
    ManagedTestUserTemplate
  >,
> {
  templateKey: DevtoolsTemplateKey<TTemplates>;
  template: TTemplates[DevtoolsTemplateKey<TTemplates>];
  email: string;
}

export interface GetSessionViewArgs {
  userId: string;
  sessionId: string;
}

export interface PatchSessionArgs<
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  userId: string;
  sessionId: string;
  patch: DevtoolsSessionPatch<TFields, TEditableKey>;
}

export interface DevtoolsPluginConfig<
  TTemplates extends Record<string, ManagedTestUserTemplate> = Record<
    string,
    ManagedTestUserTemplate
  >,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  /** Defaults to a single generic `user` template. */
  templates?: TTemplates;
  editableFields?: EditableFieldConfig<TEditableKey>[];
  /**
   * Optional hard override. By default the plugin creates a verified Better
   * Auth user through the internal adapter.
   */
  createManagedUser?: (args: CreateManagedUserArgs<TTemplates>) => Promise<{
    userId: string;
    email?: string;
    label?: string;
    extra?: Record<string, unknown>;
  }>;
  /** Optional override for applications that need a custom session view. */
  getSessionView?: (args: GetSessionViewArgs) => Promise<
    DevtoolsSessionView<TFields, TEditableKey>
  >;
  /**
   * Optional override for editing. Without it, allowed fields are written to
   * the Better Auth user model.
   */
  patchSession?: (
    args: PatchSessionArgs<TFields, TEditableKey>
  ) => Promise<DevtoolsSessionView<TFields, TEditableKey>>;
  /** Explicit kill switch. Production is always disabled. */
  enabled?: boolean | (() => boolean);
}

export type DevtoolsOptions<
  TTemplates extends Record<string, ManagedTestUserTemplate> = Record<
    string,
    ManagedTestUserTemplate
  >,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> = DevtoolsPluginConfig<TTemplates, TFields, TEditableKey>;

export type InferDevtoolsTemplateKey<
  TConfig extends DevtoolsPluginConfig<any, any, any>,
> = keyof NonNullable<TConfig["templates"]> & string;

export type InferDevtoolsSessionFields<
  TConfig extends DevtoolsPluginConfig<any, any, any>,
> = TConfig extends DevtoolsPluginConfig<any, infer TFields, any>
  ? TFields
  : never;

export type InferDevtoolsEditableKey<
  TConfig extends DevtoolsPluginConfig<any, any, any>,
> = TConfig extends DevtoolsPluginConfig<any, any, infer TEditableKey>
  ? TEditableKey
  : never;
