import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Friend, RecieveFriendRequest } from "types";
import isInstanceOfError from "@utils/isInstanceOfError";
import { client } from "@utils/sanityClient";
import { callApi } from "@utils/api";
import { removeRecievedRequest } from "../slice/friendRequestSlice";

const USER_SUB = `{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}`;

export const getFriendsList = createAsyncThunk<Friend[]>(
  "friend/getFriendsList",
  async (_, { getState }) => {
    const meId = (getState() as RootState).auth.data?._id;

    try {
      const query = `*[_type == 'friends' && (userA._ref == $meId || userB._ref == $meId)]{
        _id,
        'friend': coalesce(
          select(userA._ref != $meId => userA->${USER_SUB}),
          select(userB._ref != $meId => userB->${USER_SUB}),
          null
        )
      }`;
      return await client.fetch<Friend[]>(query, { meId });
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error getting friend list"));
    }
  }
);

export const acceptRequest = createAsyncThunk<
  Friend,
  { recieveRequest: RecieveFriendRequest }
>("friend/acceptRequest", async ({ recieveRequest }, { dispatch }) => {
  try {
    const friend = await callApi<Friend>("acceptRequest", {
      requestId: recieveRequest._id,
    });
    dispatch(removeRecievedRequest({ requestId: recieveRequest._id }));
    return friend;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error accepting request"));
  }
});

export const unFriend = createAsyncThunk<string, { friendShipId: string }>(
  "friend/unFriend",
  async ({ friendShipId }) => {
    try {
      await callApi("unFriend", { friendShipId });
      return friendShipId;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error unfriending"));
    }
  }
);
