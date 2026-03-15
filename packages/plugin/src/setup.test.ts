import { describe, expect, it, vi } from "vitest";
import {
  createDevtoolsIntegration,
  createDevtoolsPanelProps,
  defineDevtoolsConfig,
} from "./setup.js";

describe("setup helpers", () => {
  it("derives client-safe panel props from config", () => {
    const config = defineDevtoolsConfig({
      templates: {
        admin: { label: "Admin" },
        viewer: { label: "Viewer" },
      },
      editableFields: [
        {
          key: "role",
          label: "Role",
          type: "select" as const,
          options: ["admin", "viewer"],
          validate: vi.fn(),
        },
      ],
      createManagedUser: vi.fn(),
      getSessionView: vi.fn(),
      patchSession: vi.fn(),
    });

    expect(
      createDevtoolsPanelProps(config, {
        basePath: "/custom/auth",
        triggerLabel: "DevTools",
      })
    ).toEqual({
      enabled: false,
      basePath: "/custom/auth",
      defaultOpen: undefined,
      position: undefined,
      triggerLabel: "DevTools",
      templates: ["admin", "viewer"],
      editableFields: [
        {
          key: "role",
          label: "Role",
          type: "select",
          options: ["admin", "viewer"],
        },
      ],
    });
  });

  it("creates an integration bundle from one config", () => {
    const config = defineDevtoolsConfig({
      templates: {
        admin: { label: "Admin" },
      },
      createManagedUser: vi.fn(),
      getSessionView: vi.fn(),
      patchSession: vi.fn(),
    });

    const integration = createDevtoolsIntegration(config, {
      enabled: true,
    });

    expect(integration.enabled).toBe(true);
    expect(integration.clientPlugin.id).toBe("better-auth-devtools");
    expect(integration.serverPlugin.id).toBe("better-auth-devtools");
    expect(integration.panelProps).toMatchObject({
      enabled: true,
      templates: ["admin"],
      editableFields: [],
      basePath: "/api/auth",
    });
  });
});
