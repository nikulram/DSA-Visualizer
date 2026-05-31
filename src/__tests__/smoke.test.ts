import { describe, expect, it } from "vitest";
import App from "../App";

describe("app smoke test", () => {
  it("exports the main app component", () => {
    expect(App).toBeTypeOf("function");
  });
});
