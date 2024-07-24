import React, { ChangeEvent, FocusEvent, ReactNode } from "react";
import { RiErrorWarningLine } from "react-icons/ri";

type Props = {
  icon?: ReactNode;
  name: string;
  placeHolder: string;
  value: string | number;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  error: string | undefined;
  textLabel?: string;
  border?: boolean;
  autoComplete?: "on" | "off";
};

const InputField = React.memo(
  ({
    onchange,
    onBlur,
    icon,
    name,
    placeHolder,
    value,
    error,
    textLabel,
    border = true,
    autoComplete,
  }: Props) => {
    return (
      <div className="w-full">
        <div className=" flex flex-col gap-y-1 text-gray-500 focus-within:text-gray-700">
          {textLabel && (
            <label htmlFor={name} className="font-bold">
              {textLabel}
            </label>
          )}
          <div
            className={`flex items-center gap-x-2 px-3 py-1 rounded-md  ${
              border &&
              "border focus-within:border-gray-700 focus-within:border-[1.5px]  "
            } `}
          >
            {icon && (
              <label htmlFor={name} className="min-w-4">
                {icon}
              </label>
            )}
            <input
              id={name}
              autoComplete={autoComplete}
              name={name}
              type="text"
              value={value}
              onChange={onchange}
              placeholder={placeHolder}
              onBlur={onBlur}
              className="bg-transparent outline-none w-full"
            />
          </div>
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

export default InputField;
