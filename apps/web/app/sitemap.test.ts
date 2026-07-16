import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("contains only routes that exist", () => {
    expect(sitemap().map((entry) => new URL(entry.url).pathname)).toEqual(["/"]);
  });
});
