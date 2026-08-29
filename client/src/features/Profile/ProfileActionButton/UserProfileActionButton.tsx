import { Button } from "@components/index";
import { checkIfNotCreateConversation } from "@redux/AsyncFunctions/conversationAsync";
import {
  createFriendRequest,
  cancelSendedRequest,
  getRecieveFriendRequestList,
  getSendFriendRequestList,
} from "@redux/AsyncFunctions/friendRequestAsync";
import { acceptRequest } from "@redux/AsyncFunctions/friendAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getRecieveFriendRequestData,
  getSendFriendRequestData,
} from "@redux/slice/friendRequestSlice";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
  isFriends: boolean;
  userId: string;
};

const UserProfileActionButton = React.memo(({ isFriends, userId }: Props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const sent = useAppSelector(getSendFriendRequestData);
  const received = useAppSelector(getRecieveFriendRequestData);

  useEffect(() => {
    dispatch(getSendFriendRequestList());
    dispatch(getRecieveFriendRequestList());
  }, [dispatch]);

  const sentRequest = sent.find((r) => r.sentTo?._id === userId);
  const receivedRequest = received.find((r) => r.sentFrom?._id === userId);

  const run = async (p: Promise<unknown>) => {
    setLoading(true);
    try {
      await p;
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleMsgClick = () =>
    run(
      dispatch(checkIfNotCreateConversation({ secondUserId: userId }))
        .unwrap()
        .then((c) => c?._id && navigate(`/chat/messenger/${c._id}`))
    );

  let text: string;
  let action: () => void;

  if (isFriends) {
    text = "Message";
    action = handleMsgClick;
  } else if (receivedRequest) {
    text = "Accept Request";
    action = () =>
      run(
        dispatch(acceptRequest({ recieveRequest: receivedRequest })).unwrap()
      );
  } else if (sentRequest) {
    text = "Cancel Request";
    action = () =>
      run(
        dispatch(
          cancelSendedRequest({ sendRequest: sentRequest })
        ).unwrap()
      );
  } else {
    text = "Add Friend";
    action = () =>
      run(dispatch(createFriendRequest({ sentToId: userId })).unwrap());
  }

  return (
    <div className="mb-5 bg-white flex justify-center">
      <Button
        text={loading ? "..." : text}
        className="w-[90%] h-fit py-1.5 sm:w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-500 hover:text-white text-sm font-semibold rounded-lg"
        type="button"
        disable={loading}
        onclickAction={action}
      />
    </div>
  );
});

UserProfileActionButton.displayName = "UserProfileActionButton";

export default UserProfileActionButton;
