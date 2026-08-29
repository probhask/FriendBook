import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  fetchMe,
  loginAuth,
  logout,
} from "../AsyncFunctions/authAsync";
import toast from "react-hot-toast";
import { RootState } from "../store";
import { User } from "../../types";

type AuthSliceInitialState = {
  data: User;
  isLoggedIn: boolean;
  /** false until the boot-time session check (fetchMe) has resolved */
  authChecked: boolean;
  loading: boolean;
  error: string;
};

const emptyUser: User = {
  _id: "",
  name: "",
  profileImage: "",
  isLoggedIn: false,
};

const initialState: AuthSliceInitialState = {
  data: emptyUser,
  isLoggedIn: false,
  authChecked: false,
  loading: false,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoggedIn = true;
        state.authChecked = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.data = emptyUser;
        state.isLoggedIn = false;
        state.authChecked = true;
      });

    builder
      .addCase(loginAuth.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = "";
        state.isLoggedIn = true;
        state.authChecked = true;
        toast.success("Welcome back");
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "login failed";
        toast.error(state.error);
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = emptyUser;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = "";
        toast.success("Signed out");
      })
      .addCase(logout.rejected, (state, action) => {
        // Clear locally even if the network call failed.
        state.data = emptyUser;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.error.message || "error logging out";
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.isLoggedIn = true;
        state.authChecked = true;
        state.error = "";
        toast.success("Account created");
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "could not create account";
        toast.error(state.error);
      });
  },
});

const allAuth = (state: RootState) => state.auth;
export const getAuthData = createSelector(allAuth, (state) => state.data);
export const getAuthId = (state: RootState) => state.auth.data._id;
export const getAuthLoading = (state: RootState) => state.auth.loading;
export const getAuthError = (state: RootState) => state.auth.error;
export const getAuthLoginStatus = (state: RootState) => state.auth.isLoggedIn;
export const getAuthChecked = (state: RootState) => state.auth.authChecked;

export default authSlice.reducer;
