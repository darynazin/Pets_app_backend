import { Router } from "express";
import {
  create,
  // register,
  // login,
  // logout,
  // getUsers,
  // getUserById,
  // updateUser,
  // deleteUser,
} from "../controllers/userController.js";
// import upload from "../middlewares/multerMiddleware.js";

const usersRouter = Router();

usersRouter.route("/").post(create);

// usersRouter.post("/register", upload.single("image"), register);
// usersRouter.route("/login").post(login);
// usersRouter.route("/logout").post(logout);
// usersRouter.route("/").get(getUsers);
// usersRouter.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default usersRouter;
