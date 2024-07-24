import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/sanityClient";
import { RootState } from "../store";
import { RecieveFriendRequest, SendFriendRequest } from "../../types";
import {
  addToAllUserSlice,
  removeFromAllUserSlice,
} from "../slice/allUserSlice";
import { SanityDocumentStub } from "@sanity/client";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getSendFriendRequestList = createAsyncThunk<SendFriendRequest[]>(
  "friendRequest/getSendFriendRequestList",
  async (_, thunkAPI) => {
    const store = thunkAPI.getState() as RootState;
    const currentUserId = store.auth.data?._id;
    try {
      const query = `*[_type=='friendRequest' && sentBy._ref=='${currentUserId}']{
       _id,'sentTo':recieveBy->{_id,name,'profileImage':profileImage.asset->url},status}`;

      const sanityResult = await client.fetch(query);

      return sanityResult;
    } catch (error) {
      throw new Error(
        isInstanceOfError(error) || "error getting sended reqquest"
      );
    }
  }
);
export const getRecieveFriendRequestList = createAsyncThunk<
  RecieveFriendRequest[]
>("friendRequest/getRecieveFriendRequestList", async (_, thunkAPI) => {
  const store = thunkAPI.getState() as RootState;
  const currentUserId = store.auth.data?._id;
  try {
    const query = `*[_type=='friendRequest' && recieveBy._ref=='${currentUserId}']{
       _id,'sentFrom':sentBy->{_id,name,'profileImage':profileImage.asset->url},status}`;

    const sanityResult = await client.fetch(query);

    return sanityResult;
  } catch (error) {
    throw new Error(
      isInstanceOfError(error) || "error getting receiveing request"
    );
  }
});

export const createFriendRequest = createAsyncThunk<
  SendFriendRequest,
  { sentToId: string }
>(
  "friendRequests/createFriendRequest",
  async ({ sentToId }, { getState, dispatch }) => {
    try {
      const currentUSerId = (getState() as RootState).auth.data?._id;

      const newRequest: SanityDocumentStub = {
        _type: "friendRequest",
        sentBy: {
          _type: "reference",
          _ref: currentUSerId,
        },
        recieveBy: {
          _type: "reference",
          _ref: sentToId,
        },
        status: "pending",
      };

      // Call Sanity client to create the document
      const createdRequest = await client.create(newRequest);

      if (createdRequest) {
        dispatch(removeFromAllUserSlice({ userId: sentToId }));
      }

      const detailCreatedRequest: SendFriendRequest = await client.fetch(
        `*[_type=='friendRequest' && _id=='${createdRequest._id}'][0]{
       _id,'sentTo':recieveBy->{_id,name,'profileImage':profileImage.asset->url},status}`
      );

      // Return the created document data
      return detailCreatedRequest;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error creating request");
    }
  }
);

export const rejectRecieveFriendRequest = createAsyncThunk<
  string, // Return type of async thunk
  { requestId: string } // Arguments passed to async thunk
>("friendRequests/deleteFriendRequest", async ({ requestId }) => {
  try {
    const result = await client.delete(requestId);
    if (result) {
      return requestId;
    } else {
      throw new Error("error creating request");
    }
  } catch (error) {
    throw new Error(isInstanceOfError(error) || "error creating request");
  }
});

export const cancelSendedRequest = createAsyncThunk<
  string,
  { sendRequest: SendFriendRequest }
>(
  "friendRequests/cancelSendedRequest",
  async ({ sendRequest }, { dispatch }) => {
    try {
      const result = await client.delete(sendRequest._id);

      if (result) {
        dispatch(addToAllUserSlice({ user: sendRequest.sentTo }));
      }
      return sendRequest._id;
    } catch (error) {
      throw new Error(
        isInstanceOfError(error) || "error cancel Sended Request "
      );
    }
  }
);
