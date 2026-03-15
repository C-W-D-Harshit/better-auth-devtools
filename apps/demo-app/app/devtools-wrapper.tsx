"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";
import type { BetterAuthDevtoolsProps } from "better-auth-devtools/react";

export interface DevtoolsWrapperProps {
  panelProps: BetterAuthDevtoolsProps;
}

export function DevtoolsWrapper({ panelProps }: DevtoolsWrapperProps) {
  return <BetterAuthDevtools {...panelProps} />;
}
