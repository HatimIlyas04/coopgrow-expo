import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "coopgrow-expo",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadCloud = multer({ storage });
