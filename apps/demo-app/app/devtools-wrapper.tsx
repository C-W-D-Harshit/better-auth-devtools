"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export interface DevtoolsWrapperProps {
  enabled: boolean;
}

export function DevtoolsWrapper({ enabled }: DevtoolsWrapperProps) {
  return (
    <BetterAuthDevtools
      enabled={enabled}
      basePath="/api/auth"
      templates={["admin", "editor", "viewer"]}
      editableFields={[
        {
          key: "role",
          label: "Role",
          type: "select",
          options: ["admin", "editor", "viewer"],
        },
      ]}
      position="bottom-right"
      triggerLabel="Auth DevTools"
    />
  );
}
