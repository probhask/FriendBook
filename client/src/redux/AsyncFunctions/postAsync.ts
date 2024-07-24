import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostsType } from "types";
import { RootState } from "@redux/store";
import getFriendsIdsList from "@api/getFriendsIdsList";
import isInstanceOfError from "@utils/isInstanceOfError";
import { client } from "@utils/sanityClient";
import { uploadImageToSanity } from "@utils/uploadImageToSanity";
import { v4 as uuidv4 } from "uuid";

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
export const createPost = createAsyncThunk<
  PostsType,
  {
    postDesc: string;
    image: File;
    tagUser: string[]; // Array of user IDs to tag
  },
  { state: RootState }
>("posts/createPost", async ({ image, postDesc, tagUser }, thunkAPI) => {
  try {
    // console.log(image, postDesc, tagUser);
    const currentUSerId = (thunkAPI.getState() as RootState).auth.data._id;

    // Usage of uploadImageToSanity within the async thunk
    const imageId = await uploadImageToSanity(image);
    const newPost = {
      _type: "post",
      postDesc,
      image: {
        _type: "image",
        asset: {
          _ref: imageId, // Replace with the actual image asset ID
          _type: "reference",
        },
      },
      tagUser: tagUser.map((userId) => ({
        _type: "reference",
        _ref: userId,
        _key: uuidv4(),
      })),
      postedBy: { _type: "reference", _ref: currentUSerId },
    };

    // Call Sanity client to create the document
    const createdPost = await client.create(newPost);

    const query = `*[_type=='post'&& _id==$postId][0]{
        _id,
    postDesc,
    'image': image.asset->url,
    postedBy->{_id, name, 'profileImage': profileImage.asset->url, isLoggedIn},
    'tagUser': tagUser[0]->{_id,name},
    "totalTagUser":count(tagUser),
    'LikedInfo':*[_type == 'like' && (likeby._ref == $currentUSerId && post._ref == ^._id)][0]{_id},
    'isLikedByUser': defined(*[_type == 'like' && (likeby._ref == $currentUSerId && post._ref == ^._id)][0]),
    _createdAt}`;
    const params = { postId: createdPost._id, currentUSerId };

    const sanityResult = await client.fetch<PostsType>(query, params);

    return sanityResult;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error creating post"));
  }
});

export const deletePost = createAsyncThunk<string, { postId: string }>(
  "post/deletePost",
  async ({ postId }) => {
    try {
      const sanityResult = await client.delete(postId);

      if (sanityResult) {
        return postId;
      }
      throw new Error("error deleting post");
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error deleting post"));
    }
  }
);

export const likePost = createAsyncThunk<string, { postId: string }>(
  "post/likePost",
  async ({ postId }, { getState }): Promise<string> => {
    const currentUserId = (getState() as RootState).auth.data._id;
    try {
      const postDoc = {
        _type: "like",
        likeby: {
          _type: "reference",
          _ref: currentUserId,
        },
        post: {
          _type: "reference",
          _ref: postId,
        },
      };

      const sanityResult = await client.create(postDoc);

      return sanityResult._id;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error liking post"));
    }
  }
);
export const unlikePost = createAsyncThunk<
  string,
  { likeId: string; postId: string }
>("post/unlikePost", async ({ likeId }): Promise<string> => {
  try {
    const sanityResult = await client.delete(likeId);
    if (sanityResult) {
      return likeId;
    } else {
      throw new Error("Like document not found");
    }
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error unliking post"));
  }
});
