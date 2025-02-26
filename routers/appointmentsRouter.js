import { Router } from 'express';

import {
  getUserAppointments,
  getDoctorAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
} from '../controllers/appointmentController.js';

import { auth } from '../middleware/authMiddleware.js';

const appointmentsRouter = Router();

appointmentsRouter.use(auth);
appointmentsRouter.get(`/`, getUserAppointments);
appointmentsRouter.get(`/:doctorId`, getDoctorAppointments);
appointmentsRouter.post(`/`, createAppointment);
appointmentsRouter.put(`/`, updateAppointment);
appointmentsRouter.delete(`/:id`, deleteAppointment);
appointmentsRouter.get(`/one/:id`, getAppointment);

export default appointmentsRouter;