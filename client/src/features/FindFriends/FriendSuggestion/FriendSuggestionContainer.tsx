import { getAllUser } from "@redux/AsyncFunctions/allUserAync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getAllUserData,
  getAllUserError,
  getAllUserLoading,
} from "@redux/slice/allUserSlice";
import { memo, useEffect } from "react";
import { FriendSuggestion } from "@features/index";
import { FriendSuggestionShimmer } from "@components/index";

const FriendSuggestionContainer = memo(() => {
  const allUserData = useAppSelector(getAllUserData);
  const allUserLoading = useAppSelector(getAllUserLoading);
  const allUserError = useAppSelector(getAllUserError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getAllUser());
    return () => promise.abort();
  }, []);

  return (
    <div className="px-1 py-2 bg-gray-50">
      <h1 className="mb-2 text-base font-bold px-2">Suggestions</h1>
      <div className="grid sm:grid-cols-2  gap-x-2 gap-y-2">
        {allUserData &&
          allUserData.map((user, index) => (
            <FriendSuggestion suggestionUser={user} key={index} />
          ))}
        {allUserLoading &&
          [1, 2, 3, 4].map((index) => <FriendSuggestionShimmer key={index} />)}
      </div>
      {!allUserLoading && (
        <div
          className={`my-5 text-center mx-auto text-sm font-semibold ${
            allUserError ? "text-red-500" : "text-gray-500"
          }`}
        >
          {allUserData && allUserData.length === 0 && !allUserError
            ? " No suggestions"
            : `${allUserError}`}
        </div>
      )}
    </div>
  );
});

FriendSuggestionContainer.displayName = "FriendSuggestionContainer";

export default FriendSuggestionContainer;
