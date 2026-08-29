import React from "react";
import { Message } from "../../../types";
import { timeAgo } from "@utils/timeAgo";

type Props = {
  message: Message;
  own: boolean;
  grouped?: boolean;
};

const MessageUI = React.memo(({ message, own, grouped }: Props) => {
  return (
    <div
      className={`flex flex-col ${own ? "items-end" : "items-start"} ${
        grouped ? "mt-0.5" : "mt-2"
      }`}
    >
      <div
        className={`w-fit max-w-[78%] px-3 py-1.5 text-[15px] leading-snug break-words ${
          own
            ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
            : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md"
        }`}
      >
        {message?.message}
      </div>
      {!grouped && message?._createdAt && (
        <span className="mt-0.5 px-1 text-[10px] text-gray-400">
          {timeAgo(message._createdAt)}
        </span>
      )}
    </div>
  );
});

MessageUI.displayName = "MessageUI";

export default MessageUI;
