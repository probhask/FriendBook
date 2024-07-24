import { getComment } from "@redux/AsyncFunctions/commentAsync";
import { useAppDispatch } from "@redux/hooks/storeHook";
import { forwardRef, useEffect } from "react";
import { Post, Comment, LikesComments } from "@components/index";
import { PostsType } from "types";

type Props = {
  post: PostsType;
  showComment: boolean;
  setShowComment: (postId: string) => void;
};

const PostContainer = forwardRef<HTMLDivElement, Props>(
  ({ post, setShowComment, showComment }: Props, ref) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (showComment) {
        dispatch(getComment({ postId: post._id }));
      }
    }, [post._id]);
    return (
      <div
        className="flex flex-col justify-center items-center gap-y-1"
        ref={ref}
      >
        <div className="px-1.5 flex flex-col gap-y-1 w-full bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* userinfo */}

          <Post post={post} />

          {/* like and comments and share */}
          <LikesComments
            toggleComment={setShowComment}
            postId={post._id}
            LikedInfo={post.LikedInfo}
            isLikedByUser={post.isLikedByUser}
          />
        </div>

        {/* comments */}
        {showComment && <Comment postId={post._id} />}
      </div>
    );
  }
);

PostContainer.displayName = "PostContainer";

export default PostContainer;
