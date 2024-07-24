import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecieveFriendRequest, SendFriendRequest } from "../../types";
import {
  cancelSendedRequest,
  createFriendRequest,
  getRecieveFriendRequestList,
  getSendFriendRequestList,
  rejectRecieveFriendRequest,
} from "../AsyncFunctions/friendRequestAsync";
import { RootState } from "../store";

type FriendRequestInitialState = {
  sendRequest: SendFriendRequest[];
  recieveRequest: RecieveFriendRequest[];
  sendloading: boolean;
  recieveLoading: boolean;
  createRequestLoading: string;
  cancelSendedRequestLoading: string;
  rejectRecieveRequestLoading: string;
  error: string;
};

const initialState: FriendRequestInitialState = {
  sendRequest: [],
  recieveRequest: [],
  sendloading: false,
  recieveLoading: false,
  createRequestLoading: "",
  cancelSendedRequestLoading: "",
  rejectRecieveRequestLoading: "",
  error: "",
};

const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState,
  reducers: {
    addSendedRequest: (
      state,
      action: PayloadAction<{ data: SendFriendRequest }>
    ) => {
      if (action.payload.data) {
        state.sendRequest.push(action.payload.data);
      }
    },
  },
  extraReducers(builder) {
    //   send request
    builder
      .addCase(getSendFriendRequestList.pending, (state) => {
        state.sendloading = true;
        state.error = "";
      })
      .addCase(getSendFriendRequestList.fulfilled, (state, action) => {
        state.sendRequest = action.payload;
        state.sendloading = false;
        state.error = "";
      })
      .addCase(getSendFriendRequestList.rejected, (state, action) => {
        state.sendloading = false;
        state.error = action.error.message || "error";
        console.log(action.error);
      });

    //   recieve request
    builder
      .addCase(getRecieveFriendRequestList.pending, (state) => {
        state.recieveLoading = true;
        state.error = "";
      })
      .addCase(getRecieveFriendRequestList.fulfilled, (state, action) => {
        state.recieveRequest = action.payload;
        state.recieveLoading = false;
        state.error = "";
      })
      .addCase(getRecieveFriendRequestList.rejected, (state, action) => {
        state.recieveLoading = false;
        state.error = action.error.message || "error";
        console.log(action.error);
      });

    // acceptReeuets
    builder
      .addCase(createFriendRequest.pending, (state, action) => {
        state.createRequestLoading = action.meta.arg.sentToId;
        state.error = "";
      })
      .addCase(createFriendRequest.fulfilled, (state, action) => {
        state.sendRequest.push(action.payload);
        state.createRequestLoading = "";
        state.error = "";
      })
      .addCase(createFriendRequest.rejected, (state, action) => {
        state.createRequestLoading = "";
        state.error = action.error.message || "error creating friend request";
        console.log(action.error);
      });
    // remove request
    builder
      .addCase(rejectRecieveFriendRequest.pending, (state, action) => {
        state.rejectRecieveRequestLoading = action.meta.arg.requestId;
        state.error = "";
      })
      .addCase(rejectRecieveFriendRequest.fulfilled, (state, action) => {
        state.recieveRequest = state.recieveRequest.filter(
          (request) => request._id !== action.payload
        );
        state.rejectRecieveRequestLoading = "";
        state.error = "";
      })
      .addCase(rejectRecieveFriendRequest.rejected, (state, action) => {
        state.rejectRecieveRequestLoading = "";
        state.error = action.error.message || "error creating friend request";
        console.log(action.error);
      });

    builder
      .addCase(cancelSendedRequest.pending, (state, action) => {
        console.log("action sned", action);

        state.cancelSendedRequestLoading = action.meta.arg.sendRequest._id;
        state.error = "";
      })
      .addCase(cancelSendedRequest.fulfilled, (state, action) => {
        state.sendRequest = state.sendRequest.filter(
          (request) => request._id !== action.payload
        );
        state.cancelSendedRequestLoading = "";
        state.error = "";
      })
      .addCase(cancelSendedRequest.rejected, (state, action) => {
        state.cancelSendedRequestLoading = "";
        state.error = action.error.message || "error creating friend request";
        console.log(action.error);
      });
  },
});

const friendRequest = (state: RootState) => state.friendRequest;
export const getSendFriendRequestData = createSelector(
  friendRequest,
  (state) => state.sendRequest
);
export const getRecieveFriendRequestData = createSelector(
  friendRequest,
  (state) => state.recieveRequest
);
export const getRecieveRequestLoading = (state: RootState) =>
  state.friendRequest.recieveLoading;
export const getSendRequestLoading = (state: RootState) =>
  state.friendRequest.sendloading;
export const getfriendRequestError = (state: RootState) =>
  state.friendRequest.error;

export const { addSendedRequest } = friendRequestSlice.actions;
export default friendRequestSlice.reducer;
