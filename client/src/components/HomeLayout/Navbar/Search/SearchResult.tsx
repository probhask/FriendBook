import { HighLightedText, ProfileImage } from "@components/index";
import { User } from "types";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  selectedSuggestion: number;
  suggestions: User[];
  highLightText: string;
  onSelect: (userId: string) => void;
  loading: boolean;
  isFullScreen: boolean;
  hideResult: () => void;
};

const SearchResult = React.memo(
  ({
    highLightText,
    onSelect,
    selectedSuggestion,
    suggestions,
    loading,
    isFullScreen,
    hideResult,
  }: Props) => {
    return (
      <div
        className={`absolute top-[40px] border-t-2  left-0 right-0 w-svw h-svh bg-white md:shadow-lg overflow-y-auto custom-scroll md:max-w-[600px] md:translate-x-[7%] ${
          isFullScreen ? "md:h-fit md:w-full" : "md:h-auto md:w-auto"
        }`}
      >
        <p className=" w-full text-base font font-semibold text-gray-400 px-3 py-1 hidden md:flex justify-between">
          {" "}
          <span>search result</span>
          <AiOutlineClose onClick={hideResult} />
        </p>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-col  lg:text-lg">
            {!loading &&
              suggestions.map((user, index) => (
                <div
                  key={index}
                  className={`flex gap-x-2  font-medium cursor-pointer  px-2 py-3 lg:py-2.5 hover:bg-gray-300 ${
                    selectedSuggestion === index && "bg-gray-300"
                  }`}
                  onClick={() => onSelect(user._id)}
                >
                  <ProfileImage
                    size={30}
                    navigateTo={`/profile/${user._id}`}
                    userProfileImage={user.profileImage}
                  />
                  <span>
                    {HighLightedText({
                      highLighText: highLightText,
                      text: user.name,
                    })}
                  </span>
                </div>
              ))}
          </div>
        )}
        {loading && <div className="my-5 text-center">searching...</div>}

        {!loading && suggestions.length === 0 && (
          <div className="my-5 text-center">no match found</div>
        )}
      </div>
    );
  }
);

SearchResult.displayName = "SearchResult";

export default SearchResult;
