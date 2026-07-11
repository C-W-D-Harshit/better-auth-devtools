import { afterEach, describe, expect, it, vi } from "vitest";
import { isDevtoolsEnabled } from "./guards.js";

afterEach(() => vi.unstubAllEnvs());

describe("isDevtoolsEnabled", () => {
  it("is plug-and-play in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AUTH_ENABLED", "");
    expect(isDevtoolsEnabled()).toBe(true);
  });

  it("supports an explicit development kill switch", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AUTH_ENABLED", "false");
    expect(isDevtoolsEnabled()).toBe(false);
  });

  it("cannot be enabled in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEV_AUTH_ENABLED", "true");
    expect(isDevtoolsEnabled(true)).toBe(false);
  });
});
