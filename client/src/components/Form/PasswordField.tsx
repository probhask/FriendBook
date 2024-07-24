import React, { ChangeEvent, useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineLock } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";

type Props = {
  name: string;
  placeHolder: string;
  value: string | number;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: any) => void;
  error: string | undefined;
};

const PasswordField = React.memo(
  ({ onchange, name, onBlur, placeHolder, value, error }: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-x-0.5 md:gap-x-2 border px-1 md:px-3 py-0.5 md:py-1.5 rounded-md text-gray-500 focus-within:border-gray-700 focus-within:border-[1.5px] focus-within:text-gray-700 w-full">
          <label
            htmlFor={name}
            className="flex justify-center items-center w-9"
          >
            <AiOutlineLock />
          </label>
          <input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onchange}
            placeholder={placeHolder}
            className="bg-transparent outline-none w-full"
            onBlur={onBlur}
          />
          <div className="cursor-pointer w-fit flex items-center justify-center">
            {showPassword ? (
              <AiFillEye onClick={() => setShowPassword(false)} />
            ) : (
              <AiFillEyeInvisible onClick={() => setShowPassword(true)} />
            )}
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

export default PasswordField;
