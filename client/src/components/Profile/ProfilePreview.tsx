import { Link } from "react-router-dom";
import { User } from "../../types";
import ProfileImage from "../UI/ProfileImage";
import { HTMLProps, memo } from "react";

type Props = {
  user: User;
  navigateTo: string;
  isLoggedIn?: boolean;
  imageSize?: number;
  padding?: boolean;
  className?: HTMLProps<HTMLElement>["className"];
  onclick?: () => void;
};
const ProfilePreview = memo(
  ({
    user,
    navigateTo,
    isLoggedIn,
    imageSize = 9,
    padding,
    className,
    onclick,
  }: Props) => {
    return (
      <div
        className={`${className} w-full flex items-center gap-x-3 ${
          padding && "py-2 px-1"
        }`}
        onClick={onclick}
      >
        <ProfileImage
          size={imageSize}
          userProfileImage={user?.profileImage}
          navigateTo={navigateTo}
          isLoggedIn={isLoggedIn}
        />
        <Link
          to={navigateTo}
          className="text-base font-semibold cursor-pointer"
        >
          {user?.name}
        </Link>
      </div>
    );
  }
);

export default ProfilePreview;
