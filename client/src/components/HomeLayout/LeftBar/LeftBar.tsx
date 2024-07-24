import { Menu } from "@components/index";
import React from "react";

const LeftBar = React.memo(() => {
  return (
    <div className=" hidden md:block flex-1 min-w-[185px] max-w-[240px] xl:max-w-[300px]  sticky top-[48px] h-[calc(100vh-48px)] overflow-y-auto text-slate-700 bg-white custom-scroll">
      <Menu />
    </div>
  );
});
LeftBar.displayName = "LeftBar";

export default LeftBar;
