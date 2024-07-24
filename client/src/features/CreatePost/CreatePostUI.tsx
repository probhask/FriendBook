import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, ProfileImage } from "@components/index";
import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";

const CreatePostUI = React.memo(() => {
  const navigate = useNavigate();
  const auth = useAppSelector(getAuthData);
  return (
    <div className="w-full bg-white px-2 py-4 flex flex-col gap-y-4 sm:flex-row items-center rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-x-2 w-full">
        <ProfileImage
          userProfileImage={auth.profileImage}
          size={40}
          navigateTo=""
        />
        <p className="font-semibold text-gray-600">What's on your mind?</p>
      </div>
      <Button
        text="Create"
        type="button"
        className="px-2 py-1 text-base font-semibold rounded-lg shadow-sm text-blue-600 border-2 border-blue-600 hover:text-white hover:bg-blue-600 h-fit sm:max-w-fit"
        onclickAction={() => navigate("/create-post")}
      />
    </div>
  );
});

CreatePostUI.displayName = "CreatePostUI";

export default CreatePostUI;
