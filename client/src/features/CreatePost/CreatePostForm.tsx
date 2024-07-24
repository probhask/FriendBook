import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/storeHook";
import { User } from "../../types";
import { SUPPORTED_FORMAT } from "../../utils/supportedFormat";
import { createPost } from "../../redux/AsyncFunctions/postAsync";
import { Button, InputField } from "../../components";
import TagFriends from "./TagFriends";
import DragDropFile from "./DragDropFile";
import { getCreatingPostLoading } from "../../redux/slice/postSlice";
import { useNavigate } from "react-router-dom";

const CreatePostForm = React.memo(() => {
  const [taggedUser, setTaggedUser] = useState<User[]>([]);
  const [taggedUserIds, setTaggedUserIds] = useState<string[]>([]);
  const creating = useAppSelector(getCreatingPostLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const createPostFrom = useFormik({
    initialValues: {
      image: undefined as File | undefined,
      postDesc: "",
      tagUser: "",
    },
    validationSchema: Yup.object().shape({
      image: Yup.mixed()
        .required("image is required")
        .test("Image Format", "Wrong image format", (value) => {
          if (value && typeof value === "object") {
            const file = value as File;
            return SUPPORTED_FORMAT.includes(file.type);
          }
        }),
      postDesc: Yup.string(),
      tagUser: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
      if (values.image)
        dispatch(
          createPost({
            image: values.image,
            postDesc: values.postDesc,
            tagUser: taggedUserIds,
          })
        ).then(() => navigate("/"));
    },
  });

  return (
    <div className="w-full flex flex-col gap-y-2 bg-white rounded-lg px-1 py-4">
      <h1 className="text-center font-semibold text-gray-600">Creat Post</h1>
      <form
        onSubmit={createPostFrom.handleSubmit}
        className="flex flex-col gap-y-4"
      >
        <InputField
          name="postDesc"
          textLabel="About post"
          value={createPostFrom.values.postDesc}
          placeHolder="tell us something.."
          error={
            createPostFrom.touched.postDesc
              ? createPostFrom.errors.postDesc
              : ""
          }
          onBlur={createPostFrom.handleBlur}
          onchange={createPostFrom.handleChange}
        />

        {/* tag friends */}
        <TagFriends
          name="tagUser"
          textLabel="Tag"
          setFieldValue={createPostFrom.setFieldValue}
          taggedUser={taggedUser}
          setTaggedUser={setTaggedUser}
          taggedUserIds={taggedUserIds}
          setTaggedUserIds={setTaggedUserIds}
          value={createPostFrom.values.tagUser}
          handleChange={createPostFrom.handleChange}
          onBlurEvent={createPostFrom.handleBlur}
          error={
            createPostFrom.touched.tagUser
              ? (createPostFrom.errors.tagUser as string)
              : ""
          }
        />

        {/* File input for image */}
        <DragDropFile
          name="image"
          textLabel="Upload Image"
          formikSetValue={createPostFrom.setFieldValue}
          onBlurEvent={createPostFrom.handleBlur}
          error={
            createPostFrom.touched.image
              ? (createPostFrom.errors.image as string)
              : ""
          }
        />

        <Button
          type="submit"
          className={`w-full flex justify-center items-center px-2 py-1 mt-4 mb-1 bg-white border border-blue-600 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 hover:shadow-sm ${
            creating && "font-extrabold text-xl"
          }`}
          text="create post"
          disable={creating}
        />
      </form>
    </div>
  );
});

CreatePostForm.displayName = "CreatePostForm";

export default CreatePostForm;
