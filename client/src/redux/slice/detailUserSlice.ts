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
  loading: boolean;
  error: string;
  updatingCoverImg: boolean;
  updatingProfileImg: boolean;
};

const initialState: DetailUserInitialState = {
  data: {
    profileImage: "",
    coverImage: "",
    email: "",
    city: "",
    _id: "",
    name: " ",
  },
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
      .addCase(getUserDeatail.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUserDeatail.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getUserDeatail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "error in getting user";
        console.log(action.error);
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

export default detailUserSlice.reducer;
