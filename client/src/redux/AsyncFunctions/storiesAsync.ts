import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoriesType } from "../../types";
import { client } from "../../utils/sanityClient";
import { RootState } from "../store";
import { uploadImageToSanity } from "@utils/uploadImageToSanity";
import { callApi } from "@utils/api";
import isInstanceOfError from "@utils/isInstanceOfError";
import getFriendsIdsList from "@api/getFriendsIdsList";
import get48HoursAgoISOString from "@utils/get48HorsString";

export const getStories = createAsyncThunk<StoriesType[]>(
  "userDetail/getStories",
  async (_, { getState }) => {
    const pageNumber = (getState() as RootState).stories.pageNumber;
    const limit = (getState() as RootState).stories.limit;
    const currentUSerId = (getState() as RootState).auth.data._id;

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const friendsIdsArray = await getFriendsIdsList(currentUSerId);
    const idArray = [...friendsIdsArray, currentUSerId];

    const cutoffDate = get48HoursAgoISOString();

    try {
      const query = `*[_type=='stories' && postedBy._ref in $idArray && _createdAt >= $cutoffDate ]|order(_createdAt desc)[$startIndex...$endIndex]{
        _id,_createdAt,'media':media.asset->url,postedBy->{_id,name,'profileImage':profileImage.asset->url}}`;

      const params = { startIndex, endIndex, idArray, cutoffDate };

      return await client.fetch<StoriesType[]>(query, params);
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error fetching stories"));
    }
  }
);

export const createStory = createAsyncThunk<StoriesType, { media: File }>(
  "stories/createStory",
  async ({ media }) => {
    try {
      const mediaAssetId = await uploadImageToSanity(media, "image");
      return await callApi<StoriesType>("createStory", { mediaAssetId });
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error creating story"));
    }
  }
);
