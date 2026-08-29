import { FileInput } from "@components/index";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";

type Props = {
  formikSetValue: (name: string, value: File) => void;
  error: string;
  onBlurEvent: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  textLabel: string;
};

const DragDropFile = React.memo(
  ({ formikSetValue, error, onBlurEvent, name, textLabel }: Props) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store image preview URL

    const setFileWithPreview = useCallback(
      (file: File) => {
        setSelectedFile(file);
        formikSetValue("image", file);
        setImagePreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(file);
        });
      },
      [formikSetValue]
    );

    const onDropSetValues = useCallback(
      (file: File) => setFileWithPreview(file),
      [setFileWithPreview]
    );

    const handleFileChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setFileWithPreview(e.target.files[0]);
        }
      },
      [setFileWithPreview]
    );

    useEffect(() => {
      return () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
      };
    }, [imagePreview]);

    return (
      <>
        {!selectedFile && (
          <FileInput
            name={name}
            textLabel={textLabel}
            onDropSetValue={onDropSetValues}
            onchange={handleFileChange}
            error={""}
            onBlur={onBlurEvent}
          />
        )}
        {/* Display image preview */}
        {selectedFile && (
          <div className="relative mb-5 max-h-[200px] overflow-hidden">
            <label className="font-bold text-gray-500">Image Preview</label>
            <img
              src={imagePreview || undefined}
              alt="Selected image preview"
              className="min-w-full max-h-full mt-2 object-contain"
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
        {error && (
          <div className="px-2 text-xs font-semibold text-red-600 flex items-center gap-x-2 w-full py-0.5">
            <RiErrorWarningLine />
            {error}
          </div>
        )}
      </>
    );
  }
);

DragDropFile.displayName = "DragDropFile";

export default DragDropFile;
