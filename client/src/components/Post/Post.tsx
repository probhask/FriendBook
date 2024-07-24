import { Link, useNavigate } from "react-router-dom";
import { PostsType } from "../../types";
import { ProfileImage, TagUserUI } from "@components/index";
import { timeAgo } from "@utils/timeAgo";
import React from "react";

type Props = {
  post: PostsType;
};

const Post = React.memo(({ post }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex gap-x-3 items-center flex-nowrap">
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
      </div>

      {/* description post */}
      <p className="text-[1.2rem] text-base text-black/80 px-1 py-2">
        {" "}
        {post?.postDesc}
      </p>

      {/* image */}
      <div className="w-full h-full min-h-[10rem] max-h-[15rem] md:min-h-max md:h[20rem] lg:min-h-[28rem] flex justify-center items-center overflow-hidden bg-gray-100s">
        <img
          src={post?.image}
          alt=""
          className="min-w-full min-h-full object-contain object-center"
          onClick={() =>
            navigate(`/full-screen/${encodeURIComponent(post?.image)}`)
          }
        />
      </div>
    </>
  );
});
Post.displayName = "Post";

export default Post;
