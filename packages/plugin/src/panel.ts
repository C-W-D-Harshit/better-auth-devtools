import { isDevtoolsEnabled } from "./guards.js";
import type {
  DevtoolsPanelFieldConfig,
  DevtoolsPluginConfig,
} from "./types.js";

export interface DevtoolsPanelConfig {
  enabled?: boolean;
  basePath?: string;
  defaultOpen?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  triggerLabel?: string;
}

export interface DevtoolsPanelProps extends DevtoolsPanelConfig {
  templates: string[];
  editableFields: DevtoolsPanelFieldConfig[];
}

export function defineDevtoolsConfig<TConfig extends DevtoolsPluginConfig>(
  config: TConfig
): TConfig {
  return config;
}

export function createDevtoolsPanelProps(
  config: Pick<DevtoolsPluginConfig, "templates" | "editableFields">,
  overrides: DevtoolsPanelConfig = {}
): DevtoolsPanelProps {
  const editableFields = (config.editableFields ?? []).map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    options: field.options,
  })) satisfies DevtoolsPanelFieldConfig[];

  return {
    enabled: overrides.enabled ?? isDevtoolsEnabled(),
    basePath: overrides.basePath ?? "/api/auth",
    defaultOpen: overrides.defaultOpen,
    position: overrides.position,
    triggerLabel: overrides.triggerLabel,
    templates: Object.keys(config.templates),
    editableFields,
  };
}
