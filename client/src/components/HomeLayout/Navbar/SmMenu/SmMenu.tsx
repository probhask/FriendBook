import { Menu } from "@components/index";
import useDetectOutSideClick from "@hooks/useDetectOutSideClick";
import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  menuStatus: boolean;
  closeMenu: () => void;
};

const SmMenu = React.memo(({ closeMenu }: Props) => {
  const panelRef = useDetectOutSideClick<HTMLDivElement>(closeMenu);

  // Close on Escape, lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [closeMenu]);

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-black/40 md:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        className="relative h-full w-[78%] max-w-xs animate-slide-in-left overflow-y-auto bg-white shadow-xl"
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="absolute right-2 top-3 z-10 rounded-full p-1 text-2xl text-gray-500 hover:bg-gray-100"
        >
          <AiOutlineClose />
        </button>
        <Menu smClose={closeMenu} />
      </div>
    </div>
  );
});

SmMenu.displayName = "SmMenu";

export default SmMenu;
