import { PostContainer, PostShimmer } from "@components/index";
import useWindowInfiniteScroll from "@hooks/useWindowInfiniteScroll";
import { getPosts } from "@redux/AsyncFunctions/postAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import {
  getPostData,
  getPostHasMore,
  getPostLoading,
  resetFeed,
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
  const userId = id || authUserId;
  const own = Boolean(id);

  useWindowInfiniteScroll({
    callback: () => {
      if (userId) dispatch(getPosts({ userId, own }));
    },
    hasMore: postHasMore,
    isLoading: postLoading,
  });

  useEffect(() => {
    // Wait until we actually know whose feed to load — otherwise a first
    // fetch with an empty id races the real one and corrupts pagination.
    if (!userId) return;
    window.scroll(0, 0);
    dispatch(resetFeed());
    const promise = dispatch(getPosts({ userId, own }));
    return () => promise.abort();
  }, [dispatch, userId, own]);

  return (
    <>
      <div className="w-full flex flex-col gap-y-3">
        {postData.map((post) => (
          <PostContainer
            key={post._id}
            post={post}
            showComment={showCommentId === post._id}
            setShowComment={toggleShowComment}
          />
        ))}
      </div>
      {postLoading && <PostShimmer />}
      {!postLoading && postData.length === 0 && (
        <div className="mt-5 mb-2 text-center text-gray-500">
          No posts yet
        </div>
      )}
    </>
  );
});
Feed.displayName = "Feed";

export default Feed;
