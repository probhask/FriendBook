import { forwardRef } from "react";
import { StoriesType } from "../../types";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { imgUrl } from "@utils/sanityClient";

type Props = { story: StoriesType };

const Stories = forwardRef<HTMLButtonElement, Props>(({ story }: Props, ref) => {
  const navigate = useNavigate();
  const isVideo = story.mediaType === "video" && story.video;
  const target = isVideo ? story.video! : story.media;

  return (
    <button
      type="button"
      ref={ref}
      aria-label={`View ${story.postedBy?.name || "friend"}'s story`}
      className="relative flex justify-center items-center w-[7rem] shrink-0 h-[10rem] md:h-[11rem] bg-slate-900 overflow-hidden rounded-lg"
      onClick={() => navigate(`/full-screen/${encodeURIComponent(target)}`)}
    >
      {story.media ? (
        <img
          src={imgUrl(story.media, 240)}
          alt=""
          loading="lazy"
          className="min-w-full min-h-full object-cover"
        />
      ) : (
        <div className="min-w-full min-h-full bg-slate-800" />
      )}

      {isVideo && (
        <span className="absolute inset-0 flex items-center justify-center text-white/90 text-2xl">
          <FaPlay />
        </span>
      )}

      <span className="absolute top-1 left-1 size-8 overflow-hidden rounded-full border-[3.5px] border-blue-700">
        {story.postedBy?.profileImage && (
          <img
            src={imgUrl(story.postedBy.profileImage, 64)}
            alt={story.postedBy?.name || ""}
            className="min-w-full min-h-full object-cover"
          />
        )}
      </span>

      <span className="absolute bottom-1 left-1 text-sm font-semibold text-white truncate max-w-[6rem]">
        {story.postedBy?.name}
      </span>
    </button>
  );
});
Stories.displayName = "Stories";

export default Stories;
