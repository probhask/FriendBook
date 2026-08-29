import { checkIsFriends } from "@api/checkIsFriiends";
import { Feed, ErrorState, ProfileShimmer } from "@components/index";
import Seo from "@components/Seo/Seo";
import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import {
  getDetailUserData,
  getDetailUserError,
  getDetailUserLoading,
} from "@redux/slice/detailUserSlice";

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
  const detail = useAppSelector(getDetailUserData);
  const detailLoading = useAppSelector(getDetailUserLoading);
  const detailError = useAppSelector(getDetailUserError);
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
  }, [userId, authId]);

  if (!userId) return null;

  if (detailLoading && !detail?._id) return <ProfileShimmer />;

  if (!detailLoading && (detailError || !detail?._id)) {
    return (
      <div className="w-full bg-white md:rounded-2xl">
        <ErrorState
          message={detailError || "This profile doesn't exist."}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white md:rounded-2xl overflow-hidden"
      ref={mainContainerRef}
    >
      <Seo title={detail?.name || "Profile"} noIndex />
      <DetailUserInfo userId={userId} fetchIsFriends={fetchIsFriends} />

      {userId !== authId && isFriends !== null && (
        <UserProfileActionButton isFriends={isFriends} userId={userId} />
      )}
      {userId === authId && <EditProfile />}

      <Feed />
    </div>
  );
});

UserProfileInfo.displayName = "UserProfileInfo";
export default UserProfileInfo;
