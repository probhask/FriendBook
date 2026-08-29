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
    value: unknown,
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
    const [friendList, setFriendList] = useState<Friend[]>([]);
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

    const removeTaggeduser = useCallback(
      (userID: string) => {
        setTaggedUser((prev) => prev.filter((user) => user._id !== userID));
        setTaggedUserIds((prev) => prev.filter((id) => id !== userID));
      },
      [setTaggedUser, setTaggedUserIds]
    );

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
    }, [debouncedSearch, currentUserId, taggedUserIds]);

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
