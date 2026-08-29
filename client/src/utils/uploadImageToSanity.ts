import { callApi, fileToBase64 } from "./api";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/**
 * Upload a file to Sanity via the authenticated backend and return its asset id.
 * `kind` is `"image"` for photos or `"file"` for audio/video.
 */
export const uploadImageToSanity = async (
  file: File,
  kind: "image" | "file" = "image"
): Promise<string> => {
  if (!file) throw new Error("No file provided");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large (max 4MB)");
  }

  const dataBase64 = await fileToBase64(file);
  const { assetId } = await callApi<{ assetId: string }>("uploadAsset", {
    kind,
    filename: file.name,
    contentType: file.type,
    dataBase64,
  });
  return assetId;
};
