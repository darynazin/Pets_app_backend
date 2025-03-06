import { Router } from 'express';

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  checkSession,
} from '../controllers/userController.js';

import { auth } from '../middleware/authMiddleware.js';

const usersRouter = Router();

usersRouter.post(`/`, createUser);
usersRouter.post(`/login`, loginUser);
usersRouter.get(`/session`, checkSession);
usersRouter.post(`/logout`, logoutUser);
usersRouter.use(auth);
usersRouter.get(`/`, getUsers);
usersRouter.get(`/me`, getUserById);
usersRouter.put(`/`, updateUser);
usersRouter.delete(`/`, deleteUser);

export default usersRouter;