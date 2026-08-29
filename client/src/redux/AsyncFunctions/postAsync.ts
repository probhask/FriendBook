import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostsType } from "types";
import { RootState } from "@redux/store";
import getFriendsIdsList from "@api/getFriendsIdsList";
import isInstanceOfError from "@utils/isInstanceOfError";
import { client } from "@utils/sanityClient";
import { uploadImageToSanity } from "@utils/uploadImageToSanity";
import { callApi } from "@utils/api";

export const getPosts = createAsyncThunk<
  PostsType[],
  { userId: string; own?: boolean }
>("post/getPosts", async ({ userId, own }, { getState }) => {
  const state = getState() as RootState;
  const pageNumber = state.post.pageNumber;
  const limit = state.post.limit;
  // The logged-in user — always used for "did *I* like this", independent of
  // whose feed/profile is being viewed.
  const viewerId = state.auth.data._id;
  // Query uses an exclusive-end slice `[startIndex...endIndex]`.
  const startIndex = (pageNumber - 1) * limit;
  const endIndex = pageNumber * limit;

  const projection = `{
    _id,
    postDesc,
    'image': image.asset->url,
    mediaType,
    'video': video.asset->url,
    'audio': audio.asset->url,
    audioMeta,
    postedBy->{_id, name, 'profileImage': profileImage.asset->url, isLoggedIn},
    'tagUser': tagUser[0]->{_id,name},
    "totalTagUser":count(tagUser),
    "likeCount": count(*[_type == 'like' && post._ref == ^._id]),
    "commentCount": count(*[_type == 'comment' && post._ref == ^._id]),
    'LikedInfo':*[_type == 'like' && (likeby._ref == $viewerId && post._ref == ^._id)][0]{_id},
    'isLikedByUser': defined(*[_type == 'like' && (likeby._ref == $viewerId && post._ref == ^._id)][0]),
    _createdAt
  }`;

  try {
    let query: string;
    let params: Record<string, unknown>;

    if (own) {
      // Profile view — just this user's posts, newest first.
      // `_id` is a stable tiebreaker so pages never overlap when _createdAt ties.
      query = `*[_type == 'post' && postedBy._ref == $userId]
        | order(_createdAt desc, _id) [$startIndex...$endIndex]${projection}`;
      params = { userId, viewerId, startIndex, endIndex };
    } else {
      // Home feed — everyone's posts, but ranked:
      //   1. friends' posts + posts you're tagged in, before strangers'
      //   2. posts you haven't liked yet, before ones you have
      //   3. newest first
      // A failed friends lookup shouldn't blank the whole feed — fall back to
      // "no friends" ranking (everyone still shows, just not friend-prioritised).
      const friendsIdsArray = await getFriendsIdsList(userId).catch(() => []);
      const idArray = [...friendsIdsArray, userId];
      query = `*[_type == 'post']
        | order(
            (postedBy._ref in $idArray || tagUser[]._ref in $idArray) desc,
            defined(*[_type == 'like' && likeby._ref == $viewerId && post._ref == ^._id][0]) asc,
            _createdAt desc,
            _id
          ) [$startIndex...$endIndex]${projection}`;
      params = { idArray, viewerId, startIndex, endIndex };
    }

    const sanityResult = await client.fetch<PostsType[]>(query, params);

    return sanityResult;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error fetching posts"));
  }
});

export type CreatePostArgs = {
  postDesc: string;
  tagUser: string[];
  mediaType: "image" | "video" | "audioImage";
  image?: File;
  video?: File;
  audio?: File;
  audioMeta?: { trackName?: string; startSec?: number; endSec?: number };
};

export const createPost = createAsyncThunk<PostsType, CreatePostArgs>(
  "posts/createPost",
  async ({ image, video, audio, audioMeta, postDesc, tagUser, mediaType }) => {
    try {
      const payload: Record<string, unknown> = { postDesc, tagUser, mediaType };

      if (mediaType === "video") {
        if (!video) throw new Error("a video file is required");
        payload.videoAssetId = await uploadImageToSanity(video, "file");
      } else {
        if (!image) throw new Error("an image is required");
        payload.imageAssetId = await uploadImageToSanity(image, "image");
        if (mediaType === "audioImage") {
          if (!audio) throw new Error("an audio track is required");
          payload.audioAssetId = await uploadImageToSanity(audio, "file");
          payload.audioMeta = audioMeta || {};
        }
      }

      return await callApi<PostsType>("createPost", payload);
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error creating post"));
    }
  }
);

export const deletePost = createAsyncThunk<string, { postId: string }>(
  "post/deletePost",
  async ({ postId }) => {
    try {
      await callApi("deletePost", { postId });
      return postId;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error deleting post"));
    }
  }
);

export const likePost = createAsyncThunk<string, { postId: string }>(
  "post/likePost",
  async ({ postId }) => {
    try {
      const { likeId } = await callApi<{ likeId: string }>("likePost", {
        postId,
      });
      return likeId;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error liking post"));
    }
  }
);

export const unlikePost = createAsyncThunk<
  string,
  { likeId: string; postId: string }
>("post/unlikePost", async ({ likeId }) => {
  try {
    await callApi("unlikePost", { likeId });
    return likeId;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error unliking post"));
  }
});
