import { Router } from 'express';

import {
  getUserAppointments,
  getDoctorAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

import { auth } from '../middleware/authMiddleware.js';

const appointmentsRouter = Router();
appointmentsRouter.use(auth);
appointmentsRouter.get(`/`, getUserAppointments);
appointmentsRouter.get(`/:doctorId`, getDoctorAppointments);
appointmentsRouter.post(`/`, createAppointment);
appointmentsRouter.put(`/`, updateAppointment);
appointmentsRouter.delete(`/:id`, deleteAppointment);

export default appointmentsRouter;