import { Link } from "react-router-dom";
import { PostsType } from "../../types";
import { ProfileImage, TagUserUI } from "@components/index";
import PostMedia from "./PostMedia";
import { timeAgo } from "@utils/timeAgo";
import React from "react";

type Props = {
  post: PostsType;
};

const Post = React.memo(({ post }: Props) => {
  return (
    <article>
      <header className="flex gap-x-3 items-center flex-nowrap">
        <ProfileImage
          size={35}
          navigateTo={`/profile/${post.postedBy._id}`}
          userProfileImage={post.postedBy.profileImage}
          isLoggedIn={post.postedBy.isLoggedIn}
        />

        <div>
          <Link
            to={`/profile/${post.postedBy._id}`}
            className="text-sm sm:text-base font-semibold cursor-pointer text-nowrap"
          >
            {post.postedBy?.name}
          </Link>
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold text-gray-400">
            {timeAgo(post._createdAt)}
          </p>
        </div>
        {post.totalTagUser > 0 && post.tagUser !== null && (
          <TagUserUI tagUser={post.tagUser} totalTagUser={post.totalTagUser} />
        )}
      </header>

      {post?.postDesc && (
        <p className="text-base text-black/80 px-1 py-2">{post.postDesc}</p>
      )}

      <PostMedia
        mediaType={post.mediaType}
        image={post.image}
        video={post.video}
        audio={post.audio}
        audioMeta={post.audioMeta}
        alt={post.postDesc || `Post by ${post.postedBy?.name}`}
        enableFullScreen
      />
    </article>
  );
});
Post.displayName = "Post";

export default Post;
