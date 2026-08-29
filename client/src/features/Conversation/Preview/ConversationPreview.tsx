import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import {
  EmptyState,
  ErrorState,
  ProfileImage,
  RowsSkeleton,
} from "@components/index";
import Seo from "@components/Seo/Seo";
import { getConversation } from "@redux/AsyncFunctions/conversationAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getConversationData,
  getConversationError,
  getConversationLoading,
} from "@redux/slice/conversationSlice";
import { timeAgo } from "@utils/timeAgo";

const ConversationPreview = React.memo(() => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(getConversationData);
  const loading = useAppSelector(getConversationLoading);
  const error = useAppSelector(getConversationError);

  useEffect(() => {
    const promise = dispatch(getConversation());
    return () => promise.abort();
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full px-2 py-3">
      <Seo title="Messenger" noIndex />
      <h1 className="mb-3 text-center text-lg font-bold uppercase tracking-wide text-gray-700">
        Messenger
      </h1>

      {loading && conversations.length === 0 && <RowsSkeleton rows={6} />}

      {!loading && error && conversations.length === 0 && (
        <ErrorState
          message={error}
          onRetry={() => dispatch(getConversation())}
        />
      )}

      {!loading && !error && conversations.length === 0 && (
        <EmptyState
          icon={<FiMessageCircle />}
          title="No conversations yet"
          description="Message a friend from their profile or the Friends page to start chatting."
        />
      )}

      <ul className="flex flex-col">
        {conversations.map((c) => (
          <li key={c._id}>
            <Link
              to={`/chat/messenger/${c._id}`}
              className="flex items-center gap-x-3 rounded-lg px-2 py-2.5 hover:bg-gray-100"
            >
              <ProfileImage
                size={48}
                navigateTo=""
                userProfileImage={c.partner?.profileImage}
                isLoggedIn={c.partner?.isLoggedIn}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-x-2">
                  <p className="truncate font-semibold text-gray-800">
                    {c.partner?.name}
                  </p>
                  {c.lastMessage?._createdAt && (
                    <span className="shrink-0 text-[11px] text-gray-400">
                      {timeAgo(c.lastMessage._createdAt)}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-gray-500">
                  {c.lastMessage
                    ? `${c.lastMessage.fromMe ? "You: " : ""}${c.lastMessage.message}`
                    : "No messages yet"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

ConversationPreview.displayName = "ConversationPreview";

export default ConversationPreview;
