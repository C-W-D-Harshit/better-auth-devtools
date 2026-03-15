import { devtoolsClientPlugin } from "./client-plugin.js";
import { isDevtoolsEnabled } from "./guards.js";
import { createDevtoolsPanelProps } from "./panel.js";
import { devtoolsPlugin } from "./server-plugin.js";
import type { DevtoolsPluginConfig } from "./types.js";
import type { DevtoolsPanelConfig, DevtoolsPanelProps } from "./panel.js";

export interface DevtoolsIntegration {
  enabled: boolean;
  clientPlugin: ReturnType<typeof devtoolsClientPlugin>;
  serverPlugin: ReturnType<typeof devtoolsPlugin>;
  panelProps: DevtoolsPanelProps;
}

export function createDevtoolsIntegration(
  config: DevtoolsPluginConfig,
  panel: DevtoolsPanelConfig = {}
): DevtoolsIntegration {
  return {
    enabled: panel.enabled ?? isDevtoolsEnabled(),
    clientPlugin: devtoolsClientPlugin(),
    serverPlugin: devtoolsPlugin(config),
    panelProps: createDevtoolsPanelProps(config, panel),
  };
}
