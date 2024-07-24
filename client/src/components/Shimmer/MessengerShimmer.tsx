import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

const MessenegerShimmer = React.memo(() => {
  return (
    <div className="relative min-h-full h-full w-full overflow-x-hidden no-scrollbar flex flex-col">
      <div className="sticky top-0 bg-blue-700 py-2.5 px-1.5 text-white flex justify-between items-center">
        <div className="flex gap-x-3 items-center">
          <AiOutlineArrowLeft className="cursor-pointer" />
          <div
            className="flex justify-center items-center skeleton rounded-full"
            style={{ width: 39, height: 39 }}
          ></div>
          <div className="skeleton h-4 w-24 rounded"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-2 sm:px-5 gap-y-10 pt-5 pb-16">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex gap-2 ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="skeleton h-10 w-10 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/2 rounded"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky top-full left-0 right-0 flex justify-center z-10 w-full py-0.5">
        <div className="flex items-center gap-x-1 bg-white px-2 py-1.5 overflow-hidden w-full">
          <div className="w-full">
            <div className="skeleton h-10 w-full rounded-lg"></div>
          </div>
          <div className="skeleton h-10 w-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
});

MessenegerShimmer.displayName = "MessenegerShimmer";

export default MessenegerShimmer;
