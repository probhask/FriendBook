import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/sanityClient";
import type { Comment } from "../../types";
import { RootState } from "../store";
import getCommentByCommentId from "../../api/getCommentByCommentId";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getComment = createAsyncThunk<Comment[], { postId: string }>(
  "comment/getComment",
  async ({ postId }, { getState }) => {
    const pageNumber = (getState() as RootState).comment.pageNumber;
    const limit = (getState() as RootState).comment.limit;
    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit - 1;
    try {
      const query = `*[_type=='comment' && post._ref==$postId] |order(_createdAt desc){
        _id,comments,'postedBy':postedBy->{_id,name,'profileImage':profileImage.asset->url},'postId':post->{_id},_createdAt}`;

      const params = { postId, startIndex, endIndex };

      const sanityResult = await client.fetch(query, params);

      return sanityResult;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error fetching comments"));
    }
  }
);

export const addComment = createAsyncThunk<
  Comment,
  { comment: string; postId: string }
>("comment/addComment", async ({ postId, comment }, { getState }) => {
  const currentUserId = (getState() as RootState).auth.data._id;

  try {
    const doc = {
      _type: "comment",
      comments: comment,
      postedBy: { _type: "reference", _ref: currentUserId },
      post: { _type: "reference", _ref: postId },
    };
    const sanityResult = await client.create(doc);
    const newComment = await getCommentByCommentId(sanityResult._id);

    return newComment;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error creating comments"));
  }
});

export const deleteComment = createAsyncThunk<string, { commentId: string }>(
  "comment/deleteComment",
  async ({ commentId }): Promise<string> => {
    try {
      const sanityResult = await client.delete(commentId);
      if (sanityResult) {
        return commentId;
      }
      throw new Error("failed to delete comment");
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error deleting comments"));
    }
  }
);
