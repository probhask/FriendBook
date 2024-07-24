import useCustomDebounce from "@hooks/useCustomDebounce";
import { searchUser } from "@redux/AsyncFunctions/searchAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import SearchResult from "./SearchResult";
import {
  selectSearchedUser,
  selectSearchLoading,
} from "@redux/slice/SearchSlice";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
type Props = {
  showSearchBar: boolean;
  toggleSearchBar: (val: boolean) => void;
};

const Search = React.memo(({ showSearchBar, toggleSearchBar }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResult, setShowResult] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
  const searchData = useAppSelector(selectSearchedUser);
  const searchLoading = useAppSelector(selectSearchLoading);
  const navigate = useNavigate();
  const debouncedSearch = useCustomDebounce(searchTerm, 500);
  const dispatch = useAppDispatch();

  const showResultSection = () => {
    toggleSearchBar(true);
    setShowResult(true);
    setSelectedSuggestion(-1);
  };
  const hideResultSection = () => {
    setShowResult(false);
    toggleSearchBar(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedSuggestion(-1);
    showResultSection();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (selectedSuggestion < searchData.length) {
      if (e.key === "ArrowUp" && selectedSuggestion > 0) {
        setSelectedSuggestion((prev) => prev - 1);
      } else if (
        e.key === "ArrowDown" &&
        selectedSuggestion < searchData.length - 1
      ) {
        setSelectedSuggestion((prev) => prev + 1);
      } else if (e.key === "Enter" && selectedSuggestion >= 0) {
        if (selectedSuggestion > -1) {
          // setSearchTerm(searchData[selectedSuggestion].name);
          handleSuggestionClick(searchData[selectedSuggestion]._id);
          hideResultSection();
        }
      } else if (e.key === "Escape") {
        hideResultSection();
      }
    } else {
      setSelectedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setShowResult(false);
  };
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    let action: ReturnType<typeof dispatch<any>>;
    const searchUserFunc = async () => {
      action = dispatch(
        searchUser({ searchTerm: debouncedSearch.toLowerCase() })
      );
    };
    if (debouncedSearch && debouncedSearch.length > 0) {
      searchUserFunc();
    }
    return () => action?.abort();
  }, [debouncedSearch]);

  return (
    <>
      <div className=" w-full h-full flex flex-col items-center ">
        <div className="flex w-full h-full items-center">
          <AiOutlineArrowLeft
            className={`md:hidden text-2xl ${
              showSearchBar ? "block " : "hidden"
            }`}
            onClick={() => {
              setShowResult(false);
              toggleSearchBar(false);
            }}
          />
          <div
            className={`w-full h-full relative focus-within:w-full flex justify-end items-center md:border-[2.2px] ${
              showSearchBar ? " border" : ""
            } rounded-[1.2rem] md:border-gray-100 focus-within:border-gray-300 text-gray-500 focus-within:text-slate-500 font-semibold md:bg-gray-50/70`}
          >
            <HiSearch
              className="h-5 w-5 mx-1 cursor-pointer hover:text-gray-800  border-transparent"
              onClick={() => toggleSearchBar(true)}
            />
            <form
              className={`w-full ${
                showSearchBar ? "flex" : "hidden md:flex"
              } items-center px-2`}
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                className="outline-none border-l-[2.3px] border-gray-100 focus-within:border-gray-200  px-2 w-full py-1.5 bg-transparent"
                onKeyUp={handleKey}
                onFocus={showResultSection}
                // onBlur={hideResultSection}
              />
            </form>
          </div>

          {/* serach result */}
          {searchTerm && showResult && (
            <SearchResult
              selectedSuggestion={selectedSuggestion}
              suggestions={searchData}
              onSelect={handleSuggestionClick}
              highLightText={searchTerm}
              loading={searchLoading}
              isFullScreen={showSearchBar}
              hideResult={() => setShowResult(false)}
            />
          )}
        </div>
      </div>
    </>
  );
});

Search.displayName = "Search";

export default Search;
