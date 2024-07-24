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
    if (conversationId && message.length > 0) {
      dispatch(createMessage({ conversationId, message })).finally(() =>
        setMessage("")
      );
    }
  };

  return (
    <div className=" overflow-hidden sticky top-full left-0 right-0  flex justify-center z-10 w-full py-0.5">
      <form
        className="flex items-center gap-x-1 bg-white px-2 py-1.5 overflow-hidden w-full"
        onSubmit={handleMessageSubmit}
      >
        <div className="w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            name="message"
            id=""
            placeholder="Message..."
            className="w-full outline-none bg-gray-200 text-sm px-3 py-2 font-semibold text-gray-800 rounded-lg"
          />
        </div>
        <button type="submit" className="ml-2 text-blue-600" disabled={sending}>
          {sending ? (
            <FaArrowRotateRight className="animate-spin text-2xl" />
          ) : (
            <IoSend className="cursor-pointer text-2xl" />
          )}
        </button>
      </form>
    </div>
  );
});

SendMessage.displayName = "SendMessage";
export default SendMessage;
