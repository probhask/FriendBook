import { createAsyncThunk } from "@reduxjs/toolkit";
import { Conversation } from "types";
import isInstanceOfError from "@utils/isInstanceOfError";
import { RootState } from "@redux/store";
import { client } from "@utils/sanityClient";

export const getConversation = createAsyncThunk<Conversation[]>(
  "conversation/getConversation",
  async (_, thunkAPI) => {
    const store = thunkAPI.getState() as RootState;
    const currentUserId = store.auth.data?._id;

    try {
      const query = `*[_type=='conversation' && (userA._ref=='${currentUserId}' || userB._ref=='${currentUserId}')]{_id,'partner':coalesce(
      select(userA._ref != '${currentUserId}'=> userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
      select(userB._ref != '${currentUserId}'=> userB->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null)
    ),_createdAt}`;

      const sanityResult: Conversation[] = await client.fetch(query);

      return sanityResult;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error getting coverstaion");
    }
  }
);

// Define the createAsyncThunk action
export const checkIfNotCreateConversation = createAsyncThunk<
  Conversation,
  {
    secondUserId: string; // _id of userA
  }
>(
  "conversations/checkIfNotCreateConversation",
  async ({ secondUserId }, thunkAPI) => {
    const currentUserId = (thunkAPI.getState() as RootState).auth.data._id;
    try {
      const checkQuery = `*[_type == 'conversation' &&
(($currentUserId == userA._ref && $secondUserId == userB._ref) ||($currentUserId == userB._ref && $secondUserId == userA._ref))][0]{_id,'partner':coalesce(
      select(userA._ref != '${currentUserId}'=> userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
      select(userB._ref != '${currentUserId}'=> userB->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null)
    ),_createdAt}`;
      const checkParams = { currentUserId, secondUserId };
      const conversationsExist = await client.fetch<Conversation>(
        checkQuery,
        checkParams
      );

      if (
        conversationsExist &&
        conversationsExist !== null &&
        conversationsExist._id
      ) {
        return conversationsExist;
      }

      const newConversation = {
        _type: "conversation",
        userA: {
          _type: "reference",
          _ref: currentUserId,
        },
        userB: {
          _type: "reference",
          _ref: secondUserId,
        },
      };

      // Call your Sanity client to create the document
      const createdConversation = await client.create(newConversation);

      const query = `*[_type=='conversation' &&
        -id==$createdConversationId]{_id,
        'partner':coalesce(
        select(userA._ref != $currentUserId=> userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
        select(userB._ref != $currentUserId=> userB->{_id,name,'profileImage':profileImage.asset->url},isLoggedIn, null)
      ),_createdAt}`;

      const params = {
        createdConversationId: createdConversation._id,
        currentUserId,
      };

      const sanityResult: Conversation = await client.fetch(query, params);

      return sanityResult; // Return the created
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "error creating coverstaion");
    }
  }
);
