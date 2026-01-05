import { v2 as cloudinary } from "cloudinary";

// ✅ read CLOUDINARY_URL automatically from env
cloudinary.config({ secure: true });

export default cloudinary;
