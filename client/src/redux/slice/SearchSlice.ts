import { createSelector, createSlice } from "@reduxjs/toolkit";
import { searchUser } from "@redux/AsyncFunctions/searchAsync";
import { User } from "types";
import { RootState } from "@redux/store";

type SearchSliceInitialState = {
  seacrhedUsers: User[];
  loading: boolean;
  error: string;
};
const initialState: SearchSliceInitialState = {
  seacrhedUsers: [],
  loading: false,
  error: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(searchUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.seacrhedUsers = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in creating post";
      });
  },
});
const search = (state: RootState) => state.search;
export const selectSearchedUser = createSelector(
  search,
  (state) => state.seacrhedUsers
);
export const selectSearchLoading = (state: RootState) => state.search.loading;
export const selectSearchError = (state: RootState) => state.search.error;

export default searchSlice.reducer;
