import { client } from "./sanityClient";

// Function to upload an image to Sanity and return the image URL
export const uploadImageToSanity = async (image: File): Promise<string> => {
  // Check if image is provided
  if (!image) {
    throw new Error("No image provided");
  }

  try {
    // Upload image to Sanity using client.assets.upload
    const uploadedAsset = await client.assets.upload("image", image);

    // Return the URL of the uploaded image
    return uploadedAsset._id;
  } catch (error) {
    console.error("Error uploading image to Sanity:", error);

    // Handle known Sanity errors
    if (error instanceof Error) {
      throw new Error("Failed to upload image to Sanity: " + error.message);
    }

    // Handle unknown errors
    throw new Error("Failed to upload image");
  }
};
