export const SUPPORTED_FORMAT = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/tiff",
  "image/webp",
  "image/avif",
];

export const SUPPORTED_AUDIO = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/aac",
  "audio/mp4",
  "audio/webm",
];

export const SUPPORTED_VIDEO = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
];

export const ACCEPT_IMAGE = SUPPORTED_FORMAT.join(",");
export const ACCEPT_AUDIO = SUPPORTED_AUDIO.join(",");
export const ACCEPT_VIDEO = SUPPORTED_VIDEO.join(",");
