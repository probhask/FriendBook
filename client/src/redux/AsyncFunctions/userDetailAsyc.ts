import { createAsyncThunk } from "@reduxjs/toolkit";
import { DetailUser } from "../../types";
import { client } from "../../utils/sanityClient";
import { uploadImageToSanity } from "@utils/uploadImageToSanity";
import { RootState } from "@redux/store";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getUserDeatail = createAsyncThunk<DetailUser, { userId: string }>(
  "userDetail/getUserDeatail",
  async ({ userId }) => {
    try {
      const query = `*[_type=='user' && _id=='${userId}']{
        _id,name,'profileImage':profileImage.asset->url,'coverImage':coverImage.asset->url,email,city}`;

      const combinedPromise = client.fetch(query);

      const sanityResult = await combinedPromise;

      return sanityResult[0];
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error fetching user detail"));
    }
  }
);

export const updatePersonalInfo = createAsyncThunk<
  { name: string; city: string; email: string },
  { name: string; email: string; city: string }
>(
  "userDetail/updatePersonalInfo",
  async ({ city, email, name }, { getState }) => {
    const userId = (getState() as RootState).auth.data._id;
    try {
      const sanityResult: { city: string; name: string; email: string } =
        await client.patch(userId).set({ city, name, email }).commit();

      console.log("sanity result", sanityResult);
      return {
        city: sanityResult.city,
        email: sanityResult.email,
        name: sanityResult.name,
      };
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error updating info"));
    }
  }
);

export const updateProfileImage = createAsyncThunk<
  string,
  { profileImage: File }
>("userDetail/updateProfileImage", async ({ profileImage }, { getState }) => {
  const userId = (getState() as RootState).auth.data._id;
  try {
    const imageId = await uploadImageToSanity(profileImage);

    const sanityResult = await client
      .patch(userId)
      .set({ profileImage: { asset: { _ref: imageId } } })
      .commit();
    const query = `*[_type=='user' && _id=='${userId}']{'profileImage':profileImage.asset->url}`;

    const fetchUpdate = await client.fetch<{ profileImage: string }[]>(query);

    console.log("sanity result", sanityResult);
    console.log("upsdate fetch result", fetchUpdate);
    return fetchUpdate[0].profileImage;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error updating profile image"));
  }
});

export const updateCoverImage = createAsyncThunk<string, { coverImage: File }>(
  "userDetail/updateCoverImage",
  async ({ coverImage }, { getState }) => {
    const userId = (getState() as RootState).auth.data._id;

    try {
      const imageId = await uploadImageToSanity(coverImage);

      const sanityResult = await client
        .patch(userId)
        .set({ coverImage: { asset: { _ref: imageId } } })
        .commit();
      const query = `*[_type=='user' && _id=='${userId}']{'coverImage':coverImage.asset->url}`;

      if (sanityResult) {
        const fetchUpdate = await client.fetch<{ coverImage: string }[]>(query);
        return fetchUpdate[0].coverImage;
      }
      throw new Error("error updating cover img");
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error updating cover image"));
    }
  }
);
