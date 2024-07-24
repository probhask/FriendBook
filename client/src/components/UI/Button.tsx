import React, { HTMLProps, memo } from "react";
import { AiOutlineLoading } from "react-icons/ai";

type Props = {
  type: "submit" | "reset" | "button" | undefined;
  onclickAction?: () => void;
  text: React.ReactNode;
  className: HTMLProps<HTMLElement>["className"];
  disable?: boolean;
};
const Button = memo(
  ({ onclickAction, text, type, className, disable }: Props) => {
    return (
      <button
        type={type}
        className={`${className} w-full`}
        onClick={onclickAction}
        disabled={disable}
      >
        {disable ? <AiOutlineLoading className="animate-spin" /> : text}
      </button>
    );
  }
);

export default Button;
