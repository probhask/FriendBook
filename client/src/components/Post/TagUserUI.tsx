import { useAppSelector } from "@redux/hooks/storeHook";
import { getAuthData } from "@redux/slice/authSlice";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  tagUser: { _id: string; name: string };
  totalTagUser: number;
};

const TagUserUI = React.memo(({ tagUser, totalTagUser }: Props) => {
  const navigate = useNavigate();
  const authId = useAppSelector(getAuthData)._id;

  return (
    <span className="flex text-xs font-bold mb-5 text-slate-800 flex-nowrap text-nowrap">
      <span className="text-gray-600">tags</span>
      <span
        onClick={() => navigate(`/profile/${tagUser._id}`)}
        className="cursor-pointer mx-1"
      >
        {authId === tagUser._id ? "You" : tagUser.name}
      </span>
      {totalTagUser > 1 && (
        <p>
          {" "}
          <span className="text-gray-600">and</span>
          <span> {totalTagUser > 1 && totalTagUser - 0} </span> others
        </p>
      )}
    </span>
  );
});

TagUserUI.displayName = "TagUserUI";

export default TagUserUI;
