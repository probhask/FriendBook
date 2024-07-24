import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Conversation } from "../../types";
import { RootState } from "../store";
import { getConversation } from "../AsyncFunctions/conversationAsync";

type ConversationInitialState = {
  data: Conversation[];
  loading: boolean;
  error: string;
};

const initialState: ConversationInitialState = {
  data: [],
  loading: false,
  error: "",
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getConversation.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in getting user";
        console.log(action.error);
      });
  },
});

const conversation = (state: RootState) => state.conversation;
export const getConversationData = createSelector(
  conversation,
  (state) => state.data
);
export const getConversationLoading = (state: RootState) =>
  state.conversation.loading;
export const getConversationError = (state: RootState) =>
  state.conversation.error;

export default conversationSlice.reducer;
