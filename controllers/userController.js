import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/config.js";

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.session.user.id;
  const user = await User.findById(id);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  res.status(200).json(user);
});

// Create a new user
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, image, petsId } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image,
    petsId,
  });

  await newUser.save();

  const token = jwt.sign(
    {
      id: newUser._id,
    },
    JWT_SECRET,
    { expiresIn: String(JWT_EXPIRES_IN) }
  );

  const isProduction = NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };

  res.cookie("token", token, cookieOptions);
  res.status(201).json(newUser);
});

// Update user by ID
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ErrorResponse("User not found", 404);
  }

  res.status(200).json(updatedUser);
});

// Delete user by ID
export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ErrorResponse('User not found', 404);
  }

  res.status(204).json({ message: 'User deleted successfully' });
});

// User Login
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid email or password", 401));
  }

  req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
  req.session.userId = user._id;

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const isProduction = NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000,
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

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  });
};
