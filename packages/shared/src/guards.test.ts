import { afterEach, describe, expect, it, vi } from "vitest";
import { isDevtoolsEnabled } from "./guards.js";

const originalNodeEnv = process.env.NODE_ENV;
const originalDevAuth = process.env.DEV_AUTH_ENABLED;

describe("isDevtoolsEnabled", () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.DEV_AUTH_ENABLED = originalDevAuth;
    vi.unstubAllEnvs();
  });

  it("returns true only when enabled outside production", () => {
    process.env.NODE_ENV = "development";
    process.env.DEV_AUTH_ENABLED = "true";
    expect(isDevtoolsEnabled()).toBe(true);
  });

  it("returns false in production", () => {
    process.env.NODE_ENV = "production";
    process.env.DEV_AUTH_ENABLED = "true";
    expect(isDevtoolsEnabled()).toBe(false);
  });
});
