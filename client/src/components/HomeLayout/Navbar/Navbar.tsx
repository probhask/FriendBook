import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { SmMenu } from "@components/index";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-center bg-white px-3 py-2.5 shadow-sm">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={menu}
        className="absolute left-3 rounded-md p-1 text-[24px] text-gray-600 hover:bg-gray-100 md:hidden"
        onClick={() => setMenu(true)}
      >
        <AiOutlineMenu />
      </button>

      <Link
        to="/"
        className="font-serif text-xl font-extrabold text-blue-600 sm:text-2xl"
      >
        friendsBook
      </Link>

      {menu && <SmMenu menuStatus={menu} closeMenu={() => setMenu(false)} />}
    </header>
  );
};

export default Navbar;
