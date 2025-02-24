import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (req.path === "/logout") {
    return next();
  }
  if (req.session.user) {
    console.log("session user", req.session.user);
    return next();
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // req.user =
  //   (await User.findById(decoded.id)) || (await Doctor.findById(decoded.id));

  next();
});
