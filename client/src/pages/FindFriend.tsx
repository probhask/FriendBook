import React from "react";
import { FriendRequest, FriendSuggestionContainer } from "../features";
import Seo from "@components/Seo/Seo";

const FindFriends = React.memo(() => {
  return (
    <div className="w-full min-h-full rounded-2xl bg-white p-3 sm:p-5">
      <Seo title="Find friends" noIndex />
      <h1 className="mb-4 text-xl font-bold text-gray-800">Find friends</h1>
      <FriendRequest />
      <FriendSuggestionContainer />
    </div>
  );
});

FindFriends.displayName = "FindFriends";

export default FindFriends;
