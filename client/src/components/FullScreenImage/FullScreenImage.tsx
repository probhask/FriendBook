import React, { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { imgUrl } from "@utils/sanityClient";

const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

const FullScreenImage = React.memo(() => {
  const { src } = useParams<{ src: string }>();
  const decodedUrl = decodeURIComponent(src ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div
      className="w-dvw h-dvh bg-black/95 flex justify-center items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      {decodedUrl && isVideo(decodedUrl) ? (
        <video
          src={decodedUrl}
          controls
          autoPlay
          playsInline
          className="max-w-[92%] max-h-[92%]"
        />
      ) : (
        <img
          src={imgUrl(decodedUrl, 1400) || decodedUrl}
          alt="Full screen media"
          className="max-w-[92%] max-h-[92%]"
        />
      )}

      <button
        type="button"
        aria-label="close viewer"
        className="absolute top-4 right-3 text-white text-3xl md:text-4xl"
        onClick={() => navigate(-1)}
      >
        <AiFillCloseCircle />
      </button>
    </div>
  );
});

FullScreenImage.displayName = "FullScreenImage";

export default FullScreenImage;
