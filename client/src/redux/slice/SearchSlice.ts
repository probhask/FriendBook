import { createSelector, createSlice } from "@reduxjs/toolkit";
import { searchUser, SearchUser } from "@redux/AsyncFunctions/searchAsync";
import { RootState } from "@redux/store";

type SearchSliceInitialState = {
  seacrhedUsers: SearchUser[];
  loading: boolean;
  error: string;
  /** the term the current results belong to */
  term: string;
};

const initialState: SearchSliceInitialState = {
  seacrhedUsers: [],
  loading: false,
  error: "",
  term: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.seacrhedUsers = [];
      state.error = "";
      state.term = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchUser.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        state.term = action.meta.arg.searchTerm;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.seacrhedUsers = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(searchUser.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.error.message || "Search failed";
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
export const selectSearchTerm = (state: RootState) => state.search.term;

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
