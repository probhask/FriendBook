import React from "react";
import { Message } from "../../../types";
import { AiFillDelete, AiOutlineLoading } from "react-icons/ai";
import { deleteMessage } from "@redux/AsyncFunctions/messageAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { selectDeletingMessageLoading } from "@redux/slice/messageSlice";

type Props = {
  message: Message;
  own: boolean;
};

const MessageUI = React.memo(({ message, own }: Props) => {
  const deleting = useAppSelector(selectDeletingMessageLoading);
  const dispatch = useAppDispatch();
  return (
    <div
      className={`flex justify-between w-fit max-w-[70%]  px-2 py-1 rounded-2xl text-base font-semibold ${
        own
          ? "self-end bg-gray-100 rounded-tr-none"
          : "self-start bg-blue-500 rounded-tl-none "
      }`}
    >
      {message?.message}
      {own && (
        <span
          className=" text-2xl text-red-600 cursor-pointer"
          onClick={() => dispatch(deleteMessage({ messageId: message?._id }))}
        >
          {deleting === message?._id ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            <AiFillDelete />
          )}
        </span>
      )}
    </div>
  );
});

MessageUI.displayName = "MessageUI";

export default MessageUI;
