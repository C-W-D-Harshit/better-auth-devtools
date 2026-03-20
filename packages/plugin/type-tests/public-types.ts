import {
  createDevtoolsIntegration,
  createDevtoolsPanelProps,
  defineDevtoolsConfig,
  devtoolsClientPlugin,
  devtoolsClientPluginFor,
} from "../src/plugin.js";
import type {
  DevtoolsPluginConfig,
  DevtoolsSessionView,
  EditableFieldConfig,
} from "../src/plugin.js";

type SessionFields = {
  role: "admin" | "viewer";
  emailVerified: boolean;
};

type Templates = {
  admin: { label: string; meta: { role: "admin" } };
  viewer: { label: string; meta: { role: "viewer" } };
};

function expectType<T>(_value: T) {}

const templates = {
  admin: { label: "Admin", meta: { role: "admin" as const } },
  viewer: { label: "Viewer", meta: { role: "viewer" as const } },
} satisfies Templates;

const config = defineDevtoolsConfig({
  templates,
  editableFields: [
    {
      key: "role",
      label: "Role",
      type: "select" as const,
      options: ["admin", "viewer"],
    },
  ],
  async createManagedUser(args) {
    expectType<"admin" | "viewer">(args.templateKey);

    return {
      userId: `${args.templateKey}-user`,
      email: args.email,
      label: args.template.label,
    };
  },
  async getSessionView(args): Promise<DevtoolsSessionView<SessionFields, "role">> {
    return {
      userId: args.userId,
      fields: {
        role: "viewer",
        emailVerified: true,
      },
      editableFields: ["role"],
    };
  },
  async patchSession(args): Promise<DevtoolsSessionView<SessionFields, "role">> {
    expectType<Partial<Pick<SessionFields, "role">>>(args.patch);

    return {
      userId: args.userId,
      fields: {
        role: args.patch.role ?? "viewer",
        emailVerified: true,
      },
      editableFields: ["role"],
    };
  },
});

const panelProps = createDevtoolsPanelProps(config);
expectType<Array<"admin" | "viewer">>(panelProps.templates);
expectType<Array<"role">>(panelProps.editableFields.map((field) => field.key));

const integration = createDevtoolsIntegration(config);
expectType<Array<"admin" | "viewer">>(integration.panelProps.templates);

type DevtoolsConfig = typeof config;

const inferredClientPlugin = devtoolsClientPluginFor<DevtoolsConfig>();
const inferredActions = inferredClientPlugin.getActions?.(
  async <TData>(_path: string, _options?: Record<string, unknown>) =>
    ({} as TData)
);

inferredActions?.createDevtoolsUser({ template: "admin" });
// @ts-expect-error invalid template key must fail
inferredActions?.createDevtoolsUser({ template: "editor" });

inferredActions?.updateDevtoolsSession({ patch: { role: "viewer" } });
// @ts-expect-error invalid patch key must fail
inferredActions?.updateDevtoolsSession({ patch: { emailVerified: false } });

const clientPlugin = devtoolsClientPlugin<"admin" | "viewer", SessionFields, "role">();
const actions = clientPlugin.getActions?.(
  async <TData>(_path: string, _options?: Record<string, unknown>) =>
    ({} as TData)
);

actions?.createDevtoolsUser({ template: "admin" });
// @ts-expect-error invalid template key must fail
actions?.createDevtoolsUser({ template: "editor" });

actions?.updateDevtoolsSession({ patch: { role: "viewer" } });
// @ts-expect-error invalid patch key must fail
actions?.updateDevtoolsSession({ patch: { emailVerified: false } });

const validConfig: DevtoolsPluginConfig<typeof templates, SessionFields, "role"> =
  config;
void validConfig;

const invalidField: EditableFieldConfig<keyof SessionFields & string> = {
  // @ts-expect-error editable field keys must exist on the typed session field map
  key: "missing",
  label: "Missing",
};

void invalidField;
