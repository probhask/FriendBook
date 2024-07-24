import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  addComment,
  deleteComment,
  getComment,
} from "../AsyncFunctions/commentAsync";
import { Comment } from "../../types";
import { RootState } from "../store";

type CommentSliceInitialState = {
  data: Comment[];
  loading: boolean;
  error: string;

  pageNumber: number;
  hasMore: boolean;
  limit: number;

  creatingCommentLoading: boolean;
  creatingCommentError: string;
  deletingCommentLoading: boolean;
  deletingCommentError: string;
};

const initialState: CommentSliceInitialState = {
  data: [],
  loading: false,
  error: "",

  pageNumber: 1,
  hasMore: true,
  limit: 7,

  creatingCommentLoading: false,
  creatingCommentError: "",
  deletingCommentLoading: false,
  deletingCommentError: "",
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getComment.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.data.push(...action.payload);
        state.hasMore = action.payload.length > 0;
        state.pageNumber += 1;
        state.loading = false;
        state.error = "";
      })
      .addCase(getComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in getting comments";
        console.log(action.error);
      });

    builder
      .addCase(addComment.pending, (state) => {
        state.creatingCommentLoading = true;
        state.creatingCommentError = "";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        console.log("acrtion.payload", action.payload);

        state.data.push(action.payload);
        console.log("satte.data", state.data);

        state.creatingCommentLoading = false;
        state.creatingCommentError = "";
      })
      .addCase(addComment.rejected, (state, action) => {
        state.creatingCommentLoading = false;
        state.creatingCommentError =
          action.error.message || "adding comment failed";
        console.log(action.error);
      });

    builder
      .addCase(deleteComment.pending, (state) => {
        state.deletingCommentLoading = true;
        state.deletingCommentError = "";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (comment) => comment._id !== action.payload
        );
        state.deletingCommentLoading = false;
        state.deletingCommentError = "";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deletingCommentLoading = false;
        state.deletingCommentError =
          action.error.message || "adding comment failed";
        console.log(action.error);
      });
  },
});

const comment = (state: RootState) => state.comment;
export const getCommentData = createSelector(comment, (state) => state.data);
export const getCommentLoading = (state: RootState) => state.comment.loading;
export const getCommentError = (state: RootState) => state.comment.error;

export const getCreatingCommentLoading = (state: RootState) =>
  state.comment.creatingCommentLoading;
export const getCreatingCommentError = (state: RootState) =>
  state.comment.creatingCommentError;

export const getDeletingCommentLoading = (state: RootState) =>
  state.comment.deletingCommentLoading;
export const getDeletingCommentError = (state: RootState) =>
  state.comment.deletingCommentError;

export default commentSlice.reducer;
