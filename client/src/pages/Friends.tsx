import { ProfilePreview } from "@components/index";
import { checkIfNotCreateConversation } from "@redux/AsyncFunctions/conversationAsync";
import { getFriendsList, unFriend } from "@redux/AsyncFunctions/friendAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  selectFriendData,
  selectFriendLoading,
  selectUnfriendLoading,
} from "@redux/slice/friendSlice";
import React, { useEffect, useState } from "react";
import { HiUserRemove } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Friends = React.memo(() => {
  const [, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const friendlist = useAppSelector(selectFriendData);
  const friendLoading = useAppSelector(selectFriendLoading);
  const unfriendLoading = useAppSelector(selectUnfriendLoading);

  const handleMsgClick = async (userId: string) => {
    setLoading(true);
    if (userId) {
      const conversation = await dispatch(
        checkIfNotCreateConversation({ secondUserId: userId })
      )
        .unwrap()
        .finally(() => setLoading(false));
      console.log("rep", conversation._id);
      navigate(`/chat/messenger/${conversation._id}`);
    }
  };

  useEffect(() => {
    dispatch(getFriendsList());
  }, []);
  return (
    <div className="flex flex-col items-center gap-y-3 min-h-full min-w-full rounded-lg px-2 py-1.5 bg-white">
      <h1 className="text-center w-full font-semibold text-gray-700  mt-1 text-2xl uppercase font-bold">
        Friends
      </h1>
      <div className="flex flex-col  justify-between w-full">
        {friendlist &&
          friendlist.map((friend, index) => (
            <div
              key={index}
              className="flex w-full hover:bg-gray-100 px-1 py-2"
              onClick={() => handleMsgClick(friend.friend._id)}
            >
              <div
                className="w-full h-full"
                onClick={() => navigate(`/profile/${friend.friend._id}`)}
              >
                <ProfilePreview
                  user={friend.friend}
                  imageSize={35}
                  navigateTo=""
                  isLoggedIn={friend.friend.isLoggedIn}
                  // onclick={() => navigate(`/profile/${friend.friend._id}`)}
                  className=" w-fit"
                />
              </div>
              <button
                className="px-2 py-0.5 text-base font-semibold text-blue-600 border border-blue-600 hover:text-white hover:bg-blue-600 cursor-pointer flex-1 min-w-24  "
                type="button"
                disabled={unfriendLoading === friend._id}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(unFriend({ friendShipId: friend._id }));
                }}
              >
                {unfriendLoading === friend._id ? (
                  "..."
                ) : (
                  <span className="flex items-center gap-x-1">
                    <HiUserRemove />
                    unfriend
                  </span>
                )}
              </button>
            </div>
          ))}

        {!friendLoading && friendlist.length === 0 && (
          <div className="flex flex-col gap-y-1 w-full justify-center items-center h-full">
            <span>no friends like to explore</span>{" "}
            <span
              className="cursor-pointer px-2 py-0.5 bg-blue-600 text-white font-semibold rounded-lg"
              onClick={() => navigate("/find-friend")}
            >
              find friends
            </span>
          </div>
        )}
      </div>
      {friendLoading && <div> loading....</div>}
    </div>
  );
});

Friends.displayName = "Friends";

export default Friends;
