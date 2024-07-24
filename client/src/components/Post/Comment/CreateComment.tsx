import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/storeHook";
import { getAuthData } from "../../../redux/slice/authSlice";
import { IoSend } from "react-icons/io5";
import React, { FormEvent, useState } from "react";
import { getCreatingCommentLoading } from "../../../redux/slice/commentSlice";
import { AiOutlineLoading } from "react-icons/ai";
import { addComment } from "../../../redux/AsyncFunctions/commentAsync";

type Props = {
  postId: string;
};

const CreateComment = React.memo(({ postId }: Props) => {
  const [comment, setComment] = useState<string>("");
  const creatingComment = useAppSelector(getCreatingCommentLoading);

  const auth = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();

  const createNewComment = (e: FormEvent<HTMLFormElement>) => {
    if (postId && comment && comment.length > 0) {
      e.preventDefault();
      dispatch(addComment({ comment: comment, postId }))
        .then(() => setComment(""))
        .catch(() => setComment(""));
    }
  };
  return (
    <form className="flex gap-x-1 items-center" onSubmit={createNewComment}>
      {" "}
      <Link
        to={`/profile/${auth._id}`}
        className="size-6 rounded-full overflow-hidden"
      >
        <img
          src={auth?.profileImage}
          alt=""
          className="max-w-full max-h-full"
        />
      </Link>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        type="text"
        placeholder="comment...."
        className="outline-none border w-full rounded-lg text-base px-1.5 py-0.5"
      />
      <button
        type="submit"
        className={`px-1 text-blue-600 ${creatingComment && "animate-spin"}`}
        disabled={creatingComment}
      >
        {creatingComment ? <AiOutlineLoading fontWeight={900} /> : <IoSend />}
      </button>
    </form>
  );
});

CreateComment.displayName = "CreateComment";
export default CreateComment;
