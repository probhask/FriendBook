import { Button } from "@components/index";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const EditProfile = React.memo(() => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 bg-white flex justify-center">
      <Button
        text={
          <span className="flex gap-x-5 w-full justify-center items-center">
            Ediit Profile
            <AiFillEdit fontSize={20} />
          </span>
        }
        className=" mx-auto max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%] h-fit py-1.5  bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-500 hover:text-white text-sm font-semibold rounded-lg self-center"
        type="button"
        onclickAction={() => navigate("../edit-personal-info")}
      />
    </div>
  );
});

EditProfile.displayName = "EditProfile";

export default EditProfile;
