import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  tabs: {
    to: string;
    label: string;
    activeIcon: ReactNode;
    notActiveIcon: ReactNode;
  }[];
};

const base =
  "flex items-center justify-center rounded-lg px-3 py-1.5 text-2xl transition-colors";

const NavigationTabs = React.memo(({ tabs }: Props) => {
  return (
    <div className="flex w-full max-w-md items-center justify-between sm:justify-center sm:gap-x-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          aria-label={tab.label}
          className={({ isActive }) =>
            `${base} ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`
          }
        >
          {({ isActive }) => (isActive ? tab.activeIcon : tab.notActiveIcon)}
        </NavLink>
      ))}
    </div>
  );
});

NavigationTabs.displayName = "NavigationTabs";

export default NavigationTabs;
