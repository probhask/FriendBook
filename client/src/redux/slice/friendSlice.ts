import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Friend } from "../../types";
import {
  acceptRequest,
  getFriendsList,
  unFriend,
} from "../AsyncFunctions/friendAsync";
import { RootState } from "../store";

type FriendInitialState = {
  data: Friend[];
  loading: boolean;
  acceptRequestLoading: string;
  unFriendLoading: string;
  error: string;
};

const initialState: FriendInitialState = {
  data: [],
  loading: false,
  acceptRequestLoading: "",
  unFriendLoading: "",
  error: "",
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFriendsList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getFriendsList.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getFriendsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in getting friends List";
        console.log(action.error);
      });

    builder
      .addCase(acceptRequest.pending, (state, action) => {
        state.acceptRequestLoading = action.meta.arg.recieveRequest._id;
        state.error = "";
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.acceptRequestLoading = "";
        state.error = "";
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.acceptRequestLoading = "";
        state.error = action.error.message || "error in accepting request";
        console.log(action.error);
      });

    builder
      .addCase(unFriend.pending, (state, action) => {
        state.unFriendLoading = action.meta.arg.friendShipId;
        state.error = "";
      })
      .addCase(unFriend.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
        state.unFriendLoading = "";
        state.error = "";
      })
      .addCase(unFriend.rejected, (state, action) => {
        state.unFriendLoading = "";
        state.error = action.error.message || "error in unfriending";
        console.log(action.error);
      });
  },
});

const friend = (state: RootState) => state.friend;
export const selectFriendData = createSelector(friend, (state) => state.data);
export const selectFriendLoading = (state: RootState) => state.friend.loading;
export const selectFriendError = (state: RootState) => state.friend.error;

export const selectUnfriendLoading = (state: RootState) =>
  state.friend.unFriendLoading;

export default friendSlice.reducer;
