import React, { useEffect, useRef } from "react";
import type { Message } from "../../../types";
import MessageUI from "./MessageUI";
import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";

type Props = {
  messages: Message[];
};

// const message = [];
const MessageUIContainer = React.memo(({ messages }: Props) => {
  const authId = useAppSelector(getAuthData)._id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="overflow-y-auto no-scrollbar flex flex-col px-2 sm:px-5 gap-y-10 pt-5 pb-16 h-full">
      {messages &&
        messages.length > 0 &&
        messages?.map((message, index) => (
          <MessageUI
            key={index}
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
