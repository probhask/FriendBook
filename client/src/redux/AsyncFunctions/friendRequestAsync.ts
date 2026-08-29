import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/sanityClient";
import { RootState } from "../store";
import { RecieveFriendRequest, SendFriendRequest } from "../../types";
import {
  addToAllUserSlice,
  removeFromAllUserSlice,
} from "../slice/allUserSlice";
import { callApi } from "@utils/api";
import isInstanceOfError from "@utils/isInstanceOfError";

export const getSendFriendRequestList = createAsyncThunk<SendFriendRequest[]>(
  "friendRequest/getSendFriendRequestList",
  async (_, thunkAPI) => {
    const meId = (thunkAPI.getState() as RootState).auth.data?._id;
    try {
      const query = `*[_type=='friendRequest' && sentBy._ref==$meId]{
       _id,'sentTo':recieveBy->{_id,name,'profileImage':profileImage.asset->url},status,_createdAt}`;
      return await client.fetch<SendFriendRequest[]>(query, { meId });
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error getting sent requests"));
    }
  }
);

export const getRecieveFriendRequestList = createAsyncThunk<
  RecieveFriendRequest[]
>("friendRequest/getRecieveFriendRequestList", async (_, thunkAPI) => {
  const meId = (thunkAPI.getState() as RootState).auth.data?._id;
  try {
    const query = `*[_type=='friendRequest' && recieveBy._ref==$meId]{
       _id,'sentFrom':sentBy->{_id,name,'profileImage':profileImage.asset->url},status,_createdAt}`;
    return await client.fetch<RecieveFriendRequest[]>(query, { meId });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error getting received requests"));
  }
});

export const createFriendRequest = createAsyncThunk<
  SendFriendRequest,
  { sentToId: string }
>("friendRequest/createFriendRequest", async ({ sentToId }, { dispatch }) => {
  try {
    const created = await callApi<SendFriendRequest>("createFriendRequest", {
      sentToId,
    });
    dispatch(removeFromAllUserSlice({ userId: sentToId }));
    return created;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error creating request"));
  }
});

export const rejectRecieveFriendRequest = createAsyncThunk<
  string,
  { requestId: string }
>("friendRequest/rejectRecieved", async ({ requestId }) => {
  try {
    await callApi("deleteFriendRequest", { requestId });
    return requestId;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error rejecting request"));
  }
});

export const cancelSendedRequest = createAsyncThunk<
  string,
  { sendRequest: SendFriendRequest }
>("friendRequest/cancelSended", async ({ sendRequest }, { dispatch }) => {
  try {
    await callApi("deleteFriendRequest", { requestId: sendRequest._id });
    dispatch(addToAllUserSlice({ user: sendRequest.sentTo }));
    return sendRequest._id;
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error cancelling request"));
  }
});
