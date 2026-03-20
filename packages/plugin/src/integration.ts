import { devtoolsClientPlugin } from "./client-plugin.js";
import { isDevtoolsEnabled } from "./guards.js";
import { createDevtoolsPanelProps } from "./panel.js";
import { devtoolsPlugin } from "./server-plugin.js";
import type { DevtoolsPluginConfig, ManagedTestUserTemplate } from "./types.js";
import type { DevtoolsPanelConfig, DevtoolsPanelProps } from "./panel.js";
import type { DevtoolsClientPlugin } from "./client-plugin.js";

export interface DevtoolsIntegration<
  TTemplateKey extends string = string,
  TFields extends Record<string, unknown> = Record<string, unknown>,
  TEditableKey extends keyof TFields & string = keyof TFields & string,
> {
  enabled: boolean;
  clientPlugin: DevtoolsClientPlugin<TTemplateKey, TFields, TEditableKey>;
  serverPlugin: ReturnType<typeof devtoolsPlugin>;
  panelProps: DevtoolsPanelProps<TTemplateKey, TEditableKey>;
}

/**
 * Convenience helper for grouping the server plugin, client plugin, and panel props.
 * In Next.js App Router, keep DB-backed config on the server and pass
 * `panelProps` into a client wrapper from a server layout.
 */
export function createDevtoolsIntegration<
  TTemplates extends Record<string, ManagedTestUserTemplate>,
  TFields extends Record<string, unknown>,
  TEditableKey extends keyof TFields & string,
>(
  config: DevtoolsPluginConfig<TTemplates, TFields, TEditableKey>,
  panel: DevtoolsPanelConfig = {}
): DevtoolsIntegration<keyof TTemplates & string, TFields, TEditableKey> {
  return {
    enabled: panel.enabled ?? isDevtoolsEnabled(),
    clientPlugin: devtoolsClientPlugin<
      keyof TTemplates & string,
      TFields,
      TEditableKey
    >(),
    serverPlugin: devtoolsPlugin(config),
    panelProps: createDevtoolsPanelProps(config, panel),
  };
}
