import { AiFillHome, AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import { FaFacebookMessenger, FaUserFriends } from "react-icons/fa";
import { LiaFacebookMessenger } from "react-icons/lia";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { NavigationTabs, Search, SmMenu } from "@components/index";
import { useLocation } from "react-router-dom";
import { HiOutlineUserAdd, HiUserAdd } from "react-icons/hi";
import { IoMdPeople } from "react-icons/io";

const tabs: {
  to: string;
  activeIcon: ReactNode;
  notActiveIcon: ReactNode;
}[] = [
  {
    to: "/",
    activeIcon: <AiFillHome />,
    notActiveIcon: <AiOutlineHome />,
  },
  {
    to: "/find-friend",
    activeIcon: <HiUserAdd />,
    notActiveIcon: <HiOutlineUserAdd />,
  },
  {
    to: "/friends",
    activeIcon: <FaUserFriends />,
    notActiveIcon: <IoMdPeople />,
  },
  {
    to: "/chat",
    activeIcon: <FaFacebookMessenger />,
    notActiveIcon: <LiaFacebookMessenger />,
  },
];

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const toggleSearchBar = useCallback((val: boolean) => {
    setShowSearchBar(val);
  }, []);
  const location = useLocation();
  const isProfilePath = useMemo(
    () => location.pathname.includes("/profile"),
    [location]
  );

  return (
    <div className=" flex flex-col justify-center md:px-3 sticky top-0 left-0 right-0 z-50 pt-2 md:py-1 gap-y-2  bg-white shadow-sm w-full ">
      {/* sm mode */}
      <div className="flex flex-col  items-center gap-y-2">
        <div className="flex justify-between items-center justify-self-end   gap-x-2 w-full py-1">
          <h1
            className={` pl-1 text-blue-600 font-extrabold text-xl sm:text-2xl font-serif  md:flex-1 max-w-[240px] xl:max-w-[300px] ${
              showSearchBar && "hidden md:block"
            }`}
          >
            friendsBook
          </h1>

          <div className="relative flex md:flex-[3] items-center  justify-end md:justify-evenly  gap-x-1 sm:gap-x-3 w-full h-full ">
            <div className="md:h-8 w-full h-full overflow-hidden flex justify-evenly md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] ">
              <Search
                showSearchBar={showSearchBar}
                toggleSearchBar={toggleSearchBar}
              />
            </div>
          </div>
          <div
            className={`flex justify-end md:justify-evenly md:flex-1 md:hidden ${
              showSearchBar && "hidden "
            }`}
          >
            <span
              className="cursor-pointer hover:bg-slate-600 hover:text-white px-1 py-0.5 md:hidden"
              onClick={() => setMenu(true)}
            >
              <AiOutlineMenu className=" text-[25px]" />
            </span>
          </div>
        </div>
        {!isProfilePath && !showSearchBar && <NavigationTabs tabs={tabs} />}
      </div>
      {menu && <SmMenu menuStatus={menu} closeMenu={() => setMenu(false)} />}
    </div>
  );
};

export default Navbar;
