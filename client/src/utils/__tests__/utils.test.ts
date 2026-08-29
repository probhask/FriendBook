import { describe, it, expect, beforeEach } from "vitest";
import { timeAgo } from "../timeAgo";
import get48HoursAgoISOString from "../get48HorsString";
import isInstanceOfError from "../isInstanceOfError";
import { checkLocalStorage } from "../localStorage";

describe("timeAgo", () => {
  it("reports seconds for a very recent date", () => {
    const d = new Date(Date.now() - 5_000).toISOString();
    expect(timeAgo(d)).toMatch(/second/);
  });

  it("reports days for an older date", () => {
    const d = new Date(Date.now() - 3 * 86_400_000).toISOString();
    expect(timeAgo(d)).toBe("3 days ago");
  });
});

describe("get48HoursAgoISOString", () => {
  it("is ~48h in the past", () => {
    const then = new Date(get48HoursAgoISOString()).getTime();
    const delta = Date.now() - then;
    expect(delta).toBeGreaterThan(47 * 3600_000);
    expect(delta).toBeLessThan(49 * 3600_000);
  });
});

describe("isInstanceOfError", () => {
  it("returns the message for an Error", () => {
    expect(isInstanceOfError(new Error("boom"))).toBe("boom");
  });
  it("falls back to the default for non-errors", () => {
    expect(isInstanceOfError("nope", "fallback")).toBe("fallback");
  });
});

describe("checkLocalStorage", () => {
  beforeEach(() => localStorage.clear());

  it("returns undefined when nothing is stored", () => {
    expect(checkLocalStorage()).toBeUndefined();
  });
  it("reads a stored key", () => {
    localStorage.setItem("friendBook", JSON.stringify({ isLoggedIn: true }));
    expect(checkLocalStorage("isLoggedIn")).toBe(true);
  });
});
