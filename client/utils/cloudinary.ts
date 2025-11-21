const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(uri: string) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env vars are missing");
  }

  const formData = new FormData();

  // React Native file object
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as any);

  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const json = await res.json();

  if (!res.ok) {
    console.log("Cloudinary error:", json);
    throw new Error(json.error?.message || "Upload failed");
  }

  return json.secure_url as string; // this is the final image URL
}
