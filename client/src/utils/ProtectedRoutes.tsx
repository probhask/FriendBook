import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthChecked, getAuthLoginStatus } from "@redux/slice/authSlice";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { Navigate, useLocation } from "react-router-dom";

const publicRoutes = ["/login", "/register"];

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAppSelector(getAuthLoginStatus);
  const authChecked = useAppSelector(getAuthChecked);
  const location = useLocation();

  // Wait for the boot-time session check before deciding where to send anyone.
  if (!authChecked) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <BiLoaderCircle className="size-10 md:size-16 animate-spin text-blue-700" />
      </div>
    );
  }

  const onPublicRoute = publicRoutes.includes(location.pathname);

  if (!isLoggedIn && !onPublicRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isLoggedIn && onPublicRoute) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoutes;
