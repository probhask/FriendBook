import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

type Props = {
  userProfileImage: string;
  size?: number;
  isLoggedIn?: boolean;
  navigateTo: string;
};

const ProfileImage = React.memo(
  ({ userProfileImage, size = 20, isLoggedIn, navigateTo }: Props) => {
    return (
      <div
        className={` flex justify-center items-center p-[2px] rounded-full relative`}
        style={{ padding: 2 }}
      >
        {isLoggedIn && (
          <div className="size-2 rounded-full bg-green-500 absolute z-10 right-1 top-1"></div>
        )}
        <Link
          to={navigateTo}
          className={`relative rounded-full overflow-hidden cursor-pointer flex items-center justify-center `}
          style={{ width: size, height: size }}
        >
          {userProfileImage ? (
            <img
              src={userProfileImage}
              alt="user-image"
              className="min-w-full min-h-full object-cover object-top"
            />
          ) : (
            <IoPersonCircle className=" text-gray-400 w-full h-full" />
          )}
        </Link>
      </div>
    );
  }
);

ProfileImage.displayName = "ProfileImage";

export default ProfileImage;
