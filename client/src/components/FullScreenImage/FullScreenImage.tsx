import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";

const FullScreenImage = React.memo(() => {
  const { src } = useParams<{ src: string }>();
  const decodedUrl = decodeURIComponent(src as string);
  const navigate = useNavigate();

  return (
    <div className=" w-svw h-svh bg-black/95 flex justify-center items-center ">
      <img
        src={decodedUrl}
        alt="full screen"
        className="max-w-[90%] max-h-[90%] "
      />

      <div
        className="absolute top-4 right-2 cursor-pointer "
        onClick={() => navigate(-1)}
      >
        <AiFillCloseCircle className="text-white text-2xl md:text-4xl " />
      </div>
    </div>
  );
});

FullScreenImage.displayName = "FullScreenImage";

export default FullScreenImage;
