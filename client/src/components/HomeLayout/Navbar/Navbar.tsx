import { AiFillHome, AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import { FaFacebookMessenger, FaUserFriends } from "react-icons/fa";
import { LiaFacebookMessenger } from "react-icons/lia";
import { ReactNode, useState } from "react";
import { NavigationTabs, SmMenu } from "@components/index";
import { HiOutlineUserAdd, HiUserAdd } from "react-icons/hi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoMdPeople } from "react-icons/io";
import { Link } from "react-router-dom";

const tabs: {
  to: string;
  label: string;
  activeIcon: ReactNode;
  notActiveIcon: ReactNode;
}[] = [
  {
    to: "/",
    label: "Home",
    activeIcon: <AiFillHome />,
    notActiveIcon: <AiOutlineHome />,
  },
  {
    to: "/search",
    label: "Search",
    activeIcon: <HiMagnifyingGlass />,
    notActiveIcon: <HiMagnifyingGlass />,
  },
  {
    to: "/find-friend",
    label: "Find friends",
    activeIcon: <HiUserAdd />,
    notActiveIcon: <HiOutlineUserAdd />,
  },
  {
    to: "/friends",
    label: "Friends",
    activeIcon: <FaUserFriends />,
    notActiveIcon: <IoMdPeople />,
  },
  {
    to: "/chat",
    label: "Messenger",
    activeIcon: <FaFacebookMessenger />,
    notActiveIcon: <LiaFacebookMessenger />,
  },
];

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 flex items-center gap-x-2 bg-white px-3 py-2 shadow-sm">
      <Link
        to="/"
        className="shrink-0 font-serif text-xl font-extrabold text-blue-600 sm:text-2xl"
      >
        friendsBook
      </Link>

      <nav aria-label="Main" className="flex flex-1 justify-center">
        <NavigationTabs tabs={tabs} />
      </nav>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={menu}
        className="shrink-0 rounded-md p-1 text-[25px] text-gray-600 hover:bg-gray-100 md:hidden"
        onClick={() => setMenu(true)}
      >
        <AiOutlineMenu />
      </button>

      {menu && <SmMenu menuStatus={menu} closeMenu={() => setMenu(false)} />}
    </header>
  );
};

export default Navbar;
