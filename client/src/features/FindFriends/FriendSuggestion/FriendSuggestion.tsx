import { Button, ProfilePreview } from "@components/index";
import { createFriendRequest } from "@redux/AsyncFunctions/friendRequestAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { User } from "types";
import { memo } from "react";
type Props = {
  suggestionUser: User;
};

const FriendSuggestion = memo(({ suggestionUser }: Props) => {
  const sendingRequest = useAppSelector(
    ({ friendRequest }) => friendRequest.createRequestLoading
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col justify-between gap-y-5 bg-white shadow-sm px-3 py-2 rounded-lg w-full">
      <ProfilePreview
        user={suggestionUser}
        navigateTo={`/profile/${suggestionUser._id}`}
        imageSize={35}
      />
      <Button
        text={sendingRequest === suggestionUser?._id ? "..." : "Add Friend"}
        className="w-[90%] h-fit py-1.5 sm:w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-500 hover:text-white text-sm font-semibold rounded-lg self-center"
        type="button"
        onclickAction={() =>
          dispatch(createFriendRequest({ sentToId: suggestionUser._id }))
        }
      />
    </div>
  );
});

FriendSuggestion.displayName = "FriendSuggestion";
export default FriendSuggestion;
