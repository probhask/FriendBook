import { PostContainer, PostShimmer } from "@components/index";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { getPosts } from "@redux/AsyncFunctions/postAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import {
  getPostData,
  getPostHasMore,
  getPostLoading,
} from "@redux/slice/postSlice";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const Feed = React.memo(() => {
  const postData = useAppSelector(getPostData);
  const postLoading = useAppSelector(getPostLoading);
  const postHasMore = useAppSelector(getPostHasMore);
  const authUserId = useAppSelector(getAuthData)._id;
  const dispatch = useAppDispatch();
  const [showCommentId, setShowCommentId] = useState<string>("");

  const toggleShowComment = (postId: string) => {
    if (postId === showCommentId) {
      setShowCommentId("");
    } else {
      setShowCommentId(postId);
    }
  };

  const { id } = useParams();
  const userId = id ? id : authUserId;

  const postInfinteScrollRef = useInfiniteScroll({
    callback: () => {
      dispatch(getPosts({ userId: userId, own: id ? true : false }));
    },
    hasMore: postHasMore,
    isLoading: postLoading,
  });
  // console.log("postHasMore", postHasMore);

  useEffect(() => {
    const promise = dispatch(
      getPosts({ userId: userId, own: id ? true : false })
    );
    return () => promise.abort();
  }, []);
  return (
    <>
      {postData && (
        <div className="w-full flex flex-col gap-y-3">
          {postData.map((post, index) => {
            if (postData.length === index + 1) {
              return (
                <PostContainer
                  key={index}
                  post={post}
                  ref={postInfinteScrollRef}
                  showComment={showCommentId === post._id}
                  setShowComment={toggleShowComment}
                />
              );
            }
            return (
              <PostContainer
                post={post}
                showComment={showCommentId === post._id}
                setShowComment={toggleShowComment}
                key={post._id}
              />
            );
          })}
        </div>
      )}
      {postLoading && <PostShimmer />}
      {!postLoading && postData.length === 0 && (
        <div className="mt-5 mb-2 text-center">no post available</div>
      )}
    </>
  );
});
Feed.displayName = "Feed";

export default Feed;
