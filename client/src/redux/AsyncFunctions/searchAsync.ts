import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "types";
import { client } from "@utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

export const searchUser = createAsyncThunk<User[], { searchTerm: string }>(
  "search/searchUser",
  async ({ searchTerm }, { getState }) => {
    const currentUserId = (getState() as RootState).auth.data._id;
    try {
      if (searchTerm && searchTerm.length > 0) {
        const query = `*[_type == 'user' && (_id!=$currentUserId && lower(name) match $searchTerm ) ][0...4]{
        _id,
        name,
        'profileImage': profileImage.asset->url
      }`;
        const params = {
          currentUserId,
          searchTerm: `${searchTerm}*`,
        };
        // console.log(params);

        const sanityResult = await client.fetch<User[]>(query, params);
        // console.log(sanityResult);
        return sanityResult;
      }
      return [];
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error searching");
    }
  }
);
