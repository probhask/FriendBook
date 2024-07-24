import { Button } from "@components/index";
import { createStory } from "@redux/AsyncFunctions/storiesAsync";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getStoriesCreating } from "@redux/slice/storiesSlice";
import React, {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoMdCloudUpload } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

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
  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Generate image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);
  const handleFileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile) {
      dispatch(createStory({ media: selectedFile }))
        .catch((error) => setError(error))
        .finally(() => navigate("/"));
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    setSelectedFile(files[0]);
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
              name="string"
              type="file"
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
              src={imagePreview || URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="max-w-full max-h-full mt-2 object-contain"
            />
            <AiFillCloseCircle
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setSelectedFile(null)}
            />
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
          error
        </div>
      )}
    </div>
  );
});

CreateStories.displayName = "CreateStories";

export default CreateStories;
