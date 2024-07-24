import getFriendrequestIds from "@api/getFriendrequestIds";
import getFriendsIdsList from "@api/getFriendsIdsList";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "types";
import { client } from "@utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getAllUser = createAsyncThunk<User[]>(
  "allUser/getAllUser",
  async (_, { getState }) => {
    const currentUserId = (getState() as RootState).auth.data._id;
    try {
      const friendsIdArray = await getFriendsIdsList(currentUserId);
      const alreadyFriendRequestId = await getFriendrequestIds(currentUserId);
      const idsArray = [
        ...friendsIdArray,
        currentUserId,
        ...alreadyFriendRequestId,
      ];

      const params = { idsArray };

      const query = `*[_type == 'user' && !(_id in $idsArray)] {
        _id,
        name,
        'profileImage': profileImage.asset->url
      }`;

      const sanityResult = await client.fetch<User[]>(query, params);

      return sanityResult;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error geting all users");
    }
  }
);
