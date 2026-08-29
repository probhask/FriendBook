import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import useInViewport from "@hooks/useInViewport";
import { imgUrl } from "@utils/sanityClient";
import AudioImagePlayer from "./AudioImagePlayer";
import type { MediaType, AudioMeta } from "types";

type Props = {
  mediaType?: MediaType;
  image?: string;
  video?: string | null;
  audio?: string | null;
  audioMeta?: AudioMeta | null;
  alt?: string;
  /** When true, a click on an image opens the full-screen viewer. */
  enableFullScreen?: boolean;
};

const wrapperClass =
  "w-full flex justify-center items-center overflow-hidden bg-gray-100 rounded-md max-h-[70vh] min-h-[12rem]";

const FeedVideo = ({ src, poster }: { src: string; poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInViewport<HTMLDivElement>(0.6);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView]);

  return (
    <div ref={ref} className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="min-w-full min-h-full object-contain object-center"
      />
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "unmute video" : "mute video"}
        className="absolute bottom-2 right-2 flex items-center justify-center size-9 rounded-full bg-black/55 text-white"
      >
        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
    </div>
  );
};

const PostMedia = ({
  mediaType = "image",
  image,
  video,
  audio,
  audioMeta,
  alt,
  enableFullScreen,
}: Props) => {
  const navigate = useNavigate();

  let inner;
  if (mediaType === "video" && video) {
    inner = <FeedVideo src={video} poster={imgUrl(image || undefined, 900)} />;
  } else if (mediaType === "audioImage" && audio && image) {
    inner = (
      <AudioImagePlayer
        image={image}
        audio={audio}
        audioMeta={audioMeta}
        alt={alt}
      />
    );
  } else if (image) {
    const img = (
      <img
        src={imgUrl(image, 900)}
        alt={alt || ""}
        loading="lazy"
        className="min-w-full min-h-full object-contain object-center"
      />
    );
    inner = enableFullScreen ? (
      <button
        type="button"
        className="w-full h-full"
        aria-label="open image full screen"
        onClick={() =>
          navigate(`/full-screen/${encodeURIComponent(image)}`)
        }
      >
        {img}
      </button>
    ) : (
      img
    );
  } else {
    return null;
  }

  return <div className={wrapperClass}>{inner}</div>;
};

export default PostMedia;
