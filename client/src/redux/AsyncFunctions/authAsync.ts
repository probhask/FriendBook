import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types";
import { callApi } from "@utils/api";
import isInstanceOfError from "@utils/isInstanceOfError";

/** Restore the session on app boot from the HttpOnly cookie. */
export const fetchMe = createAsyncThunk<User>(
  "auth/fetchMe",
  async (_, thunkAPI) => {
    try {
      return await callApi<User>("me");
    } catch (error) {
      return thunkAPI.rejectWithValue(isInstanceOfError(error, "not signed in"));
    }
  }
);

export const loginAuth = createAsyncThunk<
  User,
  { email: string; password: string }
>("auth/loginAuth", async ({ email, password }, thunkAPI) => {
  try {
    return await callApi<User>("login", { email, password });
  } catch (error) {
    return thunkAPI.rejectWithValue(
      isInstanceOfError(error, "invalid email or password")
    );
  }
});

export const logout = createAsyncThunk<boolean>("auth/logout", async () => {
  try {
    await callApi("logout");
    return false;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error logging out"));
  }
});

export const createUser = createAsyncThunk<
  User,
  { email: string; password: string; name: string }
>("auth/createUser", async ({ name, email, password }, thunkAPI) => {
  try {
    return await callApi<User>("register", { name, email, password });
  } catch (error) {
    return thunkAPI.rejectWithValue(
      isInstanceOfError(error, "could not create account")
    );
  }
});
