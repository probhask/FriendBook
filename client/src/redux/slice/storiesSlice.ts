import { createSelector, createSlice } from "@reduxjs/toolkit";
import { StoriesType } from "../../types";
import { createStory, getStories } from "../AsyncFunctions/storiesAsync";
import { RootState } from "../store";

type PostSliceInitialState = {
  data: StoriesType[];
  loading: boolean;
  error: string;
  pageNumber: number;
  hasMore: boolean;
  limit: number;
  creatingStories: boolean; // New field
};

const initialState: PostSliceInitialState = {
  data: [],
  loading: false,
  error: "",
  pageNumber: 1,
  hasMore: true,
  limit: 3,
  creatingStories: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getStories.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.hasMore =
          action.payload.length > 0 || action.payload.length >= state.limit;
        state.data.push(...action.payload);
        state.pageNumber += 1;
        state.loading = false;
        state.error = "";
      })
      .addCase(getStories.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        state.error = action.error.message || "error in getting stories";
        console.log(state.error);
      });

    builder
      .addCase(createStory.pending, (state) => {
        state.creatingStories = true;
        state.error = "";
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.data = [action.payload, ...state.data];
        state.creatingStories = false;
        state.error = "";
      })
      .addCase(createStory.rejected, (state, action) => {
        state.creatingStories = false;
        state.error = action.error.message || "error in creating story";
        console.log(state.error);
      });
  },
});

const stories = (state: RootState) => state.stories;
export const getStoriesData = createSelector(stories, (state) => state.data);
export const getStoriesPage = (state: RootState) => state.stories.pageNumber;
export const getStoriesHasMore = (state: RootState) => state.stories.hasMore;
export const getStoriesLoading = (state: RootState) => state.stories.loading;
export const getStoriesError = (state: RootState) => state.stories.error;

export const getStoriesCreating = (state: RootState) =>
  state.stories.creatingStories; // New selector

export default postSlice.reducer;
