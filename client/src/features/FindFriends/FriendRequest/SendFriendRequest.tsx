import {
  Button,
  FriendSuggestionShimmer,
  ProfilePreview,
} from "@components/index";
import {
  cancelSendedRequest,
  getSendFriendRequestList,
} from "@redux/AsyncFunctions/friendRequestAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getSendFriendRequestData,
  getSendRequestLoading,
} from "@redux/slice/friendRequestSlice";
import { memo, useEffect } from "react";

const SendFriendRequest = memo(() => {
  const sendFriendRequest = useAppSelector(getSendFriendRequestData);
  const sendRequestLoading = useAppSelector(getSendRequestLoading);
  const error = useAppSelector(({ friendRequest }) => friendRequest.error);
  const cancellingSendedFriendRequest = useAppSelector(
    ({ friendRequest }) => friendRequest.cancelSendedRequestLoading
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getSendFriendRequestList());
    return () => promise.abort();
  }, [dispatch]);
  return (
    <div className="grid sm:grid-cols-2  gap-x-2 gap-y-2 py-1.5 px-0.5">
      {sendRequestLoading &&
        [1, 2].map((index) => <FriendSuggestionShimmer key={index} />)}

      {sendFriendRequest &&
        sendFriendRequest.length > 0 &&
        sendFriendRequest.map((sendRequest, index) => (
          <div
            className="flex flex-col justify-between gap-y-5 shadow-sm px-3 py-2 rounded-lg w-full bg-white"
            key={index}
          >
            <ProfilePreview
              user={sendRequest.sentTo}
              imageSize={35}
              navigateTo={`/profile/${sendRequest.sentTo._id}`}
            />
            <Button
              text={
                cancellingSendedFriendRequest === sendRequest._id
                  ? "..."
                  : "Cancel"
              }
              className="w-[90%] h-fit py-1.5 sm:w-full bg-white text-red-600 border-2 border-red-600 hover:bg-red-500 hover:text-white text-sm font-semibold rounded-lg self-center"
              type="button"
              onclickAction={() =>
                dispatch(cancelSendedRequest({ sendRequest: sendRequest }))
              }
            />
          </div>
        ))}
      {!sendRequestLoading && sendFriendRequest.length === 0 && (
        <p className="col-span-full my-6 text-center text-sm text-gray-500">
          {error || "You haven't sent any friend requests."}
        </p>
      )}
    </div>
  );
});

SendFriendRequest.displayName = "SendFriendRequest";
export default SendFriendRequest;
