import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthLoginStatus } from "@redux/slice/authSlice";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAppSelector(getAuthLoginStatus);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (
    (isLoggedIn && location.pathname === "/login") ||
    location.pathname === "/register"
  ) {
    return <Navigate to="/" replace />;
  } else {
    return <>{children}</>;
  }
};

export default ProtectedRoutes;
