import express from "express";
import multer from "multer";
import { uploadFile } from "../utils/uploadFile.js";
import { auth } from "../middleware/authMiddleware.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("file");

const handleUpload = async (req, res, next) => {
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
      req.uploadedImageUrl = imageUrl;
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

uploadRouter.post("/pets/:id/image", auth, handleUpload, async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { imageUrl: req.uploadedImageUrl },
      { new: true }
    );
    if (!updatedPet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(200).json({ imageUrl: req.uploadedImageUrl, pet: updatedPet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

uploadRouter.post("/users/:id/image", auth, handleUpload, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { imageUrl: req.uploadedImageUrl },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ imageUrl: req.uploadedImageUrl, user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

uploadRouter.post(
  "/doctors/:id/image",
  auth,
  handleUpload,
  async (req, res) => {
    try {
      const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        { imageUrl: req.uploadedImageUrl },
        { new: true }
      );
      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res
        .status(200)
        .json({ imageUrl: req.uploadedImageUrl, doctor: updatedDoctor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default uploadRouter;
