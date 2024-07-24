import { AiOutlineArrowLeft } from "react-icons/ai";
import { ProfileImage } from "../../../components";
import { User } from "../../../types";
import { useNavigate } from "react-router-dom";
import React from "react";

type Props = {
  conversationUser: User;
};

const MessangerHeader = React.memo(({ conversationUser }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="sticky  top-0 bg-blue-700 py-2.5 px-1.5 text-white flex justify-between items-center">
      <div className="flex gap-x-3 items-center">
        <AiOutlineArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/chat")}
        />
        <div
          className=" flex justify-center items-center"
          style={{ width: 35 + 2 }}
        >
          <ProfileImage
            userProfileImage={conversationUser?.profileImage}
            isLoggedIn={true}
            navigateTo={`/profile/${conversationUser?._id}`}
            size={35}
          />
        </div>
        <div className="font-semibold">{conversationUser?.name}</div>
      </div>

      {}
    </div>
  );
});
MessangerHeader.displayName = "MessangerHeader";

export default MessangerHeader;
