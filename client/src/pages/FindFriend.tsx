import React from "react";
import { FriendRequest, FriendSuggestionContainer } from "../features";

const FindFriends = React.memo(() => {
  return (
    <div className="w-full overflow-y-auto flex flex-col gap-y-5 min-h-full bg-white">
      {/* friend request */}
      <FriendRequest />
      {/* friend Suggestion */}
      <FriendSuggestionContainer />
    </div>
  );
});

FindFriends.displayName = "FindFriends";

export default FindFriends;
