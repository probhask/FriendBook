import { NavLink } from "react-router-dom";
import { ProfilePreview, MenuItems } from "@components/index";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import React from "react";
import { logout } from "@redux/AsyncFunctions/authAsync";
import { IoLogOut } from "react-icons/io5";

const isNotActiveStyle = " ";

const isActiveStyle = "  text-blue-600  bg-gray-100 ";

type Props = {
  smClose?: () => void;
};

const Menu = React.memo(({ smClose }: Props) => {
  const auth = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col font-semibold  justify-center items-center">
      <NavLink
        to={`/profile/${auth._id}`}
        className={({ isActive }) =>
          ` w-full py-2 pl-7 md:pl-3 cursor-pointer  hover:bg-gray-400 border-b shadow-sm ${
            isActive ? isActiveStyle : isNotActiveStyle
          }`
        }
      >
        <ProfilePreview
          user={auth}
          isLoggedIn={auth.isLoggedIn}
          imageSize={30}
          navigateTo={""}
          onclick={smClose}
        />
      </NavLink>

      <div className="flex flex-col w-full">
        {MenuItems.map((item, index) => (
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex gap-x-1.5  w-full hover:bg-gray-400 py-5 pl-8 md:pl-4 ${
                isActive ? isActiveStyle : isNotActiveStyle
              }`
            }
            key={index}
            onClick={smClose}
          >
            <span className={`text-[1.4rem]`}> {item.icons}</span>
            <span>{item.text}</span>
          </NavLink>
        ))}

        <div
          className="flex w-full rounded-lg cursor-pointer  hover:bg-gray-400 py-5 pl-8 md:pl-4"
          onClick={() => dispatch(logout())}
        >
          <span className={`text-[1.2rem] mr-2`}>
            {" "}
            <IoLogOut />
          </span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
});

Menu.displayName = "Menu";
export default Menu;
