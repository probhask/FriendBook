import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";
import { getAllUser } from "../AsyncFunctions/allUserAync";
import { RootState } from "../store";

type AllUserInitialState = {
  data: User[];
  loading: boolean;
  error: string;
};

const initialState: AllUserInitialState = {
  data: [],
  loading: false,
  error: "",
};

const allUserSlice = createSlice({
  name: "allUser",
  initialState,
  reducers: {
    removeFromAllUserSlice: (
      state,
      action: PayloadAction<{ userId: string }>
    ) => {
      console.log(action.payload.userId);
      state.data = state.data.filter(
        (user) => user._id !== action.payload.userId
      );
    },
    addToAllUserSlice: (state, action: PayloadAction<{ user: User }>) => {
      state.data.push(action.payload.user);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in getting user";
        console.log(action.error);
      });
  },
});

const allUser = (state: RootState) => state.allUser;
export const getAllUserData = createSelector(allUser, (state) => state.data);
export const getAllUserLoading = (state: RootState) => state.allUser.loading;
export const getAllUserError = (state: RootState) => state.allUser.error;

export const { removeFromAllUserSlice, addToAllUserSlice } =
  allUserSlice.actions;
export default allUserSlice.reducer;
