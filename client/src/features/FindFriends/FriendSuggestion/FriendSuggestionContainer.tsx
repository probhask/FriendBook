import { getAllUser } from "@redux/AsyncFunctions/allUserAync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getAllUserData,
  getAllUserError,
  getAllUserLoading,
} from "@redux/slice/allUserSlice";
import { memo, useEffect } from "react";
import { FriendSuggestion } from "@features/index";
import {
  EmptyState,
  ErrorState,
  FriendSuggestionShimmer,
} from "@components/index";
import { FiUserCheck } from "react-icons/fi";

const FriendSuggestionContainer = memo(() => {
  const users = useAppSelector(getAllUserData);
  const loading = useAppSelector(getAllUserLoading);
  const error = useAppSelector(getAllUserError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getAllUser());
    return () => promise.abort();
  }, [dispatch]);

  return (
    <section className="px-2 py-3">
      <h2 className="mb-3 px-1 text-base font-bold text-gray-800">
        People you may know
      </h2>

      {loading && users.length === 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <FriendSuggestionShimmer key={i} />
          ))}
        </div>
      )}

      {!loading && error && users.length === 0 && (
        <ErrorState message={error} onRetry={() => dispatch(getAllUser())} />
      )}

      {!loading && !error && users.length === 0 && (
        <EmptyState
          icon={<FiUserCheck />}
          title="You're all caught up"
          description="No new people to suggest right now."
        />
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {users.map((user) => (
          <FriendSuggestion suggestionUser={user} key={user._id} />
        ))}
      </div>
    </section>
  );
});

FriendSuggestionContainer.displayName = "FriendSuggestionContainer";

export default FriendSuggestionContainer;
