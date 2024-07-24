import {
  createMessage,
  deleteMessage,
  getMessage,
} from "@redux/AsyncFunctions/messageAsync";
import { RootState } from "@redux/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User } from "types";

type MessageInitialState = {
  data: Message[];
  partner: User;
  loading: boolean;
  error: string;

  pageNumber: number;
  hasMore: boolean;
  limit: number;

  sendingMessage: boolean;
  sendingMessageError: string;
  deletingMessage: string;
  deletingMessageError: string;
};

const initialState: MessageInitialState = {
  data: [],
  partner: { _id: "", isLoggedIn: false, name: "", profileImage: "" },

  loading: false,
  error: "",
  pageNumber: 1,
  hasMore: true,
  limit: 10,

  sendingMessage: false,
  sendingMessageError: "",
  deletingMessage: "",
  deletingMessageError: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ message: Message }>) => {
      state.data.push(action.payload.message);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getMessage.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.data = action.payload.messages;
        state.partner = action.payload.partner;
        state.loading = false;
        state.error = "";
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in fetchuing message";
        console.log(action.error);
      });

    builder
      .addCase(createMessage.pending, (state) => {
        state.sendingMessage = true;
        state.sendingMessageError = "";
      })
      .addCase(createMessage.fulfilled, (state) => {
        // state.data.push(action.payload);

        state.sendingMessage = false;
        state.sendingMessageError = "";
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.sendingMessageError =
          action.error.message || "error in fetchuing message";
        console.log(action.error);
      });

    builder
      .addCase(deleteMessage.pending, (state, action) => {
        state.deletingMessage = action.meta.arg.messageId;
        state.deletingMessageError = "";
      })
      // Handle successful deletion
      .addCase(deleteMessage.fulfilled, (state, action) => {
        // Filter out the deleted message from state
        state.data = state.data.filter(
          (msg) => msg._id !== action.payload.messageId
        );
        state.deletingMessage = "";
        state.deletingMessageError = "";
      })
      // Handle deletion failure
      .addCase(deleteMessage.rejected, (state, action) => {
        state.deletingMessage = "";
        state.deletingMessageError =
          action.error.message || "Failed to delete message";
      });
  },
});

const message = (state: RootState) => state.message;
export const selectMessageData = createSelector(message, (state) => state.data);

export const selectMessagePartner = (state: RootState) => state.message.partner;

export const selectMessageLoading = (state: RootState) => state.message.loading;
export const selectMessageError = (state: RootState) => state.message.error;

export const selectSendingMessageLoading = (state: RootState) =>
  state.message.sendingMessage;
export const selectSendingMessageError = (state: RootState) =>
  state.message.sendingMessageError;

export const selectDeletingMessageLoading = (state: RootState) =>
  state.message.deletingMessage;
export const selectDeletingMessageError = (state: RootState) =>
  state.message.deletingMessageError;

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
