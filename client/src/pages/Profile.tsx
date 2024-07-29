import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";

const Profile = React.memo(() => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <div className="w-full min-h-full rounded-lg">
      <Outlet />
    </div>
  );
});

Profile.displayName = "Profile";

export default Profile;
