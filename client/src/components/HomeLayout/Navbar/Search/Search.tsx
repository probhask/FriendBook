import React, { FormEvent, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  showSearchBar: boolean;
  toggleSearchBar: (val: boolean) => void;
};

const Search = React.memo(({ showSearchBar, toggleSearchBar }: Props) => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const go = (value: string) => {
    const q = value.trim();
    if (q.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    } else if (location.pathname === "/search") {
      navigate("/search");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(term);
  };

  return (
    <div className="w-full h-full flex items-center">
      {showSearchBar && (
        <button
          type="button"
          aria-label="Close search"
          className="md:hidden text-2xl px-1"
          onClick={() => toggleSearchBar(false)}
        >
          <AiOutlineArrowLeft />
        </button>
      )}
      <form
        onSubmit={onSubmit}
        className={`w-full ${
          showSearchBar ? "flex" : "hidden md:flex"
        } items-center gap-x-2 rounded-full border-2 border-gray-100 bg-gray-50/70 px-3 py-1.5 text-gray-500 focus-within:border-gray-300`}
      >
        <HiSearch
          className="h-5 w-5 shrink-0 cursor-pointer"
          onClick={() => toggleSearchBar(true)}
        />
        <input
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            go(e.target.value);
          }}
          onFocus={() => toggleSearchBar(true)}
          placeholder="Search people…"
          aria-label="Search people"
          className="w-full bg-transparent outline-none text-gray-800"
        />
      </form>
    </div>
  );
});

Search.displayName = "Search";

export default Search;
