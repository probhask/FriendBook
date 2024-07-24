import { createAsyncThunk } from "@reduxjs/toolkit";
import getMessageByMsgId from "@api/getMesssageByMsgId";
import { addMessage } from "@redux/slice/messageSlice";
import isInstanceOfError from "@utils/isInstanceOfError";
import { Message, User } from "types";
import { RootState } from "@redux/store";
import { client } from "@utils/sanityClient";

export const getMessage = createAsyncThunk<
  { messages: Message[]; partner: User },
  { conversationId: string }
>("message/getMessage", async ({ conversationId }, { getState }) => {
  const currentUserId = (getState() as RootState).auth.data?._id;

  try {
    const msgQuery = `*[_type=='chat' && conversation._ref=='${conversationId}']|order(_createdAt asc){_id,message,'conversationId':conversation->_id,sender->{_id,name,'profileImage':profileImage.asset->url},sentStatus,receiveStatus,_createdAt}`;

    const partnerQuery = `*[_type=='conversation' && _id==$conversationId][0]{'partner':coalesce(
      select(userA._ref != '${currentUserId}'=> userA->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null),
      select(userB._ref != '${currentUserId}'=> userB->{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}, null)
    )}`;
    const partnerParams = { conversationId, currentUserId };

    const sanityResult = await client.fetch(msgQuery);
    const partnerResult = await client.fetch(partnerQuery, partnerParams);

    return {
      messages: sanityResult as Message[],
      partner: partnerResult.partner,
    };
  } catch (error) {
    throw new Error(isInstanceOfError(error) || "error getting message");
  }
});

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ conversationId }: { conversationId: string }, { dispatch }) => {
    try {
      const query = `*[_type=='chat' && conversation._ref==$conversationId]|order(_createdAt asc){_id,message,'conversationId':conversation->_id,sender->{_id,name,'profileImage':profileImage.asset->url},sentStatus,receiveStatus,_createdAt}`;

      // Subscribe to real-time updates
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      client
        .listen(query, {
          conversationId: conversationId,
        })
        .subscribe(async (update) => {
          switch (update.transition) {
            case "appear":
              if (update.result?._id) {
                const message = await getMessageByMsgId(update.result._id);
                dispatch(addMessage({ message }));
              }
          }
        });

      // Return initial messages
    } catch (error) {
      throw new Error(
        isInstanceOfError(error) ||
          "error fetching message subscription message "
      );
    }
  }
);

export const createMessage = createAsyncThunk<
  boolean,
  { message: string; conversationId: string }
>(
  "messages/createMessage",
  async ({ message, conversationId }, { getState }) => {
    const senderId = (getState() as RootState).auth.data._id;
    try {
      // Create the message document
      await client.create({
        _type: "chat",
        message: message,
        conversation: { _type: "reference", _ref: conversationId },
        sender: { _type: "reference", _ref: senderId },
        sentStatus: true, // Assuming initial value for sentStatus
        receiveStatus: false, // Assuming initial value for receiveStatus
      });
      return true;
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "Error creating message");
    }
  }
);

export const deleteMessage = createAsyncThunk<
  { messageId: string },
  { messageId: string }
>(
  "messages/deleteMessage",
  async ({ messageId }, { getState, rejectWithValue }) => {
    try {
      const currentUserId = (getState() as RootState).auth.data._id;
      const message = (getState() as RootState).message.data.filter(
        (msg) => msg._id == messageId
      );
      if (currentUserId === message[0].sender._id) {
        // Construct your Sanity query to delete the message
        // const deleteQuery = `*[_type == 'chat' && _id == '${messageId}'][0]._id`;

        // Perform the delete operation using Sanity client
        const deletResp = await client.delete(messageId);
        if (deletResp) {
          return { messageId }; // You can return messageId or any other relevant data upon successful deletion
        }
      }
      throw rejectWithValue("not the user");
    } catch (error) {
      throw new Error(isInstanceOfError(error) || "Error deleting message");
    }
  }
);
