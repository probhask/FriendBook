import { Outlet } from "react-router-dom";
import { LeftBar, Navbar, RightBar } from "../components";

const HomeLayout = () => {
  return (
    <div className="w-full min-h-dvh box-border relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:left-2 focus:top-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow"
      >
        Skip to content
      </a>
      <Navbar />
      <div className="flex w-full relative">
        <LeftBar />
        <main
          id="main-content"
          className="flex lg:flex-[4] sm:flex-[3] w-full md:px-4 lg:px-6 md:py-2 bg-blue-50 justify-center text-xl box-border relative below-nav overflow-y-auto"
        >
          <div className="w-full h-full max-w-[900px]">
            <Outlet />
          </div>
        </main>
        <RightBar />
      </div>
    </div>
  );
};

export default HomeLayout;
