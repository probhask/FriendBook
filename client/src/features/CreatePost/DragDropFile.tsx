import { FileInput } from "@components/index";
import React, { ChangeEvent, useCallback, useState } from "react";
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

    const onDropSetValues = useCallback((file: File) => {
      setSelectedFile(file);
      formikSetValue("image", file);
    }, []);

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setSelectedFile(file);
        formikSetValue("image", file);
        // Generate image preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }, []);

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
              src={imagePreview || URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="min-w-full max-h-full mt-2 object-contain"
            />
            <AiFillCloseCircle
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setSelectedFile(null)}
            />
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
