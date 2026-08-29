import React, { useEffect, useRef } from "react";
import type { Message } from "../../../types";
import MessageUI from "./MessageUI";
import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthId } from "@redux/slice/authSlice";

type Props = {
  messages: Message[];
  partnerName?: string;
};

const MessageUIContainer = React.memo(({ messages, partnerName }: Props) => {
  const authId = useAppSelector(getAuthId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-2 sm:px-5 gap-y-2 py-4">
      {messages.length === 0 ? (
        <div className="m-auto flex flex-col items-center gap-y-1 text-center text-gray-400">
          <p className="text-lg font-semibold text-gray-500">
            Say hi to {partnerName || "your friend"} 👋
          </p>
          <p className="text-sm">This is the start of your conversation.</p>
        </div>
      ) : (
        messages.map((message, i) => {
          const prev = messages[i - 1];
          const sameSender = prev?.sender?._id === message?.sender?._id;
          return (
            <MessageUI
              key={message._id}
              message={message}
              own={message?.sender?._id === authId}
              grouped={sameSender}
            />
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageUIContainer.displayName = "MessageUIContainer";

export default MessageUIContainer;
