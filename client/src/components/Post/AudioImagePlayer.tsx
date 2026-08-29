import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { HiMusicalNote } from "react-icons/hi2";
import useInViewport from "@hooks/useInViewport";
import { imgUrl } from "@utils/sanityClient";
import type { AudioMeta } from "types";

type Props = {
  image: string;
  audio: string;
  audioMeta?: AudioMeta | null;
  alt?: string;
};

/** A still image with a trimmed audio track that loops while playing. */
const AudioImagePlayer = ({ image, audio, audioMeta, alt }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const { ref, inView } = useInViewport<HTMLDivElement>(0.6);

  const start = Math.max(0, audioMeta?.startSec ?? 0);
  const end = audioMeta?.endSec && audioMeta.endSec > start ? audioMeta.endSec : undefined;

  // Keep playback inside the trimmed window.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (end !== undefined && el.currentTime >= end) el.currentTime = start;
    };
    const onLoaded = () => {
      if (el.currentTime < start) el.currentTime = start;
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [start, end]);

  // Pause when scrolled out of view.
  useEffect(() => {
    if (!inView && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [inView]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.currentTime < start || (end !== undefined && el.currentTime >= end)) {
        el.currentTime = start;
      }
      el.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full h-full">
      <img
        src={imgUrl(image, 900)}
        alt={alt || ""}
        loading="lazy"
        className="min-w-full min-h-full object-contain object-center"
      />
      <audio ref={audioRef} src={audio} loop preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "pause audio" : "play audio"}
        aria-pressed={playing}
        className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors"
      >
        <span className="flex items-center justify-center size-14 rounded-full bg-black/55 text-white text-xl backdrop-blur">
          {playing ? <FaPause /> : <FaPlay className="ml-1" />}
        </span>
      </button>

      {audioMeta?.trackName && (
        <div className="absolute bottom-2 left-2 flex items-center gap-x-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white">
          <HiMusicalNote className={playing ? "animate-pulse" : ""} />
          <span className="max-w-[12rem] truncate">{audioMeta.trackName}</span>
        </div>
      )}
    </div>
  );
};

export default AudioImagePlayer;
