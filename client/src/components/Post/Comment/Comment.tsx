import { CommentShimmer, CreateComment } from "@components/index";
import { deleteComment, getComment } from "@redux/AsyncFunctions/commentAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import { getCommentData, getCommentLoading } from "@redux/slice/commentSlice";
import { timeAgo } from "@utils/timeAgo";
import React, { useEffect } from "react";
import { AiFillDelete, AiOutlineLoading } from "react-icons/ai";
import { Link } from "react-router-dom";

const Comment = React.memo(({ postId }: { postId: string }) => {
  // const { commentData, commentLoading } = useCommentSlice();
  const commentData = useAppSelector(getCommentData);
  const commentLoading = useAppSelector(getCommentLoading);
  const authId = useAppSelector(getAuthData)._id;

  const deleteLoading = useAppSelector(
    (state) => state.comment.deletingCommentLoading
  );

  const dispatch = useAppDispatch();

  const handleDelComment = (index: number) => {
    console.log(authId, commentData[index].postedBy._id);

    if (authId === commentData[index].postedBy._id)
      dispatch(deleteComment({ commentId: commentData[index]._id }));
  };

  useEffect(() => {
    if (commentData.length === 0) {
      dispatch(getComment({ postId }));
    }
    // return () => {
    //     dispatchRef.current?.abort();
    // };
  }, [postId]);

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-lg shadow-md w-[97%] px-2 py-2">
      <h1 className="text-base">comments</h1>

      {commentData?.map((comment, index) => (
        <div key={index} className="bg-gray-50/50 rounded-lg">
          <div className="flex gap-x-3 items-center">
            <Link
              to={`/profile/${comment.postedBy?._id}`}
              className={`size-6 rounded-full overflow-hidden cursor-pointer ${
                comment.postedBy?.isLoggedIn && " border-2 border-green-600"
              }`}
            >
              <img
                src={comment.postedBy?.profileImage}
                alt=""
                className="min-w-full min-h-full"
              />
            </Link>
            <div>
              <Link
                to={`/profile/${comment.postedBy?._id}`}
                className="text-xs font-semibold"
              >
                {comment.postedBy?.name}
              </Link>
              <p className="text-[10px] font-semibold text-gray-400">
                {timeAgo(comment?._createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-x-2 bg-gray-100">
            <p className="text-base px-1 text-gray-700">{comment?.comments}</p>
            <div
              className="cursor-pointer text-2xl text-red-600"
              onClick={() => handleDelComment(index)}
            >
              {deleteLoading ? (
                <AiOutlineLoading className="animate-spin" />
              ) : (
                <AiFillDelete />
              )}
            </div>
          </div>
        </div>
      ))}
      {!commentLoading && commentData.length === 0 && (
        <div className="mx-auto text-sm font-semibold text-gray-400">
          {" "}
          no commnets{" "}
        </div>
      )}

      {commentLoading && <CommentShimmer />}

      <CreateComment postId={postId} />
    </div>
  );
});

Comment.displayName = "Comment";

export default Comment;
