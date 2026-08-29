import { createAsyncThunk } from "@reduxjs/toolkit";
import getMessageByMsgId from "@api/getMesssageByMsgId";
import { addMessage } from "@redux/slice/messageSlice";
import isInstanceOfError from "@utils/isInstanceOfError";
import { Message, User } from "types";
import { RootState, AppDispatch } from "@redux/store";
import { client } from "@utils/sanityClient";
import { callApi } from "@utils/api";

const USER_SUB = `{_id,name,'profileImage':profileImage.asset->url,isLoggedIn}`;
const MESSAGE_PROJ = `{_id,message,'conversationId':conversation->_id,sender->{_id,name,'profileImage':profileImage.asset->url},sentStatus,receiveStatus,_createdAt}`;

export const getMessage = createAsyncThunk<
  { messages: Message[]; partner: User },
  { conversationId: string }
>("message/getMessage", async ({ conversationId }, { getState }) => {
  const currentUserId = (getState() as RootState).auth.data?._id;

  try {
    const msgQuery = `*[_type=='chat' && conversation._ref==$conversationId]|order(_createdAt asc)${MESSAGE_PROJ}`;
    const partnerQuery = `*[_type=='conversation' && _id==$conversationId][0]{'partner':coalesce(
      select(userA._ref != $currentUserId => userA->${USER_SUB}),
      select(userB._ref != $currentUserId => userB->${USER_SUB})
    )}`;
    const params = { conversationId, currentUserId };

    const [messages, partnerResult] = await Promise.all([
      client.fetch<Message[]>(msgQuery, params),
      client.fetch<{ partner: User }>(partnerQuery, params),
    ]);

    return { messages, partner: partnerResult?.partner };
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error getting messages"));
  }
});

/**
 * Open a realtime subscription for new messages in a conversation.
 * Returns the subscription — the caller MUST `.unsubscribe()` on cleanup.
 */
export function subscribeToMessages(
  conversationId: string,
  dispatch: AppDispatch
) {
  const query = `*[_type=='chat' && conversation._ref==$conversationId]`;
  return client
    .listen(query, { conversationId }, { visibility: "query" })
    .subscribe(async (update) => {
      if (
        update.type === "mutation" &&
        update.transition === "appear" &&
        update.result?._id
      ) {
        try {
          const message = await getMessageByMsgId(update.result._id as string);
          if (message) dispatch(addMessage({ message }));
        } catch {
          /* ignore transient hydration errors */
        }
      }
    });
}

export const createMessage = createAsyncThunk<
  Message,
  { message: string; conversationId: string }
>("messages/createMessage", async ({ message, conversationId }) => {
  try {
    return await callApi<Message>("createMessage", { conversationId, message });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error sending message"));
  }
});

export const deleteMessage = createAsyncThunk<
  { messageId: string },
  { messageId: string }
>("messages/deleteMessage", async ({ messageId }) => {
  try {
    await callApi("deleteMessage", { messageId });
    return { messageId };
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error deleting message"));
  }
});
