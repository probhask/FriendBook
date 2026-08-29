import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineChat } from "react-icons/hi";
import { HiUserRemove } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import Seo from "@components/Seo/Seo";
import {
  EmptyState,
  ErrorState,
  ProfileImage,
  RowsSkeleton,
} from "@components/index";
import { checkIfNotCreateConversation } from "@redux/AsyncFunctions/conversationAsync";
import { getFriendsList, unFriend } from "@redux/AsyncFunctions/friendAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  selectFriendData,
  selectFriendError,
  selectFriendLoading,
  selectUnfriendLoading,
} from "@redux/slice/friendSlice";
import toast from "react-hot-toast";

const Friends = React.memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const friends = useAppSelector(selectFriendData);
  const loading = useAppSelector(selectFriendLoading);
  const error = useAppSelector(selectFriendError);
  const unfriending = useAppSelector(selectUnfriendLoading);

  const [query, setQuery] = useState("");
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    dispatch(getFriendsList());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.friend?.name?.toLowerCase().includes(q));
  }, [friends, query]);

  const openChat = async (userId: string) => {
    if (!userId || opening) return;
    setOpening(true);
    try {
      const c = await dispatch(
        checkIfNotCreateConversation({ secondUserId: userId })
      ).unwrap();
      if (c?._id) navigate(`/chat/messenger/${c._id}`);
    } catch {
      toast.error("Couldn't open chat");
    } finally {
      setOpening(false);
    }
  };

  return (
    <div className="w-full min-h-full rounded-2xl bg-white px-3 sm:px-5 py-5">
      <Seo title="Friends" noIndex />
      <div className="mb-4 flex items-center justify-between gap-x-3">
        <h1 className="text-xl font-bold text-gray-800">
          Friends{" "}
          {friends.length > 0 && (
            <span className="text-gray-400">({friends.length})</span>
          )}
        </h1>
        <Link
          to="/find-friend"
          className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Find friends
        </Link>
      </div>

      {friends.length > 0 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter friends…"
          aria-label="Filter friends"
          className="mb-4 w-full rounded-xl border-2 border-gray-200 px-3 py-2 outline-none focus:border-blue-500"
        />
      )}

      {loading && friends.length === 0 && <RowsSkeleton rows={7} />}

      {!loading && error && friends.length === 0 && (
        <ErrorState message={error} onRetry={() => dispatch(getFriendsList())} />
      )}

      {!loading && !error && friends.length === 0 && (
        <EmptyState
          icon={<FiUsers />}
          title="No friends yet"
          description="Find people you know and send them a friend request."
          action={
            <Link
              to="/find-friend"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Find friends
            </Link>
          }
        />
      )}

      {friends.length > 0 && filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">
          No friends match “{query}”.
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map((f) => (
          <li
            key={f._id}
            className="flex items-center gap-x-3 rounded-xl border border-gray-100 p-3 hover:shadow-sm"
          >
            <ProfileImage
              size={48}
              navigateTo={`/profile/${f.friend?._id}`}
              userProfileImage={f.friend?.profileImage}
              isLoggedIn={f.friend?.isLoggedIn}
            />
            <Link
              to={`/profile/${f.friend?._id}`}
              className="min-w-0 flex-1 font-semibold text-gray-800 truncate"
            >
              {f.friend?.name}
            </Link>
            <button
              type="button"
              aria-label={`Message ${f.friend?.name}`}
              disabled={opening}
              onClick={() => openChat(f.friend?._id)}
              className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <HiOutlineChat className="text-lg" />
            </button>
            <button
              type="button"
              aria-label={`Unfriend ${f.friend?.name}`}
              disabled={unfriending === f._id}
              onClick={() => dispatch(unFriend({ friendShipId: f._id }))}
              className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <HiUserRemove className="text-lg" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

Friends.displayName = "Friends";

export default Friends;
