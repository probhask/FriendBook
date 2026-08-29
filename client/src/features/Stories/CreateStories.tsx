import { Button } from "@components/index";
import { createStory } from "@redux/AsyncFunctions/storiesAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getStoriesCreating } from "@redux/slice/storiesSlice";
import React, {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoMdCloudUpload } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Seo from "@components/Seo/Seo";
import { ACCEPT_IMAGE, SUPPORTED_FORMAT } from "@utils/supportedFormat";
import toast from "react-hot-toast";

const CreateStories = React.memo(() => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store image preview URL
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const creating = useAppSelector(getStoriesCreating);

  const selectFile = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const pickFile = useCallback((file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => pickFile(e.target.files?.[0]),
    [pickFile]
  );

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (!SUPPORTED_FORMAT.includes(selectedFile.type)) {
      setError("Unsupported image format");
      return;
    }
    try {
      await dispatch(createStory({ media: selectedFile })).unwrap();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "could not create story");
      toast.error("Could not create story");
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  };
  return (
    <div className="select-none w-full h-full bg-white px-2 md:px-5 pt-5">
      <Seo title="Create story" noIndex />
      <form
        onSubmit={handleFileSubmit}
        className=" flex flex-col gap-y-1 text-gray-500 focus-within:text-gray-700"
      >
        <label
          htmlFor={"stories"}
          className="font-bold w-full text-center mb-5"
        >
          Create Stories
        </label>
        {!selectedFile && (
          <div
            className={`flex items-center justify-center gap-x-2 border px-3 py-1.5 rounded-md  focus-within:border-[1.5px] cursor-pointer text-green-600 border-green-600 ${
              isDragging ? "border-dashed border-4" : ""
            }`}
            role="button"
            onClick={selectFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            ref={wrapperRef}
          >
            <span className="w-full flex flex-col justify-center items-center cursor-pointer ">
              <IoMdCloudUpload fontSize={100} />
              <span>Drop image here</span>
            </span>
            <input
              id="stories"
              name="stories"
              type="file"
              accept={ACCEPT_IMAGE}
              onChange={handleFileChange}
              className="bg-transparent outline-none w-0"
              ref={fileInputRef}
            />
          </div>
        )}
        {selectedFile && (
          <div className="relative mb-5 max-h-[300px] max-w-full overflow-hidden">
            <label className="font-bold text-gray-500">Image Preview</label>
            <img
              src={imagePreview || undefined}
              alt="Selected story preview"
              className="max-w-full max-h-full mt-2 object-contain"
            />
            <button
              type="button"
              aria-label="remove selected image"
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => {
                setSelectedFile(null);
                setImagePreview(null);
              }}
            >
              <AiFillCloseCircle />
            </button>
          </div>
        )}
        <Button
          type="submit"
          className={`w-full flex justify-center items-center px-2 py-1 mt-4 mb-1 bg-white border border-blue-600 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 hover:shadow-sm `}
          text="create post"
          disable={creating}
        />
      </form>
      {error && (
        <div className="px-2 text-xs font-semibold text-red-600 flex items-center gap-x-2 w-full py-0.5">
          <RiErrorWarningLine />
          {error}
        </div>
      )}
    </div>
  );
});

CreateStories.displayName = "CreateStories";

export default CreateStories;
