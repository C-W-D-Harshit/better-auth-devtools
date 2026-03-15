import { describe, expect, it } from "vitest";
import { BetterAuthDevtools } from "./devtools-panel.js";

describe("BetterAuthDevtools", () => {
  it("exports a component function", () => {
    expect(typeof BetterAuthDevtools).toBe("function");
  });
});
