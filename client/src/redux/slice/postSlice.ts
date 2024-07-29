import { createSelector, createSlice } from "@reduxjs/toolkit";
import { PostsType } from "../../types";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
  unlikePost,
} from "../AsyncFunctions/postAsync";
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
  limit: 3,
  creatingPostLoading: false,
  creatingPostError: "",
  deletingPostLoading: false,
  deletingPostError: "",
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.hasMore =
          action.payload.length > 0 || action.payload.length >= state.limit;
        if (state.pageNumber === 1) {
          state.data = action.payload;
        } else {
          state.data.push(...action.payload);
        }
        state.pageNumber += 1;
        state.loading = false;
        state.error = "";
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in getting post";
        state.hasMore = false;
        // console.log(state.error);
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
        state.data.filter((post) => post._id !== action.payload);
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
        state.data = state.data.map((post) => {
          if (post._id === action.meta.arg.postId) {
            return { ...post, isLikedByUser: true };
          }
          return post;
        });
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const data = state.data.map((post) => {
          if (post._id === action.meta.arg.postId) {
            return {
              ...post,
              isLikedByUser: true,
              LikedInfo: { _id: action.payload },
            };
          }
          return post;
        });

        state.data = data;

        state.error = "";
      })
      .addCase(likePost.rejected, (state, action) => {
        state.data = state.data.map((post) => {
          if (post._id === action.meta.arg.postId) {
            return { ...post, isLikedByUser: false };
          }
          return post;
        });

        state.error = action.error.message || "error in liking post";
        console.log(state.error);
      });

    builder
      .addCase(unlikePost.pending, (state, action) => {
        console.log("unlike");

        state.data = state.data.map((post) => {
          if (post.LikedInfo?._id === action.meta.arg.likeId) {
            console.log(
              "matched part",
              post.LikedInfo._id,
              action.meta.arg.likeId
            );

            return { ...post, isLikedByUser: false };
          }
          return post;
        });
      })

      .addCase(unlikePost.fulfilled, (state, action) => {
        state.data = state.data.map((post) => {
          if (post.LikedInfo?._id === action.meta.arg.likeId) {
            return {
              ...post,
              isLikedByUser: false,
              LikedInfo: null,
            };
          }
          return post;
        });
        state.error = "";
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.data = state.data.map((post) => {
          if (post.LikedInfo?._id === action.meta.arg.likeId) {
            return { ...post, isLikedByUser: true };
          }
          return post;
        });

        state.error = action.error.message || "error in unliking post";
        console.log(state.error);
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

export default postSlice.reducer;
