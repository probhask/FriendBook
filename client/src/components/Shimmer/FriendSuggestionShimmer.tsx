import { memo } from "react";
import { ProfileInfoShimmer } from "../../components";
const FriendSuggestionShimmer = memo(() => {
  return (
    <div className="flex flex-col bg-white w-full px-3 py-2 rounded-lg shadow-sm ">
      <ProfileInfoShimmer />
      <div className="w-[70%] h-6 bg-gray-100 self-center rounded-md"></div>
    </div>
  );
});

export default FriendSuggestionShimmer;
