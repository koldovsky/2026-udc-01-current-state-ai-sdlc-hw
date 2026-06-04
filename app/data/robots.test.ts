import { describe, expect, it } from "vitest";
import { getRobotById } from "./robots";

describe("getRobotById", () => {
  it("returns the correct robot for a known id", () => {
    const robot = getRobotById("spike-walker");
    expect(robot).toBeDefined();
    expect(robot?.name).toBe("Spike Walker");
  });

  it("returns undefined for an unknown id", () => {
    expect(getRobotById("unknown-id")).toBeUndefined();
  });
});
