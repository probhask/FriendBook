import React, { useCallback, useEffect, useState } from "react";

import { FormikErrors, FormikValues } from "formik";
import { AiOutlineClose, AiOutlineLoading } from "react-icons/ai";
import { Friend, User } from "types";
import useDetectOutSideClick from "@hooks/useDetectOutSideClick";
import useCustomDebounce from "@hooks/useCustomDebounce";
import { useAppSelector } from "@redux/hooks/storeHook";
import { fetchFriends } from "@api/fetchFriendByName";
import { InputField } from "@components/index";

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurEvent: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  textLabel: string;
  error: string;
  value: string;
  taggedUser: User[];
  setTaggedUser: React.Dispatch<React.SetStateAction<User[]>>;
  taggedUserIds: string[];
  setTaggedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
};

const TagFriends = React.memo(
  ({
    handleChange,
    name,
    onBlurEvent,
    textLabel,
    value,
    taggedUser,
    setTaggedUser,
    taggedUserIds,
    setTaggedUserIds,
    setFieldValue,
  }: Props) => {
    const [friendList, setFriendList] = useState<Friend[]>([
      // {
      //   _id: "0c24784d-f508-412c-82b2-f9fe4ac20cae",
      //   friend: {
      //     _id: "5566923c-2234-4dbe-b070-cef246801ff4",
      //     name: "Sourav Singh Negi",
      //     profileImage:
      //       "https://cdn.sanity.io/images/us9jlw19/production/f8956015803d298a2e528bd8ca787fcafd0b2ecb-375x500.jpg",
      //     isLoggedIn: false,
      //   },
      // },
      // {
      //   _id: "bb44c4eb-e47d-4d08-b018-f7995be67bc2",
      //   friend: {
      //     _id: "7076469f-a34b-459d-b928-35c7d8b6dbdb",
      //     name: "Ravi Sharma",
      //     profileImage:
      //       "https://cdn.sanity.io/images/us9jlw19/production/9f6b47a4a44ad18e76f0814530c3558f102a32b0-601x891.webp",
      //     isLoggedIn: false,
      //   },
      // },
      // {
      //   _id: "c279c071-49d4-4fa1-a9ff-1f87bb7d168e",
      //   friend: {
      //     _id: "083b1f48-fe2c-416b-b459-40f20a42e85b",
      //     name: "Shaleen Badola",
      //     profileImage:
      //       "https://cdn.sanity.io/images/us9jlw19/production/c4889c35d71bd9aa503e54958a84adf9237b4c51-360x420.webp",
      //     isLoggedIn: false,
      //   },
      // },
    ]);
    const [loading, setLoading] = useState(false);
    const [showFriendList, setShowFriendList] = useState(false);
    const outsideClickRef = useDetectOutSideClick<HTMLDivElement>(() =>
      setShowFriendList(false)
    );
    const debouncedSearch = useCustomDebounce(value, 500);
    const currentUserId = useAppSelector((state) => state.auth.data._id);

    const addTaggedUser = (friendShip: Friend) => {
      setTaggedUser((prev) => [...prev, friendShip.friend]); //add tagged user
      setTaggedUserIds((prev) => [...prev, friendShip.friend._id]);
      //set taggede user ids
      setFriendList((prev) =>
        prev.filter((friendShip) => friendShip._id !== friendShip._id)
      );
      //remove from friendList
      setFieldValue(name, "");
    };

    const removeTaggeduser = useCallback((userID: string) => {
      setTaggedUser((prev) => prev.filter((user) => user._id !== userID));
      setTaggedUserIds((prev) => prev.filter((id) => id !== userID));
    }, []);

    useEffect(() => {
      const findFriend = async () => {
        if (debouncedSearch && debouncedSearch.length > 0) {
          setLoading(true);
          const resp = await fetchFriends({
            currentUserId,
            debouncedSearch,
            taggedUserIds,
          }).catch(() => {
            setLoading(false);
          });

          if (resp) {
            setFriendList(resp);
            setLoading(false);
          }
        }
      };
      findFriend();
    }, [debouncedSearch]);

    return (
      <div className="relative flex flex-col gap-y-1 w-full" id="tagDiv">
        <div className="text-gray-500 focus-within:text-gray-700 flex flex-col w-full">
          <h1 className="font-bold ">{textLabel}</h1>

          <div
            className="border flex gap-x-2 gap-y-2 flex-wrap w-full py-1.5 px-1 focus-within:border-x-0  focus-within:border-t-0 focus-within:-within:border-b-2 focus-within:border-b-gray-400 rounded-lg focus-within:rounded-none"
            ref={outsideClickRef}
            onClick={() => {
              setShowFriendList(true);
            }}
          >
            {taggedUser.length > 0 &&
              taggedUser.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-x-2 bg-slate-700 text-white rounded-lg px-2 py-1 text-sm"
                >
                  <span className="font-semibold"> {user.name}</span>
                  <AiOutlineClose
                    className="cursor-pointer text-xs"
                    onClick={() => removeTaggeduser(user._id)}
                  />
                </div>
              ))}

            {/* input field */}
            <InputField
              name={name}
              autoComplete="off"
              value={value}
              placeHolder="tag friends.."
              error={""}
              onBlur={onBlurEvent}
              onchange={handleChange}
              border={false}
            />
          </div>
        </div>

        {showFriendList && (
          <div className=" absolute z-20 top-full flex justify-center items-center gap-x-2 gap-y-5 flex-wrap  bg-gray-50 shadow-md w-full ">
            {loading && (
              <span className="py-2">
                <AiOutlineLoading className="text-black font-semibold text-4xl animate-spin" />
              </span>
            )}
            {!loading &&
              friendList.length > 0 &&
              friendList.map((friend) => (
                <div
                  key={friend._id}
                  className="flex text-sm w-full items-center hover:bg-gray-200 py-1 px-0.5 cursor-pointer"
                  onPointerUp={() => addTaggedUser(friend)}
                >
                  <div className="w-10 h-8">
                    <img
                      src={friend.friend.profileImage}
                      alt="friend-image"
                      className="min-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="font-semibold"> {friend.friend.name}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
);
TagFriends.displayName = "TagFriends";
export default TagFriends;

// {
//         _id: "0b77a678-fbbf-43a2-8538-25153b29526b",
//         name: "Bhaskar Sharma ",
//         profileImage:
//           "https://cdn.sanity.io/images/us9jlw19/production/aa6f6bce38eb11b9354b72b22eaa57a81869968e-375x500.jpg",
//         isLoggedIn: false,
//       },
//       {
//         _id: "0b77a678-fbbf-43a2-853-25153b29526b",
//         name: "Suraj Sharma ",
//         profileImage:
//           "https://cdn.sanity.io/images/us9jlw19/production/aa6f6bce38eb11b9354b72b22eaa57a81869968e-375x500.jpg",
//         isLoggedIn: false,
//       },
//       {
//         _id: "0b77a678-fbb-43a2-8538-25153b29526b",
//         name: "Aditya Sharma ",
//         profileImage:
//           "https://cdn.sanity.io/images/us9jlw19/production/aa6f6bce38eb11b9354b72b22eaa57a81869968e-375x500.jpg",
//         isLoggedIn: false,
//       },
//       {
//         _id: "0b77a67-fbbf-43a2-8538-25153b29526b",
//         name: "Shaleen badola ",
//         profileImage:
//           "https://cdn.sanity.io/images/us9jlw19/production/aa6f6bce38eb11b9354b72b22eaa57a81869968e-375x500.jpg",
//         isLoggedIn: false,
//       },
//       {
//         _id: "0b7a678-fbbf-43a2-8538-25153b29526b",
//         name: "Sourav Singh Negi",
//         profileImage:
//           "https://cdn.sanity.io/images/us9jlw19/production/aa6f6bce38eb11b9354b72b22eaa57a81869968e-375x500.jpg",
//         isLoggedIn: false,
//       },
