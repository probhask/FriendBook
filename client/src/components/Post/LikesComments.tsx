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
};

const LikesComments = React.memo(
  ({ toggleComment, postId, LikedInfo, isLikedByUser }: Props) => {
    const dispatch = useAppDispatch();
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleLike = async () => {
      if (isProcessing) return;
      setIsProcessing(true);
      if (LikedInfo) {
        if (isLikedByUser) {
          await dispatch(unlikePost({ likeId: LikedInfo?._id, postId }));
        }
      } else {
        await dispatch(likePost({ postId }));
      }
      setIsProcessing(false);
    };

    return (
      <div className="flex justify-evenly items-center text-base text-gray-400 gap-x-3  py-2 px-3 flex-nowrap">
        <div
          className="flex gap-x-1 justify-center cursor-pointer hover:shadow-sm bg-gray-100  py-1 px-5 sm:px-16 md:px-24 rounded-2xl text-2xl"
          onClick={toggleLike}
        >
          {isLikedByUser ? (
            <AiFillLike className="text-blue-400" />
          ) : (
            <AiOutlineLike />
          )}
        </div>

        <div
          className="flex gap-x-1 justify-center cursor-pointer hover:shadow-sm bg-gray-100  py-1 px-5 sm:px-16 md:px-24 rounded-2xl text-2xl"
          onClick={() => toggleComment(postId)}
        >
          <GoComment />
        </div>
      </div>
    );
  }
);
LikesComments.displayName = "LikesComment";

export default LikesComments;
