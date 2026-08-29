import React, { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";

import { useAppDispatch } from "@redux/hooks/storeHook";
import { likePost, unlikePost } from "@redux/AsyncFunctions/postAsync";
import { Like } from "types";

type Props = {
  toggleComment: (postId: string) => void;
  postId: string;
  LikedInfo: Like | null;
  isLikedByUser: boolean;
  likeCount: number;
  commentCount: number;
};

const fmt = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`;
  return String(n);
};

const LikesComments = React.memo(
  ({
    toggleComment,
    postId,
    LikedInfo,
    isLikedByUser,
    likeCount,
    commentCount,
  }: Props) => {
    const dispatch = useAppDispatch();
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleLike = async () => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        if (isLikedByUser && LikedInfo) {
          await dispatch(unlikePost({ likeId: LikedInfo._id, postId }));
        } else if (!isLikedByUser) {
          await dispatch(likePost({ postId }));
        }
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div className="flex items-stretch gap-x-2 py-2 px-3">
        <button
          type="button"
          aria-label={isLikedByUser ? "unlike post" : "like post"}
          aria-pressed={isLikedByUser}
          disabled={isProcessing}
          className={`flex flex-1 items-center justify-center gap-x-2 rounded-2xl bg-gray-100 py-1.5 text-lg transition-colors hover:bg-gray-200 ${
            isLikedByUser ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={toggleLike}
        >
          {isLikedByUser ? <AiFillLike /> : <AiOutlineLike />}
          <span className="text-sm font-semibold tabular-nums">
            {fmt(likeCount)}
          </span>
        </button>

        <button
          type="button"
          aria-label={`show ${commentCount} comments`}
          className="flex flex-1 items-center justify-center gap-x-2 rounded-2xl bg-gray-100 py-1.5 text-lg text-gray-500 transition-colors hover:bg-gray-200"
          onClick={() => toggleComment(postId)}
        >
          <GoComment />
          <span className="text-sm font-semibold tabular-nums">
            {fmt(commentCount)}
          </span>
        </button>
      </div>
    );
  }
);
LikesComments.displayName = "LikesComment";

export default LikesComments;
