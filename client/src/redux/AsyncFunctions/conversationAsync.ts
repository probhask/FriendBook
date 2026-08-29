import { createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation } from "types";
import isInstanceOfError from "@utils/isInstanceOfError";
import { RootState } from "@redux/store";
import { client } from "@utils/sanityClient";
import { callApi } from "@utils/api";

const USER_SUB = `{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}`;

export const getConversation = createAsyncThunk<Conversation[]>(
  "conversation/getConversation",
  async (_, thunkAPI) => {
    const meId = (thunkAPI.getState() as RootState).auth.data?._id;

    try {
      const query = `*[_type=='conversation' && (userA._ref==$meId || userB._ref==$meId)]{
        _id,
        'partner': coalesce(
          select(userA._ref != $meId => userA->${USER_SUB}),
          select(userB._ref != $meId => userB->${USER_SUB}),
          null
        ),
        _createdAt
      }`;

      return await client.fetch<Conversation[]>(query, { meId });
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error getting conversations"));
    }
  }
);

export const checkIfNotCreateConversation = createAsyncThunk<
  Conversation,
  { secondUserId: string }
>("conversations/checkIfNotCreateConversation", async ({ secondUserId }) => {
  try {
    return await callApi<Conversation>("createConversation", { secondUserId });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error creating conversation"));
  }
});
