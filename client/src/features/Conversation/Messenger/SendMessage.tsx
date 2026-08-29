import { createMessage } from "@redux/AsyncFunctions/messageAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { selectSendingMessageLoading } from "@redux/slice/messageSlice";
import React, { FormEvent, useState } from "react";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

type Props = {
  conversationId: string | undefined;
};

const SendMessage = React.memo(({ conversationId }: Props) => {
  const [message, setMessage] = useState("");
  const sending = useAppSelector(selectSendingMessageLoading);
  const dispatch = useAppDispatch();

  const handleMessageSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = message.trim();
    if (!conversationId || !text || sending) return;
    setMessage("");
    dispatch(createMessage({ conversationId, message: text }));
  };

  return (
    <form
      className="sticky bottom-0 z-10 flex items-center gap-x-2 border-t border-gray-200 bg-white px-3 py-2"
      onSubmit={handleMessageSubmit}
    >
      <label htmlFor="chat-message" className="sr-only">
        Message
      </label>
      <input
        id="chat-message"
        type="text"
        autoComplete="off"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message…"
        className="w-full rounded-full bg-gray-100 px-4 py-2 text-[15px] text-gray-800 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={sending || !message.trim()}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-40"
      >
        {sending ? (
          <FaArrowRotateRight className="animate-spin text-lg" />
        ) : (
          <IoSend className="text-lg" />
        )}
      </button>
    </form>
  );
});

SendMessage.displayName = "SendMessage";
export default SendMessage;
