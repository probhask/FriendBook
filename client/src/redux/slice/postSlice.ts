import { createSelector, createSlice } from "@reduxjs/toolkit";
import { PostsType } from "../../types";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
  unlikePost,
} from "../AsyncFunctions/postAsync";
import { addComment, deleteComment } from "../AsyncFunctions/commentAsync";
import { RootState } from "../store";
import toast from "react-hot-toast";

type PostSliceInitialState = {
  data: PostsType[];
  loading: boolean;
  error: string;
  pageNumber: number;
  hasMore: boolean;
  limit: number;
  creatingPostLoading: boolean;
  creatingPostError: string;
  deletingPostLoading: boolean;
  deletingPostError: string;
};

const initialState: PostSliceInitialState = {
  data: [],
  loading: false,
  error: "",
  pageNumber: 1,
  hasMore: true,
  limit: 6,
  creatingPostLoading: false,
  creatingPostError: "",
  deletingPostLoading: false,
  deletingPostError: "",
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // Call before re-fetching a different feed (e.g. switching profiles) so
    // pagination doesn't carry over stale page numbers / accumulated posts.
    resetFeed: (state) => {
      state.data = [];
      state.pageNumber = 1;
      state.hasMore = true;
      state.error = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.hasMore = action.payload.length >= state.limit;
        const seen = new Set(state.data.map((p) => p._id));
        state.data.push(...action.payload.filter((p) => !seen.has(p._id)));
        state.loading = false;
        state.error = "";
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        if (action.meta.aborted) return;
        state.error = action.error.message || "error in getting post";
        state.hasMore = false;
      });

    builder
      .addCase(createPost.pending, (state) => {
        state.creatingPostLoading = true;
        state.creatingPostError = "";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.data = [action.payload, ...state.data];
        state.creatingPostLoading = false;
        state.creatingPostError = "";
        toast.success("post created");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creatingPostLoading = false;
        state.creatingPostError =
          action.error.message || "error in creating post";
        toast.error(state.creatingPostError);
      });

    builder
      .addCase(deletePost.pending, (state) => {
        state.deletingPostLoading = true;
        state.deletingPostError = "";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.data = state.data.filter((post) => post._id !== action.payload);
        state.deletingPostLoading = false;
        state.deletingPostError = "";
        toast.success("post deleted");
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deletingPostLoading = false;
        state.deletingPostError =
          action.error.message || "error in deleting post";
        toast.error(state.deletingPostError);
      });

    builder
      .addCase(likePost.pending, (state, action) => {
        const post = state.data.find((p) => p._id === action.meta.arg.postId);
        if (post && !post.isLikedByUser) {
          post.isLikedByUser = true;
          post.likeCount += 1;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.data.find((p) => p._id === action.meta.arg.postId);
        if (post) {
          post.isLikedByUser = true;
          post.LikedInfo = { _id: action.payload };
        }
        state.error = "";
      })
      .addCase(likePost.rejected, (state, action) => {
        const post = state.data.find((p) => p._id === action.meta.arg.postId);
        if (post && post.isLikedByUser) {
          post.isLikedByUser = false;
          post.likeCount = Math.max(0, post.likeCount - 1);
        }
        state.error = action.error.message || "error in liking post";
      });

    builder
      .addCase(unlikePost.pending, (state, action) => {
        const post = state.data.find(
          (p) => p.LikedInfo?._id === action.meta.arg.likeId
        );
        if (post && post.isLikedByUser) {
          post.isLikedByUser = false;
          post.likeCount = Math.max(0, post.likeCount - 1);
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.data.find(
          (p) => p.LikedInfo?._id === action.meta.arg.likeId
        );
        if (post) {
          post.isLikedByUser = false;
          post.LikedInfo = null;
        }
        state.error = "";
      })
      .addCase(unlikePost.rejected, (state, action) => {
        const post = state.data.find(
          (p) => p.LikedInfo?._id === action.meta.arg.likeId
        );
        if (post && !post.isLikedByUser) {
          post.isLikedByUser = true;
          post.likeCount += 1;
        }
        state.error = action.error.message || "error in unliking post";
      });

    // Keep the post's comment count in sync with the comment thread.
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.data.find(
          (p) => p._id === action.payload?.postId
        );
        if (post) post.commentCount += 1;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const post = state.data.find((p) => p._id === action.payload.postId);
        if (post) post.commentCount = Math.max(0, post.commentCount - 1);
      });
  },
});

const post = (state: RootState) => state.post;
export const getPostData = createSelector(post, (state) => state.data);

export const getPostPage = (state: RootState) => state.post.pageNumber;
export const getPostHasMore = (state: RootState) => state.post.hasMore;

export const getPostLoading = (state: RootState) => state.post.loading;
export const getPostError = (state: RootState) => state.post.error;

export const getCreatingPostLoading = (state: RootState) =>
  state.post.creatingPostLoading;
export const getCreatingPostError = (state: RootState) =>
  state.post.creatingPostError;

export const getDeletingPostLoading = (state: RootState) =>
  state.post.deletingPostLoading;
export const getDeletingPostError = (state: RootState) =>
  state.post.deletingPostError;

export const { resetFeed } = postSlice.actions;
export default postSlice.reducer;
