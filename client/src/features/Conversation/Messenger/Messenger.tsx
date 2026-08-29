import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getMessage,
  subscribeToMessages,
} from "@redux/AsyncFunctions/messageAsync";
import {
  MessageContainer,
  MessangerHeader,
  SendMessage,
} from "@features/index";
import { MessengerShimmer, ErrorState } from "@components/index";
import {
  selectMessageData,
  selectMessageError,
  selectMessageLoading,
  selectMessagePartner,
} from "@redux/slice/messageSlice";

const Messanger = React.memo(() => {
  const { conversationId } = useParams();
  const dispatch = useAppDispatch();
  const messageData = useAppSelector(selectMessageData);
  const messageLoading = useAppSelector(selectMessageLoading);
  const messageError = useAppSelector(selectMessageError);
  const messagePartner = useAppSelector(selectMessagePartner);

  const load = () => {
    if (!conversationId) return;
    return dispatch(getMessage({ conversationId }));
  };

  useEffect(() => {
    if (!conversationId) {
      window.history.back();
      return;
    }
    const promise = dispatch(getMessage({ conversationId }));
    const subscription = subscribeToMessages(conversationId, dispatch);
    return () => {
      promise.abort();
      subscription.unsubscribe();
    };
  }, [dispatch, conversationId]);

  if (messageLoading && messageData.length === 0) return <MessengerShimmer />;

  return (
    <div className="relative w-full overflow-x-hidden no-scrollbar flex flex-col h-below-nav bg-gray-50">
      <MessangerHeader conversationUser={messagePartner} />

      {messageError && messageData.length === 0 ? (
        <ErrorState message={messageError} onRetry={load} />
      ) : (
        <MessageContainer messages={messageData} partnerName={messagePartner?.name} />
      )}

      <SendMessage conversationId={conversationId} />
    </div>
  );
});

Messanger.displayName = "Messanger";

export default Messanger;
