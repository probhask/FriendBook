import { checkIsFriends } from "@api/checkIsFriiends";
import { Feed } from "@components/index";
import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";

import {
  DetailUserInfo,
  EditProfile,
  UserProfileActionButton,
} from "@features/index";
import React, { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfileInfo = React.memo(() => {
  const { id: userId } = useParams();
  const [isFriends, setIsFriends] = useState<boolean | null>(null);

  const authId = useAppSelector(getAuthData)._id;
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const fetchIsFriends = useCallback(async () => {
    if (userId) {
      try {
        const result = await checkIsFriends({
          currentUserId: authId,
          friendId: userId,
        });
        setIsFriends(result);
      } catch (error) {
        console.error("Error checking if friends:", error);
        setIsFriends(false); // or handle error state as per your app logic
      }
    }
  }, [userId]);

  // if (detailUserLoading) {
  //   return <ProfileShimmer />;
  // }
  if (userId) {
    return (
      <div
        className="w-full bg-white md:rounded-2xl overflow-hidden"
        ref={mainContainerRef}
      >
        {/* image data */}
        <DetailUserInfo userId={userId} fetchIsFriends={fetchIsFriends} />

        {/* other info  */}
        {userId !== authId && isFriends !== null && (
          <UserProfileActionButton isFriends={isFriends} userId={userId} />
        )}
        {userId === authId && <EditProfile />}

        {/* feed */}
        <Feed />
      </div>
    );
  }
});

UserProfileInfo.displayName = "UserProfileInfo";
export default UserProfileInfo;
