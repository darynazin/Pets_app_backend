import { Router } from "express";
import {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authHandler.js";
import upload from "../middlewares/multerMiddleware.js";

const userRouter = Router();

userRouter.post("/register", upload.single("image"), register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter.route("/").get(getUsers);
userRouter.route("/:id").get(protect, getUserById).put(protect, updateUser).delete(protect, deleteUser);

export default userRouter;
