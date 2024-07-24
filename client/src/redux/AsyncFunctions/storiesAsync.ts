import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoriesType } from "../../types";
import { client } from "../../utils/sanityClient";
import { RootState } from "../store";
import { uploadImageToSanity } from "@utils/uploadImageToSanity";
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
    const endIndex = pageNumber + limit - 1;
    const friendsIdsArray = await getFriendsIdsList(currentUSerId);
    const idArray = [...friendsIdsArray, currentUSerId];

    const cutoffDate = get48HoursAgoISOString();

    try {
      const query = `*[_type=='stories' && postedBy._ref in $idArray && _createdAt >= $cutoffDate ]|order(_createdAt desc)[$startIndex...$endIndex]{
        _id,_createdAt,'media':media.asset->url,postedBy->{_id,name,'profileImage':profileImage.asset->url}}`;

      const params = { startIndex, endIndex, idArray, cutoffDate };
      // console.log(params);

      const sanityResult = await client.fetch(query, params);
      // console.log(params, sanityResult);

      // console.log("storie sresuult", sanityResult);

      return sanityResult;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error fetching story");
    }
  }
);

export const createStory = createAsyncThunk<StoriesType, { media: File }>(
  "stories/createStory",
  async ({ media }, { getState }) => {
    // console.log(image, postDesc, tagUser);
    const currentUSerId = (getState() as RootState).auth.data._id;

    // Usage of uploadImageToSanity within the async thunk
    const imageId = await uploadImageToSanity(media);
    try {
      const newStory = await client.create({
        _type: "stories",
        media: {
          _type: "image",
          asset: {
            _ref: imageId, // Replace with the actual image asset ID
            _type: "reference",
          },
        },
        postedBy: { _type: "reference", _ref: currentUSerId },
      });
      if (newStory) {
        const query = `*[_type=='stories' && _id=='${newStory._id}']{
        _id,_createdAt,'media':media.asset->url,postedBy->{_id,name,'profileImage':profileImage.asset->url}}`;
        const sanityResult = await client.fetch(query);
        return sanityResult[0];
      }
      // return newStory;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error creating new story");
    }
  }
);
