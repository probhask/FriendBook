import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { imgUrl } from "@utils/sanityClient";

type Props = {
  userProfileImage: string;
  size?: number;
  isLoggedIn?: boolean;
  /** Empty string renders a plain element (avoids nested <a> when already inside a link). */
  navigateTo: string;
};

const ProfileImage = React.memo(
  ({ userProfileImage, size = 20, isLoggedIn, navigateTo }: Props) => {
    const inner = userProfileImage ? (
      <img
        src={imgUrl(userProfileImage, Math.max(size * 2, 96)) || userProfileImage}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="min-w-full min-h-full object-cover object-top"
      />
    ) : (
      <IoPersonCircle className="text-gray-400 w-full h-full" />
    );

    const className =
      "relative rounded-full overflow-hidden flex items-center justify-center shrink-0";

    return (
      <div className="flex justify-center items-center p-[2px] rounded-full relative">
        {isLoggedIn && (
          <span
            className="size-2 rounded-full bg-green-500 absolute z-10 right-1 top-1"
            aria-label="online"
            role="img"
          />
        )}
        {navigateTo ? (
          <Link
            to={navigateTo}
            className={`${className} cursor-pointer`}
            style={{ width: size, height: size }}
          >
            {inner}
          </Link>
        ) : (
          <span className={className} style={{ width: size, height: size }}>
            {inner}
          </span>
        )}
      </div>
    );
  }
);

ProfileImage.displayName = "ProfileImage";

export default ProfileImage;
