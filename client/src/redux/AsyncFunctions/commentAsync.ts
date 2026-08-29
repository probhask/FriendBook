import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/sanityClient";
import type { Comment } from "../../types";
import { RootState } from "../store";
import { callApi } from "@utils/api";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getComment = createAsyncThunk<Comment[], { postId: string }>(
  "comment/getComment",
  async ({ postId }, { getState }) => {
    const pageNumber = (getState() as RootState).comment.pageNumber;
    const limit = (getState() as RootState).comment.limit;
    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    try {
      const query = `*[_type=='comment' && post._ref==$postId] |order(_createdAt desc)[$startIndex...$endIndex]{
        _id,comments,'postedBy':postedBy->{_id,name,'profileImage':profileImage.asset->url},'postId':post->{_id},_createdAt}`;

      const params = { postId, startIndex, endIndex };

      return await client.fetch<Comment[]>(query, params);
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error fetching comments"));
    }
  }
);

export const addComment = createAsyncThunk<
  Comment,
  { comment: string; postId: string }
>("comment/addComment", async ({ postId, comment }) => {
  try {
    return await callApi<Comment>("addComment", { postId, comments: comment });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error creating comment"));
  }
});

export const deleteComment = createAsyncThunk<
  { commentId: string; postId: string },
  { commentId: string; postId: string }
>("comment/deleteComment", async ({ commentId, postId }) => {
  try {
    await callApi("deleteComment", { commentId });
    return { commentId, postId };
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error deleting comment"));
  }
});
