import Doctor from "../models/Doctor.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { MAPS_API_KEY, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/config.js";

// Get all doctors
export const getDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find();
  res.status(200).json(doctors);
});

// Get doctor by ID
export const getDoctorById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new ErrorResponse("Doctor not found", 404);
  }
  res.status(200).json(doctor);
});

// Get doctor by ID
export const getCurrentDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.session.user.id);
  if (!doctor) {
    throw new ErrorResponse("Doctor not found", 404);
  }
  res.status(200).json(doctor);
});

export const createDoctor = asyncHandler(async (req, res, next) => {
  const { name, email, password, image, address, phoneNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${MAPS_API_KEY}`
  );

  const data = await response.json();

  if (data.status !== "OK" || data.results.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid address. Could not fetch coordinates." });
  }

  const { lat, lng } = data.results[0].geometry.location;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Failed to retrieve valid coordinates." });
  }

  const newDoctor = new Doctor({
    name,
    email,
    password: hashedPassword,
    image,
    address,
    phoneNumber,
    location: { lat, lng },
  });

  await newDoctor.save();

  const token = jwt.sign({ id: newDoctor._id }, JWT_SECRET, {
    expiresIn: String(JWT_EXPIRES_IN),
  });

  const isProduction = NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };

  res.cookie("token", token, cookieOptions);
  res.status(201).json(newDoctor);
});

export const updateDoctor = asyncHandler(async (req, res, next) => {
  const doctorId = req.body._id;
  const { password, newPassword, ...updates } = req.body;
  const image = req.file;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorResponse("Doctor not found", 404));
  }

  if (password && newPassword) {
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  if (updates.address) {
    console.log("Address update detected:", updates.address);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          updates.address
        )}&key=${MAPS_API_KEY}`
      );

      const data = await response.json();
      console.log("Google API Response:", JSON.stringify(data, null, 2));

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        updates.location = { lat, lng };
      } else {
        return res
          .status(400)
          .json({ error: "Invalid address. Could not fetch coordinates." });
      }
    } catch (error) {
      console.error("Error fetching new location:", error);
      return res.status(500).json({ error: "Failed to update location." });
    }
  }

  if (image) {
    try {
      const blob = bucket.file(`images/${doctor.name}/${Date.now()}_${image.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: image.mimetype },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => reject(new CustomError("Image upload failed", 500)));
        blobStream.on("finish", resolve);
        blobStream.end(image.buffer);
      });

      const signedUrl = await blob.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
      updates.image = signedUrl[0];
    } catch (error) {
      return next(new CustomError("Image upload failed", 500));
    }
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedDoctor) {
    return next(new ErrorResponse("Doctor not found", 404));
  }

  res.status(200).json(updatedDoctor);
});


export const deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctorId = req.user.id;
  const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
  if (!deletedDoctor) {
    throw new ErrorResponse("Doctor not found", 404);
  }

  res.status(200).json({ message: "Doctor deleted successfully" });
});

// Doctor Login
export const loginDoctor = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const doctor = await Doctor.findOne({ email });
  
  if (!doctor) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, doctor.password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  req.session.user = {
    id: doctor._id,
    name: doctor.name,
    email: doctor.email,
    image: doctor.image,
    address: doctor.address,
    phoneNumber: doctor.phoneNumber,
    role: doctor.role,
  };
  req.session.userId = doctor._id;

  const token = jwt.sign({ id: doctor._id }, JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProduction = NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };

  res
  .cookie("token", token, cookieOptions)
  .status(200)
  .json({ message: "Login successful", user: req.session.user });
});


export const checkSession = (req, res) => {
  if (req.session?.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }

  return res.json({ authenticated: false });
};

// Doctor Logout
export const logoutDoctor = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  });
};
