import { Menu } from "@components/index";
import useDetectOutSideClick from "@hooks/useDetectOutSideClick";
import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

type Props = {
  menuStatus: boolean;
  closeMenu: () => void;
};

const SmMenu = React.memo(({ menuStatus, closeMenu }: Props) => {
  const closeRef = useDetectOutSideClick<HTMLDivElement>(closeMenu);
  return (
    <div
      className={`md:hidden absolute top-0 right-0 w-svw h-svh   flex justify-end ${
        menuStatus ? "animate-slide-in-right" : "animate-slide-out-right"
      }`}
    >
      <div
        className="relative bg-white w-full sm:w-[70%] h-full"
        ref={closeRef}
      >
        <Menu smClose={closeMenu} />
        <AiFillCloseCircle
          className="text-2xl absolute top-4 right-0.5 sm:right-2 cursor-pointer"
          onClick={closeMenu}
        />
      </div>
    </div>
  );
});

export default SmMenu;
