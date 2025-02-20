import express from "express";
import multer from "multer";
import { uploadFile } from "../utils/uploadFile.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("file");

uploadRouter.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Unknown error: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    try {
      const imageUrl = await uploadFile(req.file);
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

export default uploadRouter;
