import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { fetchMessages, getMessage } from "@redux/AsyncFunctions/messageAsync";

import {
  MessageContainer,
  MessangerHeader,
  SendMessage,
} from "@features/index";
import { MessengerShimmer } from "@components/index";
import {
  selectMessageData,
  selectMessageLoading,
  selectMessagePartner,
} from "@redux/slice/messageSlice";

const Messanger = React.memo(() => {
  const { conversationId } = useParams();
  const dispatch = useAppDispatch();
  const messageData = useAppSelector(selectMessageData);
  const messageLoading = useAppSelector(selectMessageLoading);
  const messagePartner = useAppSelector(selectMessagePartner);
  // console.log("conversationId", conversationId, messagePartner);

  useEffect(() => {
    if (conversationId) {
      dispatch(getMessage({ conversationId }));
      dispatch(fetchMessages({ conversationId }));
    } else {
      window.history.back();
    }
  }, [conversationId]);

  return messageLoading ? (
    <MessengerShimmer />
  ) : (
    <div className="relative min-h-full h-full w-full overflow-x-hidden no-scrollbar flex flex-col">
      <MessangerHeader conversationUser={messagePartner} />

      <MessageContainer messages={messageData} />

      <SendMessage conversationId={conversationId} />
    </div>
  );
});

Messanger.displayName = "Messanger";

export default Messanger;
