import React, { useCallback, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/storeHook";
import { User } from "../../types";
import {
  SUPPORTED_AUDIO,
  SUPPORTED_FORMAT,
  SUPPORTED_VIDEO,
} from "../../utils/supportedFormat";
import { createPost } from "../../redux/AsyncFunctions/postAsync";
import { Button, InputField } from "../../components";
import Seo from "@components/Seo/Seo";
import TagFriends from "./TagFriends";
import DragDropFile from "./DragDropFile";
import AudioTrimmer from "./AudioTrimmer";
import { getCreatingPostLoading } from "../../redux/slice/postSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Mode = "image" | "video" | "audioImage";
const MAX_BYTES = 4 * 1024 * 1024;

const modes: { value: Mode; label: string }[] = [
  { value: "image", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "audioImage", label: "Photo + Audio" },
];

const CreatePostForm = React.memo(() => {
  const [taggedUser, setTaggedUser] = useState<User[]>([]);
  const [taggedUserIds, setTaggedUserIds] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("image");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioMeta, setAudioMeta] = useState({ startSec: 0, endSec: 30 });

  const creating = useAppSelector(getCreatingPostLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAudioMeta = useCallback(
    (m: { startSec: number; endSec: number }) => setAudioMeta(m),
    []
  );

  const form = useFormik({
    initialValues: { postDesc: "", tagUser: "" },
    validationSchema: Yup.object().shape({
      postDesc: Yup.string().max(2000),
      tagUser: Yup.string(),
    }),
    onSubmit: async ({ postDesc }) => {
      try {
        if (mode === "video") {
          if (!video) return toast.error("Choose a video");
          if (!SUPPORTED_VIDEO.includes(video.type))
            return toast.error("Unsupported video format");
          if (video.size > MAX_BYTES)
            return toast.error("Video is too large (max 4MB)");
        } else {
          if (!image) return toast.error("Choose an image");
          if (!SUPPORTED_FORMAT.includes(image.type))
            return toast.error("Unsupported image format");
          if (image.size > MAX_BYTES)
            return toast.error("Image is too large (max 4MB)");
          if (mode === "audioImage") {
            if (!audio) return toast.error("Choose an audio track");
            if (!SUPPORTED_AUDIO.includes(audio.type))
              return toast.error("Unsupported audio format");
            if (audio.size > MAX_BYTES)
              return toast.error("Audio is too large (max 4MB)");
          }
        }

        await dispatch(
          createPost({
            mediaType: mode,
            postDesc,
            tagUser: taggedUserIds,
            image: image ?? undefined,
            video: video ?? undefined,
            audio: audio ?? undefined,
            audioMeta:
              mode === "audioImage"
                ? { ...audioMeta, trackName: audio?.name }
                : undefined,
          })
        ).unwrap();
        navigate("/");
      } catch {
        /* toast raised in slice */
      }
    },
  });

  const audioTrimmer = useMemo(
    () =>
      audio ? <AudioTrimmer file={audio} onChange={handleAudioMeta} /> : null,
    [audio, handleAudioMeta]
  );

  return (
    <div className="w-full flex flex-col gap-y-3 bg-white rounded-lg px-2 py-4">
      <Seo title="Create post" noIndex />
      <h1 className="text-center font-semibold text-gray-600">Create post</h1>

      <div
        role="tablist"
        aria-label="Post type"
        className="flex gap-x-1 rounded-lg bg-gray-100 p-1"
      >
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            role="tab"
            aria-selected={mode === m.value}
            onClick={() => setMode(m.value)}
            className={`flex-1 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
              mode === m.value
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={form.handleSubmit} className="flex flex-col gap-y-4">
        <InputField
          name="postDesc"
          textLabel="About post"
          value={form.values.postDesc}
          placeHolder="tell us something.."
          error={form.touched.postDesc ? form.errors.postDesc : ""}
          onBlur={form.handleBlur}
          onchange={form.handleChange}
        />

        <TagFriends
          name="tagUser"
          textLabel="Tag"
          setFieldValue={form.setFieldValue}
          taggedUser={taggedUser}
          setTaggedUser={setTaggedUser}
          taggedUserIds={taggedUserIds}
          setTaggedUserIds={setTaggedUserIds}
          value={form.values.tagUser}
          handleChange={form.handleChange}
          onBlurEvent={form.handleBlur}
          error={form.touched.tagUser ? (form.errors.tagUser as string) : ""}
        />

        {mode !== "video" && (
          <DragDropFile
            name="image"
            textLabel="Upload image"
            formikSetValue={(_n, file) => setImage(file)}
            onBlurEvent={form.handleBlur}
            error={""}
          />
        )}

        {mode === "video" && (
          <label className="flex flex-col gap-y-1 text-sm font-bold text-gray-600">
            Upload video (max 4MB)
            <input
              type="file"
              accept={SUPPORTED_VIDEO.join(",")}
              onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
              className="text-sm font-normal"
            />
            {video && (
              <video
                src={URL.createObjectURL(video)}
                controls
                playsInline
                className="mt-2 max-h-64 rounded-md"
              />
            )}
          </label>
        )}

        {mode === "audioImage" && (
          <div className="flex flex-col gap-y-2">
            <label className="flex flex-col gap-y-1 text-sm font-bold text-gray-600">
              Audio track (max 4MB)
              <input
                type="file"
                accept={SUPPORTED_AUDIO.join(",")}
                onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
                className="text-sm font-normal"
              />
            </label>
            {audioTrimmer}
          </div>
        )}

        <Button
          type="submit"
          className="w-full flex justify-center items-center px-2 py-1 mt-2 mb-1 bg-white border border-blue-600 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 hover:shadow-sm"
          text={creating ? "posting…" : "create post"}
          disable={creating}
        />
      </form>
    </div>
  );
});

CreatePostForm.displayName = "CreatePostForm";

export default CreatePostForm;
