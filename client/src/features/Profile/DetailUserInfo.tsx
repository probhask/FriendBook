import {
  getUserDeatail,
  updateCoverImage,
  updateProfileImage,
} from "@redux/AsyncFunctions/userDetailAsyc";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import {
  getDetailUserData,
  getDetailUserLoading,
} from "@redux/slice/detailUserSlice";
import React, { useEffect, useRef } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { FaCamera } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";

type Props = {
  userId: string;
  fetchIsFriends: () => void;
};

const DetailUserInfo = React.memo(({ userId, fetchIsFriends }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileCoverInputRef = useRef<HTMLInputElement>(null);
  const detailUserData = useAppSelector(getDetailUserData);
  const detailUserLoading = useAppSelector(getDetailUserLoading);
  const coverImgLoading = useAppSelector(getDetailUserLoading);
  const profileImgLoading = useAppSelector(getDetailUserLoading);
  const authId = useAppSelector(getAuthData)._id;
  const dispatch = useAppDispatch();

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        dispatch(updateProfileImage({ profileImage: file }));
      }
      // console.log("Selected file:", file);
    }
  };
  const handleCoverCameraClick = () => {
    fileCoverInputRef.current?.click();
  };

  const handleCoverFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        dispatch(updateCoverImage({ coverImage: file }));
      }
      // console.log("Selected file:", file);
    }
  };
  const fetchData = async () => {
    await dispatch(getUserDeatail({ userId }));
    // await dispatch(getPosts({ userId, own: true }));

    // if (mainContainerRef.current) {
    //   mainContainerRef.current.scrollIntoView();
    // }
  };

  useEffect(() => {
    if (!detailUserLoading) {
      fetchData();
      if (userId !== authId) {
        fetchIsFriends();
      }
    }
  }, [userId]);
  useEffect(() => {
    console.log(coverImgLoading);
  }, [coverImgLoading]);
  return (
    <>
      <div className="relative mb-3 sm:mb-10">
        <div className=" w-full h-[13rem] sm:h-[18rem] overflow-hidden border-2 md:rounded-2xl bg-gray-200 flex justify-center items-center">
          {coverImgLoading ? (
            <p className=",min-w-full min-h-full bg-gray-600 animate-pulse"></p>
          ) : !coverImgLoading && detailUserData.coverImage ? (
            <img
              src={detailUserData?.coverImage}
              alt="cover-image"
              className="w-full h-full max-h-full max-w-full object-cover object-top"
            />
          ) : (
            ""
          )}
          <div
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer"
            onClick={handleCoverCameraClick}
          >
            <FaCamera className="text-gray-700" />
            <input
              type="file"
              ref={fileCoverInputRef}
              className="hidden"
              onChange={handleCoverFileChange}
            />
          </div>
        </div>
        <div className="absolute top-[68%] sm:top-[75%] left-[50%] transform translate-x-[-50%] h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.3)] flex justify-center items-center bg-gray-300 border-2">
          {profileImgLoading ? (
            <p className=",min-w-full min-h-full bg-gray-600 animate-pulse"></p>
          ) : !coverImgLoading && detailUserData.profileImage ? (
            <img
              src={detailUserData?.profileImage}
              alt="cover-image"
              className="w-full h-full max-h-full max-w-full object-cover object-top"
            />
          ) : (
            ""
          )}
          <div
            className="absolute bottom-2 right-2 sm:right-6 bg-white p-1 rounded-full shadow-md cursor-pointer"
            onClick={handleCameraClick}
          >
            <FaCamera className="text-gray-700" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className=" pl-5 py-1 md:pl-11 mt-12 md:mt-24 text-base font-semibold text-gray-700  rounded-xl flex flex-col gap-y-1 min-h-[60px] mb-3 bg-gray-100  shadow-sm">
        <p className="flex items-center gap-x-3">
          <span>
            <IoMdPerson />
          </span>
          {detailUserData?.name}
        </p>
        <p className="flex items-center gap-x-3">
          {" "}
          <span>
            <TfiEmail />
          </span>{" "}
          {detailUserData?.email}
        </p>
        {detailUserData?.city && (
          <p className="flex items-center gap-x-3">
            <AiOutlineHome />
            {detailUserData?.city}
          </p>
        )}
      </div>
    </>
  );
});

DetailUserInfo.displayName = "DetailUserInfo";
export default DetailUserInfo;
