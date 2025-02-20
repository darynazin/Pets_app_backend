import Doctor from "../models/Doctor.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Get all doctors
export const getDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find();
  res.status(200).json(doctors);
});

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
  const doctor = await Doctor.findById(req.user._id);
  console.log(req.user._id);
  if (!doctor) {
    throw new ErrorResponse("Doctor not found", 404);
  }
  res.status(200).json(doctor);
});

// Create a new doctor
export const createDoctor = asyncHandler(async (req, res, next) => {
  const { name, email, password, image, address, phoneNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newDoctor = new Doctor({
    name,
    email,
    password: hashedPassword,
    image,
    address,
    phoneNumber
  });

  await newDoctor.save();

  const token = jwt.sign(
    {
      id: newDoctor._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: String(process.env.JWT_EXPIRES_IN) }
  );

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };

  res.cookie("token", token, cookieOptions);
  res.status(201).json(newDoctor);
});

// Update doctor by ID
export const updateDoctor = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor._id;
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedDoctor) {
    throw new ErrorResponse("Doctor not found", 404);
  }

  res.status(200).json(updatedDoctor);
});

// Delete doctor by ID
export const deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor._id;

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

  const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    doctorname: doctor.doctorname,
    email: doctor.email,
    image: doctor.image,
  });
  
});

// Doctor Logout
export const logoutDoctor = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logout successful" });
};
