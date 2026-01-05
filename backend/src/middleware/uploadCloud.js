import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: "coopgrow-expo",
    resource_type: "image",
    public_id: Date.now() + "-" + file.originalname.split(".")[0],
  }),
});

export const uploadCloud = multer({ storage });
