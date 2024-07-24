import React from "react";
import { Outlet } from "react-router-dom";

const Conversation = React.memo(() => {
  return (
    <div
      className={`  w-full bg-white rounded-2xl overflow-hidden no-scrollbar min-h-full h-full`}
    >
      <Outlet />
    </div>
  );
});

Conversation.displayName = "Conversation";

export default Conversation;
