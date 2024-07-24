import { Outlet } from "react-router-dom";
import React from "react";

const Profile = React.memo(() => {
  return (
    <div className="w-full min-h-full rounded-lg">
      <Outlet />
    </div>
  );
});

Profile.displayName = "Profile";

export default Profile;
