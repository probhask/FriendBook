import { AiFillPlusCircle } from "react-icons/ai";
import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import {
  getStoriesData,
  getStoriesHasMore,
  getStoriesLoading,
} from "@redux/slice/storiesSlice";
import { getAuthData } from "@redux/slice/authSlice";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { getStories } from "@redux/AsyncFunctions/storiesAsync";
import Stories from "./Stories";
import { StoriesShimmer } from "@components/index";
import { imgUrl } from "@utils/sanityClient";
import { useNavigate } from "react-router-dom";

const StoriesConatiner = memo(() => {
  const storiesData = useAppSelector(getStoriesData);
  const storiesLoading = useAppSelector(getStoriesLoading);
  const storiesHasMore = useAppSelector(getStoriesHasMore);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserImage = useAppSelector(getAuthData)?.profileImage;
  const inFiniteScrolRef = useInfiniteScroll<HTMLButtonElement>({
    callback: () => dispatch(getStories()),
    hasMore: storiesHasMore,
    isLoading: storiesLoading,
  });

  useEffect(() => {
    const promise = dispatch(getStories());
    return () => promise.abort();
  }, [dispatch]);

  return (
    <section
      aria-label="Stories"
      className="flex items-center overflow-x-auto overflow-y-hidden no-scrollbar py-1 px-2 gap-x-2 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] min-h-[11rem] md:min-h-[12rem]"
    >
      <button
        type="button"
        onClick={() => navigate("/create-stories")}
        aria-label="Add to your story"
        className="relative flex justify-center items-center w-[7rem] shrink-0 h-[10rem] md:h-[11rem] bg-slate-900 overflow-hidden rounded-lg"
      >
        {currentUserImage && (
          <img
            src={imgUrl(currentUserImage, 240)}
            alt=""
            className="min-w-full min-h-full object-cover opacity-80"
          />
        )}
        <span className="absolute top-1 left-1">
          <AiFillPlusCircle className="text-white bg-blue-600 rounded-full text-4xl" />
        </span>
        <span className="absolute bottom-1 left-1 text-sm font-semibold text-white">
          Add to story
        </span>
      </button>

      {storiesData?.map((story, index) => {
        const isLast = storiesData.length === index + 1;
        return (
          <Stories
            story={story}
            key={story._id}
            ref={isLast ? inFiniteScrolRef : undefined}
          />
        );
      })}

      {storiesLoading && [1, 2].map((e) => <StoriesShimmer key={e} />)}
    </section>
  );
});

StoriesConatiner.displayName = "StoriesConatiner";

export default StoriesConatiner;
