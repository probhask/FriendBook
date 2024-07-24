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
import { useNavigate } from "react-router-dom";

const StoriesConatiner = memo(() => {
  const storiesData = useAppSelector(getStoriesData);
  const storiesLoading = useAppSelector(getStoriesLoading);
  const storiesHasMore = useAppSelector(getStoriesHasMore);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserImage = useAppSelector(getAuthData)?.profileImage;
  const inFiniteScrolRef = useInfiniteScroll({
    callback: () => dispatch(getStories()),
    hasMore: storiesHasMore,
    isLoading: storiesLoading,
  });

  useEffect(() => {
    const promise = dispatch(getStories());
    return () => promise.abort();
  }, []);
  // const inFiniteScrolRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex items-center overflow-x-auto overflow-y-hidden no-scrollbar py-1 px-2 gap-x-1 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] min-h-[195px] md:min-h-[210px]">
      <div className="relative flex justify-center items-center min-w-[7rem] max-w-[7rem] h-[10rem] md:h-[11rem] bg-slate-900 overflow-hidden rounded-lg">
        {currentUserImage ? (
          <img
            src={currentUserImage}
            alt="user-image"
            className="min-w-full min-h-full object-cover"
          />
        ) : (
          ""
        )}
        <div
          className="absolute top-1 left-1 cursor-pointer"
          onClick={() => navigate("/create-stories")}
        >
          <AiFillPlusCircle className="text-white bg-blue-600 rounded-full text-4xl hover:shadow-lg" />
        </div>

        <div className="absolute bottom-1 left-1 text-sm font-semibold text-gray-500 cursor-default">
          <span>Add to story</span>
        </div>
      </div>
      {/* <Stories story={story} key={index} /> */}

      {storiesData &&
        storiesData.map((story, index) => {
          if (storiesData.length === index + 1) {
            return <Stories story={story} ref={inFiniteScrolRef} key={index} />;
          }
          return <Stories story={story} key={index} />;
        })}

      {storiesLoading && [1, 2].map((e) => <StoriesShimmer key={e} />)}
    </div>
  );
});

export default StoriesConatiner;
