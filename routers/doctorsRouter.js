import { Router } from "express";

import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  loginDoctor,
  logoutDoctor,
  getCurrentDoctor,
  checkSession,
} from '../controllers/doctorController.js';

import { auth } from '../middleware/authMiddleware.js';

const doctorsRouter = Router();

doctorsRouter.post(`/`, createDoctor);
doctorsRouter.post(`/login`, loginDoctor);
doctorsRouter.get(`/session`, checkSession);
doctorsRouter.post(`/logout`, auth, logoutDoctor);
doctorsRouter.get(`/`, getDoctors);
doctorsRouter.get(`/me`, auth, getCurrentDoctor);
doctorsRouter.get(`/:id`, getDoctorById);
doctorsRouter.put(`/`, auth, updateDoctor);
doctorsRouter.delete(`/`, auth, deleteDoctor);

export default doctorsRouter;