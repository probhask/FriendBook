import { Outlet } from "react-router-dom";
import { LeftBar, Navbar, RightBar } from "../components";

const HomeLayout = () => {
  return (
    <div className="w-full h-full box-border relative ">
      <Navbar />
      <div className="flex w-full relative">
        <LeftBar />
        <div
          className={`flex lg:flex-[4] sm:flex-[3] w-full  md:px-4 lg:px-6 md:py-2 bg-blue-50  justify-center text-xl  box-border relative min-h-[calc(100vh-102px)] md:min-h-[calc(100vh-52px)] overflow-y-auto `}
          id="mainDiv "
        >
          <div className="w-full h-full max-w-[900px]">
            {" "}
            <Outlet />
          </div>
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default HomeLayout;
