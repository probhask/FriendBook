import { AiOutlineArrowLeft } from "react-icons/ai";
import { ProfileImage } from "../../../components";
import { User } from "../../../types";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

type Props = {
  conversationUser: User;
};

const MessangerHeader = React.memo(({ conversationUser }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 flex items-center gap-x-3 bg-white/95 backdrop-blur px-3 py-2 border-b border-gray-200">
      <button
        type="button"
        aria-label="Back to conversations"
        className="text-xl text-gray-600 hover:text-gray-900"
        onClick={() => navigate("/chat")}
      >
        <AiOutlineArrowLeft />
      </button>
      <ProfileImage
        userProfileImage={conversationUser?.profileImage}
        isLoggedIn={conversationUser?.isLoggedIn}
        navigateTo={`/profile/${conversationUser?._id}`}
        size={38}
      />
      <Link to={`/profile/${conversationUser?._id}`} className="min-w-0">
        <p className="truncate font-semibold text-gray-800">
          {conversationUser?.name || "…"}
        </p>
        <p className="text-xs text-gray-400">
          {conversationUser?.isLoggedIn ? "Active now" : "Offline"}
        </p>
      </Link>
    </div>
  );
});
MessangerHeader.displayName = "MessangerHeader";

export default MessangerHeader;
