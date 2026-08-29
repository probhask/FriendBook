import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { FiUserX } from "react-icons/fi";
import Seo from "@components/Seo/Seo";
import {
  EmptyState,
  ErrorState,
  ProfileImage,
  RowsSkeleton,
} from "@components/index";
import useCustomDebounce from "@hooks/useCustomDebounce";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { searchUser } from "@redux/AsyncFunctions/searchAsync";
import {
  clearSearch,
  selectSearchedUser,
  selectSearchError,
  selectSearchLoading,
} from "@redux/slice/SearchSlice";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const debounced = useCustomDebounce(term.trim(), 400);

  const dispatch = useAppDispatch();
  const results = useAppSelector(selectSearchedUser);
  const loading = useAppSelector(selectSearchLoading);
  const error = useAppSelector(selectSearchError);

  useEffect(() => {
    setParams(debounced ? { q: debounced } : {}, { replace: true });
    if (debounced.length < 2) {
      dispatch(clearSearch());
      return;
    }
    const promise = dispatch(searchUser({ searchTerm: debounced }));
    return () => promise.abort();
  }, [debounced, dispatch, setParams]);

  const retry = () => dispatch(searchUser({ searchTerm: debounced }));

  return (
    <div className="w-full bg-white md:rounded-2xl min-h-full px-3 sm:px-6 py-5">
      <Seo title="Search" noIndex />
      <h1 className="mb-4 text-xl font-bold text-gray-800">Search people</h1>

      <div className="flex items-center gap-x-2 rounded-xl border-2 border-gray-200 px-3 py-2 focus-within:border-blue-500">
        <HiSearch className="text-xl text-gray-400" />
        <input
          autoFocus
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Name or city…"
          aria-label="Search people"
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="mt-4">
        {loading && <RowsSkeleton rows={6} />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && debounced.length >= 2 && results.length === 0 && (
          <EmptyState
            icon={<FiUserX />}
            title="No people found"
            description={`Nothing matched “${debounced}”. Try another name or city.`}
          />
        )}

        {!loading && !error && debounced.length < 2 && (
          <EmptyState
            icon={<HiSearch />}
            title="Find friends"
            description="Type at least 2 characters to search by name or city."
          />
        )}

        {!loading && !error && results.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {results.map((user) => (
              <li key={user._id}>
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-x-3 rounded-lg px-2 py-3 hover:bg-gray-50"
                >
                  <ProfileImage
                    size={44}
                    navigateTo=""
                    userProfileImage={user.profileImage}
                    isLoggedIn={user.isLoggedIn}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-800">
                      {user.name}
                    </p>
                    {user.city && (
                      <p className="truncate text-sm text-gray-500">
                        {user.city}
                      </p>
                    )}
                  </div>
                  <span className="ml-auto text-sm font-semibold text-blue-600">
                    View
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
