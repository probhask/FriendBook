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
  const pageNumber = (getState() as RootState).post.pageNumber;
  const limit = (getState() as RootState).post.limit;
  const startIndex = (pageNumber - 1) * limit;
  const endIndex = pageNumber * limit - 1;

  try {
    let idArray = [userId];
    if (!own) {
      const friendsIdsArray = await getFriendsIdsList(userId);
      idArray = [...friendsIdsArray, userId];
    }

    const query = `
  *[_type == 'post' && (
    postedBy._ref in $idArray ||
    tagUser[]._ref in $idArray
  )]
  | order(_createdAt desc) [$startIndex...$endIndex]{
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
    'LikedInfo':*[_type == 'like' && (likeby._ref == $userId && post._ref == ^._id)][0]{_id},
    'isLikedByUser': defined(*[_type == 'like' && (likeby._ref == $userId && post._ref == ^._id)][0]),
    _createdAt
  }
`;
    const params = { idArray, startIndex, endIndex, userId };

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
