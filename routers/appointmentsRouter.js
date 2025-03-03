import { Router } from "express";
import { validateTimeSlot } from "../middleware/validateTimeSlot.js";

import {
  getUserAppointments,
  getDoctorAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
  getAvailableTimeSlots,
} from "../controllers/appointmentController.js";

import { auth } from "../middleware/authMiddleware.js";

const appointmentsRouter = Router();

appointmentsRouter.use(auth);
appointmentsRouter.get(`/available`, getAvailableTimeSlots);
appointmentsRouter.get(`/`, getUserAppointments);
appointmentsRouter.get(`/doctor`, getDoctorAppointments);
appointmentsRouter.post(`/`, validateTimeSlot, createAppointment);
appointmentsRouter.put(`/`, updateAppointment);
appointmentsRouter.delete(`/:id`, deleteAppointment);
appointmentsRouter.get(`/one/:id`, getAppointment);

export default appointmentsRouter;
