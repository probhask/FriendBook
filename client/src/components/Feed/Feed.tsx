import {
  PostContainer,
  PostShimmer,
  EmptyState,
  ErrorState,
} from "@components/index";
import { FiFileText } from "react-icons/fi";
import useWindowInfiniteScroll from "@hooks/useWindowInfiniteScroll";
import { getPosts } from "@redux/AsyncFunctions/postAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import {
  getPostData,
  getPostError,
  getPostHasMore,
  getPostLoading,
  resetFeed,
} from "@redux/slice/postSlice";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const Feed = React.memo(() => {
  const postData = useAppSelector(getPostData);
  const postLoading = useAppSelector(getPostLoading);
  const postError = useAppSelector(getPostError);
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

  if (!postLoading && postError && postData.length === 0) {
    return (
      <ErrorState
        message={postError}
        onRetry={() => userId && dispatch(getPosts({ userId, own }))}
      />
    );
  }

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
        <EmptyState
          icon={<FiFileText />}
          title="No posts yet"
          description={
            own
              ? "This profile hasn't posted anything."
              : "Follow friends or create the first post."
          }
        />
      )}
    </>
  );
});
Feed.displayName = "Feed";

export default Feed;
