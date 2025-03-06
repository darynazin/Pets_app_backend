import { bucket } from "../config/firebaseConfig.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const validateFile = (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.originalname || !file.mimetype || !file.buffer) {
    throw new Error("Invalid file format");
  }

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size allowed is ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB`
    );
  }
};

export const uploadFile = async (file) => {
  validateFile(file);

  try {
    const folder = "uploads";
    const fileName = `${folder}/${Date.now()}_${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        reject(new Error(`Upload failed: ${error.message}`));
      });

      blobStream.on("finish", async () => {
        await fileUpload.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};
