import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

type Props = {
  file: File;
  onChange: (meta: { startSec: number; endSec: number }) => void;
};

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/** Pick a start/end window of an audio file, with a scoped preview. */
const AudioTrimmer = ({ file, onChange }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [url, setUrl] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const onLoaded = () => {
    const d = audioRef.current?.duration ?? 0;
    const dur = Number.isFinite(d) ? Math.floor(d) : 0;
    setDuration(dur);
    setStart(0);
    setEnd(Math.min(dur, 30));
  };

  useEffect(() => {
    onChange({ startSec: start, endSec: end });
  }, [start, end, onChange]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.currentTime >= end) {
        el.pause();
        el.currentTime = start;
        setPlaying(false);
      }
    };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [start, end]);

  const togglePreview = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.currentTime = start;
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
    <div className="flex flex-col gap-y-2 rounded-md border border-gray-200 p-3">
      <audio ref={audioRef} src={url} preload="metadata" onLoadedMetadata={onLoaded} />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="truncate max-w-[60%]">{file.name}</span>
        <button
          type="button"
          onClick={togglePreview}
          className="flex items-center gap-x-1 rounded-full bg-blue-600 px-3 py-1 text-white"
        >
          {playing ? <FaPause /> : <FaPlay />} preview
        </button>
      </div>

      {duration > 0 ? (
        <div className="flex flex-col gap-y-1">
          <label className="text-xs text-gray-500">
            Start: {fmt(start)}
            <input
              type="range"
              min={0}
              max={duration}
              value={start}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), end - 1);
                setStart(Math.max(0, v));
              }}
              className="w-full accent-blue-600"
            />
          </label>
          <label className="text-xs text-gray-500">
            End: {fmt(end)}
            <input
              type="range"
              min={0}
              max={duration}
              value={end}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), start + 1);
                setEnd(Math.min(duration, v));
              }}
              className="w-full accent-blue-600"
            />
          </label>
          <p className="text-xs text-gray-400">
            Clip length: {fmt(Math.max(0, end - start))}
          </p>
        </div>
      ) : (
        <p className="text-xs text-gray-400">Reading audio…</p>
      )}
    </div>
  );
};

export default AudioTrimmer;
