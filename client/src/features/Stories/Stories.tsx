import { forwardRef } from "react";
import { StoriesType } from "../../types";
import { useNavigate } from "react-router-dom";

type Props = { story: StoriesType };
const Stories = forwardRef<HTMLDivElement, Props>(({ story }: Props, ref) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative flex justify-center items-center w-[7rem] h-[10rem] md:h-[11rem] bg-slate-900 overflow-hidden rounded-lg"
      onClick={() =>
        navigate(`/full-screen/${encodeURIComponent(story.media)}`)
      }
      ref={ref}
    >
      <img
        src={story.media}
        alt=""
        className="min-w-full min-h-full object-cover"
      />
      <div className="absolute top-1 left-1 size-8 overflow-hidden rounded-full border-[3.5px] border-blue-700">
        <img
          src={story.postedBy?.profileImage}
          alt=""
          className="min-w-full min-h-full object-cover"
        />
      </div>

      <div className="absolute bottom-1 left-1 text-sm font-semibold text-white cursor-default">
        <span>{story.postedBy?.name}</span>
      </div>
    </div>
  );
});
export default Stories;
