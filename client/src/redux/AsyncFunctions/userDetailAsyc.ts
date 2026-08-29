import { createAsyncThunk } from "@reduxjs/toolkit";
import { DetailUser } from "../../types";
import { client } from "../../utils/sanityClient";
import { uploadImageToSanity } from "@utils/uploadImageToSanity";
import { callApi } from "@utils/api";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getUserDeatail = createAsyncThunk<DetailUser, { userId: string }>(
  "userDetail/getUserDeatail",
  async ({ userId }) => {
    try {
      const query = `*[_type=='user' && _id==$userId][0]{
        _id,name,'profileImage':profileImage.asset->url,'coverImage':coverImage.asset->url,email,city}`;
      return await client.fetch<DetailUser>(query, { userId });
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error fetching user detail"));
    }
  }
);

export const updatePersonalInfo = createAsyncThunk<
  { name: string; city: string; email: string },
  { name: string; email: string; city: string }
>("userDetail/updatePersonalInfo", async ({ city, email, name }) => {
  try {
    return await callApi<{ name: string; city: string; email: string }>(
      "updatePersonalInfo",
      { name, city, email }
    );
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error updating info"));
  }
});

export const updateProfileImage = createAsyncThunk<
  string,
  { profileImage: File }
>("userDetail/updateProfileImage", async ({ profileImage }) => {
  try {
    const assetId = await uploadImageToSanity(profileImage, "image");
    const { profileImage: url } = await callApi<{ profileImage: string }>(
      "updateProfileImage",
      { assetId }
    );
    return url;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error updating profile image"));
  }
});

export const updateCoverImage = createAsyncThunk<string, { coverImage: File }>(
  "userDetail/updateCoverImage",
  async ({ coverImage }) => {
    try {
      const assetId = await uploadImageToSanity(coverImage, "image");
      const { coverImage: url } = await callApi<{ coverImage: string }>(
        "updateCoverImage",
        { assetId }
      );
      return url;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error updating cover image"));
    }
  }
);
