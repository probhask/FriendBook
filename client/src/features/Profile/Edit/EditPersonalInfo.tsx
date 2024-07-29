import React from "react";
import { Button, InputField } from "@components/index";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { getDetailUserData } from "@redux/slice/detailUserSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { IoPersonOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import {
  AiFillInfoCircle,
  AiOutlineCloseCircle,
  AiOutlineHome,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { updatePersonalInfo } from "@redux/AsyncFunctions/userDetailAsyc";

const EditPersonalInfo = React.memo(() => {
  const detailUser = useAppSelector(getDetailUserData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const editProfileFormik = useFormik({
    initialValues: {
      email: detailUser.email,
      name: detailUser.name,
      city: detailUser.city,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .trim()
        .min(13, "Must conatin min 13 characters")
        .required("Required"),
      name: Yup.string()
        .trim()
        .min(5, "Must conatin min 5 characters")
        .max(15, "Must be 15 characters or less")
        .required(),
      city: Yup.string()
        .trim()
        .min(4, "Must conatin min 4 characters")
        .max(15, "Must be 15 characters or less")
        .required(),
    }),

    onSubmit: (values) => {
      if (
        values.email === detailUser.email &&
        values.name === detailUser.name &&
        values.city === detailUser.city
      ) {
        toast.success("All values are same", {
          className: "bg-gray-300",
          icon: <AiFillInfoCircle />,
        });
        // return;
      }
      // console.log(values);

      dispatch(
        updatePersonalInfo({
          city: values.city,
          name: values.name,
          email: values.email,
        })
      );
    },
  });

  return (
    <div className="w-full h-full bg-white relative">
      <h1 className="text-center my-4 font-bold">Edit</h1>
      <span className="absolute top-4 right-4 hover:text-2xl cursor-pointer">
        <AiOutlineCloseCircle
          onClick={() => navigate("..", { replace: true })}
        />
      </span>
      <div className="flex justify-center items-center w-full mt-10">
        {" "}
        <form
          className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%]"
          onSubmit={editProfileFormik.handleSubmit}
        >
          <div className="flex flex-col gap-y-6 mx-5 sm:mx-auto">
            <InputField
              name="name"
              value={editProfileFormik.values.name}
              onchange={editProfileFormik.handleChange}
              onBlur={editProfileFormik.handleBlur}
              placeHolder="Your Name"
              icon={<IoPersonOutline />}
              error={
                editProfileFormik.touched.name
                  ? editProfileFormik.errors.name
                  : ""
              }
            />
            <InputField
              name="email"
              value={editProfileFormik.values.email}
              onchange={editProfileFormik.handleChange}
              onBlur={editProfileFormik.handleBlur}
              placeHolder="Your Email Address"
              icon={<TfiEmail />}
              error={
                editProfileFormik.touched.email
                  ? editProfileFormik.errors.email
                  : ""
              }
            />
            <InputField
              name="city"
              value={editProfileFormik.values.city}
              onchange={editProfileFormik.handleChange}
              onBlur={editProfileFormik.handleBlur}
              placeHolder="Your city "
              icon={<AiOutlineHome />}
              error={
                editProfileFormik.touched.city
                  ? editProfileFormik.errors.city
                  : ""
              }
            />
            <div className="flex flex-col sm:flex-row  gap-x-3 gap-y-3 mt-2">
              <Button
                type="reset"
                text="reset"
                className="w-full text-center py-1 h-10 rounded-md hover:shadow-md bg-red-600 text-white font-semibold text-sm"
              />
              <Button
                type="submit"
                text="update"
                className="w-full text-center py-1 h-10 rounded-md hover:shadow-md bg-green-500 text-white font-semibold text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

EditPersonalInfo.displayName = "EditPersonalInfo";
export default EditPersonalInfo;
