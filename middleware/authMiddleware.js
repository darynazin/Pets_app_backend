import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { JWT_SECRET } from "../config/config.js";

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user =
    (await User.findById(decoded.id)) || (await Doctor.findById(decoded.id));

  if (req.user) {
    console.log("session user", req.session.user);
    return next();
  }  
  next();
});
