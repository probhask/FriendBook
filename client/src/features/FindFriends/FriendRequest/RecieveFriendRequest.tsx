import {
  Button,
  FriendSuggestionShimmer,
  ProfilePreview,
} from "@components/index";
import { acceptRequest } from "@redux/AsyncFunctions/friendAsync";
import {
  getRecieveFriendRequestList,
  rejectRecieveFriendRequest,
} from "@redux/AsyncFunctions/friendRequestAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getRecieveFriendRequestData,
  getRecieveRequestLoading,
} from "@redux/slice/friendRequestSlice";
import { memo, useEffect } from "react";

const RecieveFriendRequestComp = memo(() => {
  const recieveFriendRequest = useAppSelector(getRecieveFriendRequestData);
  const recieveRequestLoading = useAppSelector(getRecieveRequestLoading);
  const error = useAppSelector(({ friendRequest }) => friendRequest.error);
  const accepting = useAppSelector(({ friend }) => friend.acceptRequestLoading);
  const rejecting = useAppSelector(
    ({ friendRequest }) => friendRequest.rejectRecieveRequestLoading
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getRecieveFriendRequestList());

    return () => promise.abort();
  }, []);
  return (
    <>
      <div className="grid sm:grid-cols-2  gap-x-2 gap-y-2 py-1.5 px-0.5">
        {recieveRequestLoading &&
          [1, 2].map((index) => <FriendSuggestionShimmer key={index} />)}

        {recieveFriendRequest &&
          recieveFriendRequest.length > 0 &&
          recieveFriendRequest.map((recieveRequest, index) => (
            <div
              className="flex flex-col justify-between gap-y-5 bg-white shadow-sm px-3 py-2 rounded-lg w-full"
              key={index}
            >
              <ProfilePreview
                user={recieveRequest.sentFrom}
                imageSize={35}
                navigateTo={`/profile/${recieveRequest.sentFrom._id}`}
              />
              <div className="flex gap-x-3">
                <Button
                  text={accepting === recieveRequest._id ? "..." : "Accept"}
                  className="w-[90%] h-fit py-1.5 sm:w-full bg-white text-green-600 border-2 border-green-600 hover:bg-green-500 hover:text-white text-sm font-semibold rounded-lg self-center"
                  type="button"
                  onclickAction={() =>
                    dispatch(acceptRequest({ recieveRequest }))
                  }
                />
                <Button
                  text={rejecting === recieveRequest._id ? "..." : "Reject"}
                  className="w-[90%] h-fit py-1.5 sm:w-full bg-white text-red-600 border-2 border-red-600 hover:bg-red-500 hover:text-white text-sm font-semibold rounded-lg self-center"
                  type="button"
                  onclickAction={() =>
                    dispatch(
                      rejectRecieveFriendRequest({
                        requestId: recieveRequest._id,
                      })
                    )
                  }
                />
              </div>
            </div>
          ))}
      </div>
      {!recieveRequestLoading && (
        <div
          className={`my-5 text-center mx-auto text-sm font-semibold ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {recieveFriendRequest && recieveFriendRequest.length === 0 && !error
            ? " No suggestions"
            : `${error}`}
        </div>
      )}
    </>
  );
});

RecieveFriendRequestComp.displayName = "RecieveFriendRequestComp";

export default RecieveFriendRequestComp;
