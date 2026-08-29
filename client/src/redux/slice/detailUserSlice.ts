import {
  getUserDeatail,
  updateCoverImage,
  updatePersonalInfo,
  updateProfileImage,
} from "@redux/AsyncFunctions/userDetailAsyc";
import { RootState } from "@redux/store";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { DetailUser } from "types";

import toast from "react-hot-toast";

type DetailUserInitialState = {
  data: DetailUser;
  /** the profile id the current data/loading state belongs to */
  requestedId: string;
  loading: boolean;
  error: string;
  updatingCoverImg: boolean;
  updatingProfileImg: boolean;
};

const blankUser: DetailUser = {
  profileImage: "",
  coverImage: "",
  email: "",
  city: "",
  _id: "",
  name: " ",
};

const initialState: DetailUserInitialState = {
  data: blankUser,
  requestedId: "",
  loading: false,
  error: "",
  updatingCoverImg: false,
  updatingProfileImg: false,
};

const detailUserSlice = createSlice({
  name: "detailUser",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserDeatail.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        if (state.requestedId !== action.meta.arg.userId) {
          state.data = blankUser;
        }
        state.requestedId = action.meta.arg.userId;
      })
      .addCase(getUserDeatail.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          state.data = action.payload;
          state.error = "";
        } else {
          state.data = blankUser;
          state.error = "This profile doesn't exist.";
        }
      })
      .addCase(getUserDeatail.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.error.message || "Couldn't load this profile";
      });

    builder
      .addCase(updateProfileImage.pending, (state) => {
        state.updatingProfileImg = true;
        state.error = "";
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.data.profileImage = action.payload;
        state.updatingProfileImg = false;
        state.error = "";
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.updatingProfileImg = false;
        state.error = action.error.message || "error uploading";
        toast.error(state.error);
      });
    builder
      .addCase(updateCoverImage.pending, (state) => {
        state.updatingCoverImg = true;
        state.error = "";
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.data.coverImage = action.payload;
        state.updatingCoverImg = false;
        state.error = "";
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.updatingCoverImg = false;
        state.error = action.error.message || "error uploading";
        toast.error(state.error);
      });
    builder
      .addCase(updatePersonalInfo.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.data.name = action.payload.name;
        state.data.city = action.payload.city;
        state.data.email = action.payload.email;
        state.loading = false;
        state.error = "";
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message || "error uploading";
        toast.error(state.error);
      });
  },
});

const detailUser = (state: RootState) => state.detailUser;
export const getDetailUserData = createSelector(
  detailUser,
  (state) => state.data
);
export const getDetailUserLoading = (state: RootState) =>
  state.detailUser.loading;
export const getDetailUserCoverImgLoading = (state: RootState) =>
  state.detailUser.updatingCoverImg;
export const getDetailUserProfileImgLoading = (state: RootState) =>
  state.detailUser.updatingProfileImg;
export const getDetailUserError = (state: RootState) => state.detailUser.error;
export const getDetailUserRequestedId = (state: RootState) =>
  state.detailUser.requestedId;

export default detailUserSlice.reducer;
