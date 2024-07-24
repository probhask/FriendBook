import React from "react";

const StoriesShimmer = React.memo(() => {
  return (
    <div className="relative flex justify-center items-center min-w-[7rem] h-[10rem] md:h-[11rem] bg-slate-400 overflow-hidden rounded-lg">
      {/* Skeleton image placeholder */}
      <div className={`animate-pulse w-full h-full bg-gray-300`}></div>

      <div className="absolute top-1 left-1 size-8 overflow-hidden rounded-full border-[3.5px] border-gray-300">
        {/* Skeleton for user profile image */}
        <div className={`animate-pulse w-8 h-8 bg-gray-300 rounded-full`}></div>
      </div>

      <div className="absolute bottom-2 left-1 text-sm font-semibold text-white cursor-default w-[90%]">
        {/* Skeleton for user name */}
        <div
          className={`animate-pulse  w-full h-2 bg-gray-300 rounded-sm`}
        ></div>
      </div>
    </div>
  );
});

export default StoriesShimmer;
