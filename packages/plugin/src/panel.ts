import { isDevtoolsEnabled } from "./guards.js";
import type {
  DevtoolsPanelFieldConfig,
  DevtoolsPluginConfig,
  ManagedTestUserTemplate,
} from "./types.js";

export interface DevtoolsPanelConfig {
  enabled?: boolean;
  basePath?: string;
  defaultOpen?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  triggerLabel?: string;
}

export interface DevtoolsPanelProps<
  TTemplateKey extends string = string,
  TEditableKey extends string = string,
> extends DevtoolsPanelConfig {
  templates: TTemplateKey[];
  editableFields: DevtoolsPanelFieldConfig<TEditableKey>[];
}

export function defineDevtoolsConfig<
  const TTemplates extends Record<string, ManagedTestUserTemplate>,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
>(config: DevtoolsPluginConfig<TTemplates, TFields, TEditableKey>) {
  return config;
}

/**
 * Build client-consumable panel props from your shared devtools config.
 * In Next.js App Router, keep database-backed config on the server and pass
 * the returned `panelProps` into a client wrapper from a server layout.
 */
export function createDevtoolsPanelProps<
  TTemplates extends Record<string, ManagedTestUserTemplate>,
  TFields extends Record<string, unknown>,
  TEditableKey extends keyof TFields & string,
>(
  config: Pick<
    DevtoolsPluginConfig<TTemplates, TFields, TEditableKey>,
    "templates" | "editableFields"
  >,
  overrides: DevtoolsPanelConfig = {}
): DevtoolsPanelProps<keyof TTemplates & string, TEditableKey> {
  const editableFields = (config.editableFields ?? []).map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    options: field.options,
  })) satisfies DevtoolsPanelFieldConfig<TEditableKey>[];

  return {
    enabled: overrides.enabled ?? isDevtoolsEnabled(),
    basePath: overrides.basePath ?? "/api/auth",
    defaultOpen: overrides.defaultOpen,
    position: overrides.position,
    triggerLabel: overrides.triggerLabel,
    templates: Object.keys(config.templates) as Array<keyof TTemplates & string>,
    editableFields,
  };
}
