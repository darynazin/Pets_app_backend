import express from "express";
import multer from "multer";
import { uploadFile } from "../utils/uploadFile.js";

const uploadRouter = express.Router();

// Upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Routes
uploadRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    const imageUrl = await uploadFile(req.file);
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default uploadRouter;
