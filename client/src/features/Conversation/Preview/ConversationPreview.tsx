import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileInfoShimmer, ProfilePreview } from "@components/index";
import { getConversation } from "@redux/AsyncFunctions/conversationAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getConversationData,
  getConversationLoading,
} from "@redux/slice/conversationSlice";

const ConversationPreview = React.memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const conversationData = useAppSelector(getConversationData);
  const conversationLoading = useAppSelector(getConversationLoading);
  useEffect(() => {
    const promise = dispatch(getConversation());
    return () => promise.abort();
  }, []);
  console.log(conversationData);

  return (
    <div className="flex flex-col w-full gap-y-5 px-2 py-3">
      <h1 className="text-center font-bold mb-3">your conversation</h1>
      {/* search bar */}
      {/* profile courselS */}
      {/* conversation preview */}
      {conversationData.map((conversation, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer hover:bg-gray-100 rounded-lg flex justify-between items-center"
            onClick={() => navigate(`/chat/messenger/${conversation._id}`)}
          >
            <ProfilePreview
              user={conversation.partner}
              imageSize={40}
              navigateTo={""}
              isLoggedIn={conversation.partner.isLoggedIn}
              padding={true}
            />
            {conversation.partner.isLoggedIn && (
              <div>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
            )}
          </div>
        );
      })}
      {conversationLoading &&
        [1, 2, 3, 4].map((list) => {
          return <ProfileInfoShimmer key={list} />;
        })}
    </div>
  );
});

ConversationPreview.displayName = "ConversationPreview";

export default ConversationPreview;
