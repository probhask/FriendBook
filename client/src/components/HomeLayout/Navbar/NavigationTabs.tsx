import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  tabs: {
    to: string;
    activeIcon: ReactNode;
    notActiveIcon: ReactNode;
  }[];
};

const isNotActiveStyle =
  "  flex justify-center items-center size-[35px] sm:size-[40px] pb-2 px-1";

const isActiveStyle =
  " flex justify-center items-center size-[35px] sm:size-[40px] pb-2 px-1 text-blue-600 border-b-2 border-b-blue-600";

const NavigationTabs = React.memo(({ tabs }: Props) => {
  return (
    <div className="flex md:hidden justify-center items-center text-gray-400 text-2xl md:text-3xl flex-[2] w-full">
      <div className="flex justify-evenly gap-x-4 sm:gap-x-8 md:gap-x-8 lg:gap-x-16 w-full">
        {tabs.map((tab, index) => (
          <NavLink
            to={tab.to}
            key={index}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
          >
            {({ isActive }) => (isActive ? tab.activeIcon : tab.notActiveIcon)}
          </NavLink>
        ))}
      </div>
    </div>
  );
});

NavigationTabs.displayName = "NavigationTabs";

export default NavigationTabs;
