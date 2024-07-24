import React from "react";

const ProfileShimmer = React.memo(() => {
  return (
    // Skeleton loading UI

    <div className="w-full">
      {/* Image skeleton */}
      <div className="relative">
        <div className="animate-pulse w-full h-[15rem] sm:h-[20rem] bg-gray-200 rounded-2xl border-2"></div>
        <div className="absolute top-[68%] sm:top-[75%] left-[50%] transform -translate-x-1/2 size-40 bg-gray-200 rounded-full"></div>
      </div>

      {/* Other info skeleton */}
      <div className="bg-white my-10 mt-10 p-4">
        <div className="animate-pulse mb-2 h-4 w-1/2 bg-gray-200"></div>
        <div className="animate-pulse mb-2 h-4 w-3/4 bg-gray-200"></div>
        <div className="animate-pulse mb-2 h-4 w-1/3 bg-gray-200"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex justify-center space-x-4">
        <div className="animate-pulse w-[90%] sm:w-full h-10 bg-gray-200 rounded-lg"></div>
        <div className="animate-pulse w-[90%] sm:w-full h-10 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Feed skeleton */}
      <div className="mt-8">
        <div className="animate-pulse h-8 bg-gray-200 mb-4 w-full"></div>
        <div className="animate-pulse h-8 bg-gray-200 mb-4 w-full"></div>
        <div className="animate-pulse h-8 bg-gray-200 mb-4 w-full"></div>
      </div>
    </div>
  );
});

ProfileShimmer.displayName = "ProfileShimmer";

export default ProfileShimmer;
