import React, {
  ChangeEvent,
  DragEvent,
  FocusEvent,
  useRef,
  useState,
} from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { ACCEPT_IMAGE } from "@utils/supportedFormat";

type Props = {
  name: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  error: string | undefined;
  textLabel?: string;
  accept?: string;
  onDropSetValue?: (file: File) => void;
};

const FileInput = React.memo(
  ({
    onchange,
    onBlur,
    name,
    error,
    textLabel,
    accept = ACCEPT_IMAGE,
    onDropSetValue,
  }: Props) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectFile = () => {
      fileInputRef.current && fileInputRef.current.click();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;

      onDropSetValue && onDropSetValue(files[0]);
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
      <div className="select-none">
        <div className=" flex flex-col gap-y-1 text-gray-500 focus-within:text-gray-700">
          {textLabel && (
            <label htmlFor={name} className="font-bold">
              {textLabel}
            </label>
          )}
          <div
            role="button"
            tabIndex={0}
            aria-label={textLabel || "Upload a file"}
            className={`flex items-center justify-center gap-x-2 border px-3 py-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 cursor-pointer text-green-600 border-green-600 w-full ${
              isDragging ? "border-dashed border-4" : ""
            }`}
            onClick={selectFile}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectFile();
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            ref={wrapperRef}
          >
            <span className="w-full flex flex-col justify-center items-center">
              <IoMdCloudUpload fontSize={100} />
              <span>Drop a file here or click to browse</span>
            </span>
          </div>
          <input
            id={name}
            name={name}
            type="file"
            accept={accept}
            onChange={onchange}
            onBlur={onBlur}
            className="sr-only"
            ref={fileInputRef}
          />
        </div>
        {error && (
          <div className="px-2 text-xs font-semibold text-red-600 flex items-center gap-x-2 w-full py-0.5">
            <RiErrorWarningLine />
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default FileInput;
