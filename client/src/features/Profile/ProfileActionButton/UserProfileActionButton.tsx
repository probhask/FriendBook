import { Button } from "@components/index";
import { checkIfNotCreateConversation } from "@redux/AsyncFunctions/conversationAsync";
import { createFriendRequest } from "@redux/AsyncFunctions/friendRequestAsync";
import { useAppDispatch } from "@redux/hooks/storeHook";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  isFriends: boolean;
  userId: string;
};

const UserProfileActionButton = React.memo(({ isFriends, userId }: Props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMsgClick = async () => {
    setLoading(true);
    if (userId) {
      const conversation = await dispatch(
        checkIfNotCreateConversation({ secondUserId: userId })
      )
        .unwrap()
        .finally(() => setLoading(false));
      // console.log("rep", conversation._id);
      navigate(`/chat/messenger/${conversation._id}`);
    }
  };

  return (
    <div className="mb-5 bg-white">
      <Button
        text={loading ? "..." : isFriends ? "Message" : "Add Friend"}
        className="w-[90%] h-fit py-1.5 sm:w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-500 hover:text-white text-sm font-semibold rounded-lg self-center"
        type="button"
        onclickAction={
          isFriends
            ? handleMsgClick
            : () => dispatch(createFriendRequest({ sentToId: userId }))
        }
      />
    </div>
  );
});

UserProfileActionButton.displayName = "UserProfileActionButton";

export default UserProfileActionButton;
