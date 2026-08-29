import React, { useEffect, useRef } from "react";
import type { Message } from "../../../types";
import MessageUI from "./MessageUI";
import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthId } from "@redux/slice/authSlice";

type Props = {
  messages: Message[];
};

// const message = [];
const MessageUIContainer = React.memo(({ messages }: Props) => {
  const authId = useAppSelector(getAuthId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="overflow-y-auto no-scrollbar flex flex-col px-2 sm:px-5 gap-y-10 pt-5 h-full sticky top-0">
      {messages &&
        messages.length > 0 &&
        messages?.map((message) => (
          <MessageUI
            key={message._id}
            message={message}
            own={message?.sender?._id === authId}
          />
        ))}
      {/* Empty div used as a reference to scroll to the last message */}
      <div ref={messagesEndRef} />
      {messages.length === 0 && (
        <div className="text-gray-500 font-bold text-2xl text-center mt-8">
          Start conversation
        </div>
      )}
    </div>
  );
});

MessageUIContainer.displayName = "MessageUIContainer";

export default MessageUIContainer;
