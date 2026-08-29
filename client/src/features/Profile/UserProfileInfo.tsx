import { checkIsFriends } from "@api/checkIsFriiends";
import { Feed, ErrorState, ProfileShimmer } from "@components/index";
import Seo from "@components/Seo/Seo";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import { getUserDeatail } from "@redux/AsyncFunctions/userDetailAsyc";
import {
  getDetailUserData,
  getDetailUserError,
  getDetailUserLoading,
  getDetailUserRequestedId,
} from "@redux/slice/detailUserSlice";
import {
  DetailUserInfo,
  EditProfile,
  UserProfileActionButton,
} from "@features/index";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfileInfo = React.memo(() => {
  const { id: userId } = useParams();
  const [isFriends, setIsFriends] = useState<boolean | null>(null);

  const dispatch = useAppDispatch();
  const authId = useAppSelector(getAuthData)._id;
  const detail = useAppSelector(getDetailUserData);
  const detailLoading = useAppSelector(getDetailUserLoading);
  const detailError = useAppSelector(getDetailUserError);
  const requestedId = useAppSelector(getDetailUserRequestedId);

  useEffect(() => {
    if (!userId) return;
    setIsFriends(null);
    const promise = dispatch(getUserDeatail({ userId }));
    return () => promise.abort();
  }, [dispatch, userId]);

  const fetchIsFriends = useCallback(async () => {
    if (!userId || userId === authId) return;
    try {
      setIsFriends(
        await checkIsFriends({ currentUserId: authId, friendId: userId })
      );
    } catch {
      setIsFriends(false);
    }
  }, [userId, authId]);

  useEffect(() => {
    fetchIsFriends();
  }, [fetchIsFriends]);

  if (!userId) return null;

  // Still loading this profile (or haven't started fetching it yet).
  const ready = requestedId === userId && !detailLoading;
  if (!ready && !detail._id) return <ProfileShimmer />;

  if (ready && (detailError || !detail._id)) {
    return (
      <div className="w-full bg-white md:rounded-2xl">
        <ErrorState message={detailError || "This profile doesn't exist."} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white md:rounded-2xl overflow-hidden">
      <Seo title={detail?.name?.trim() || "Profile"} noIndex />
      <DetailUserInfo />

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
