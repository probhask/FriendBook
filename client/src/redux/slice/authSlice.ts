import { createSelector, createSlice } from "@reduxjs/toolkit";
import { createUser, loginAuth, logout } from "../AsyncFunctions/authAsync";
import toast from "react-hot-toast";
import { RootState } from "../store";
import { User } from "../../types";
import { checkLocalStorage } from "../../utils/localStorage";

type AuthSliceInitialState = {
  data: User;
  isLoggedIn: boolean;
  loading: boolean;
  error: string;
};
const initialState: AuthSliceInitialState = {
  data: checkLocalStorage("data"),
  isLoggedIn: checkLocalStorage("isLoggedIn") || false,
  loading: false,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
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
        toast.success("done");
        localStorage.setItem(
          "friendBook",
          JSON.stringify({
            data: state.data,
            isLoggedIn: state.isLoggedIn,
          })
        );
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
        if (action.meta.rejectedWithValue) {
          console.log("action reject value");
          state.error = (action.payload as string) || "login error";
        } else {
          state.error = action.error.message as string;
        }
        toast.error(state.error);
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.loading = false;
        state.error = "";
        toast.success("logout");
        localStorage.setItem(
          "friendBook",
          JSON.stringify({
            data: { ...state.data, isLoggedIn: false },
            isLoggedIn: state.isLoggedIn,
          })
        );
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        if (action.meta.rejectedWithValue) {
          console.log("action reject value");
          state.error = (action.payload as string) || "login error";
        } else {
          state.error = action.error.message as string;
        }
        toast.error(state.error);
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
        state.error = "";
        toast.success("done");
        localStorage.setItem(
          "friendBook",
          JSON.stringify({ data: state.data, isLoggedIn: state.isLoggedIn })
        );
        console.log(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message as string;
      });
  },
});
const allAuth = (state: RootState) => state.auth;
export const getAuthData = createSelector(allAuth, (state) => state.data);
export const getAuthLoading = (state: RootState) => state.auth.loading;
export const getAuthError = (state: RootState) => state.auth.error;
export const getAuthLoginStatus = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;
