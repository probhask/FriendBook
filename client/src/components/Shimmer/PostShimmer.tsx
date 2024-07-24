import React from "react";

const PostShimmer = React.memo(() => {
  return (
    <div className="flex flex-col gap-y-2 mb-4 animate-pulse bg-white px-1 py-2 rounded-lg shadow-md">
      <div className="flex gap-x-3 items-center w-full gap-y-2">
        {/* Skeleton for profile image */}
        <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

        <div className="w-full">
          {/* Skeleton for profile name */}
          <div className="w-[70%] h-3 bg-gray-300 rounded-sm mb-1"></div>
          {/* Skeleton for timestamp */}
          <div className="w-16 h-2 bg-gray-300 rounded-sm"></div>
        </div>
      </div>

      {/* Skeleton for post description */}
      <div className="w-full h-10 bg-gray-300 rounded-md my-2"></div>

      {/* Skeleton for post image */}
      <div className="min-w-full min-h-64 bg-gray-300 rounded-md"></div>

      {/* Skeleton for likes and comments */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-x-2 justify-evenly w-full">
          {/* Skeleton for likes */}
          <div className="animate-pulse  h-8 bg-gray-300 rounded-md w-[40%]"></div>
          {/* Skeleton for comments */}
          <div className="animate-pulse  h-8 bg-gray-300 rounded-md w-[40%]"></div>
        </div>
      </div>
    </div>
  );
});

PostShimmer.displayName = "PostShimmer";

export default PostShimmer;
