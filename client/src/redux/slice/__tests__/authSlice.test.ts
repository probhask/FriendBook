import { describe, it, expect } from "vitest";
import reducer, { getAuthChecked } from "../authSlice";
import { fetchMe, loginAuth, logout } from "../../AsyncFunctions/authAsync";
import type { User } from "../../../types";

const user: User = {
  _id: "u1",
  name: "Ada",
  profileImage: "",
  isLoggedIn: true,
};

const initial = reducer(undefined, { type: "@@INIT" });

describe("authSlice", () => {
  it("starts logged out and unchecked", () => {
    expect(initial.isLoggedIn).toBe(false);
    expect(initial.authChecked).toBe(false);
    expect(initial.data._id).toBe("");
  });

  it("fetchMe.fulfilled marks the session checked and logged in", () => {
    const s = reducer(initial, { type: fetchMe.fulfilled.type, payload: user });
    expect(s.isLoggedIn).toBe(true);
    expect(s.authChecked).toBe(true);
    expect(s.data._id).toBe("u1");
  });

  it("fetchMe.rejected marks checked but logged out", () => {
    const s = reducer(initial, { type: fetchMe.rejected.type });
    expect(s.isLoggedIn).toBe(false);
    expect(s.authChecked).toBe(true);
  });

  it("logout clears the user", () => {
    const loggedIn = reducer(initial, {
      type: loginAuth.fulfilled.type,
      payload: user,
    });
    const s = reducer(loggedIn, { type: logout.fulfilled.type });
    expect(s.isLoggedIn).toBe(false);
    expect(s.data._id).toBe("");
  });

  it("exposes an authChecked selector", () => {
    expect(getAuthChecked({ auth: initial } as never)).toBe(false);
  });
});
