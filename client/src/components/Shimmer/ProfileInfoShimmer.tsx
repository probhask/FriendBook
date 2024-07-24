import { memo } from "react";

const ProfileInfoShimmer = memo(() => {
  return (
    <div className="flex items-center gap-x-3 mb-2 bg-white w-full">
      <div className="w-8 h-8 rounded-full bg-gray-100"></div>
      <div className="min-w-20 w-40 h-3 rounded-md bg-gray-100 mb-1 "></div>
    </div>
  );
});

export default ProfileInfoShimmer;
