import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Friend, RecieveFriendRequest } from "types";
import isInstanceOfError from "@utils/isInstanceOfError";
import { client } from "@utils/sanityClient";
import { rejectRecieveFriendRequest } from "./friendRequestAsync";
import getFriendById from "@api/getFriendById";

export const getFriendsList = createAsyncThunk<Friend[]>(
  "friend/getFriendsList",
  async (_, { getState }) => {
    const currentUserId = (getState() as RootState).auth.data?._id;

    try {
      const query = `*[_type == 'friends' && (userA._ref == '${currentUserId}' || userB._ref == '${currentUserId}')]{
    _id,
    'friend': coalesce(
      select(userA._ref != '${currentUserId}'=> userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
      select(userB._ref != '${currentUserId}'=> userB->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null)
    )
  }`;
      const sanityResult = await client.fetch(query).then((result) => result);

      return sanityResult;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error getting friendlist");
    }
  }
);

export const acceptRequest = createAsyncThunk<
  Friend,
  { recieveRequest: RecieveFriendRequest }
>(
  "friend/acceptRequest",
  async ({ recieveRequest }, { getState, dispatch }) => {
    const currentUserId = (getState() as RootState).auth.data?._id;

    const doc = {
      _type: "friends",
      userA: {
        _type: "reference",
        _ref: recieveRequest.sentFrom._id,
      },
      userB: {
        _type: "reference",
        _ref: currentUserId,
      },
    };

    try {
      const createFriend = await client.create(doc);

      dispatch(rejectRecieveFriendRequest({ requestId: recieveRequest._id }));

      const getDetailFriend: Friend = await getFriendById({
        currentUserId,
        friendsId: createFriend._id,
      });
      return getDetailFriend;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error accepting request");
    }
  }
);

export const unFriend = createAsyncThunk<string, { friendShipId: string }>(
  "friendRequests/deleteFriendRequest",
  async ({ friendShipId }) => {
    try {
      const result = await client.delete(friendShipId);
      if (result) {
        return friendShipId;
      } else {
        throw new Error("error unfriending");
      }
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error unfriending");
    }
  }
);
