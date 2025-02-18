import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Appointment from "../models/Appointment.js";

export const getUserAppointments = asyncHandler(async (req, res, next) => {
  const userAppointments = await Appointment.find({ userId: req.user._id });

  if (!userAppointments || userAppointments.length === 0) {
    return res.status(404).json({ message: "No appointments found" });
  }

  res.status(200).json(userAppointments);
});

export const createAppointment = asyncHandler(async (req, res, next) => {
  const newAppointment = new Appointment(req.body);

  await newAppointment.save();

  res.status(201).json(newAppointment);
});

export const updateAppointment = asyncHandler(async (req, res, next) => {
  const { _id, date, timeSlot, petId } = req.body;
  const appointment = await Appointment.findById(_id);
  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  if (appointment.userId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Unauthorized to update this appointment", 403)
    );
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    _id,
    { date, timeSlot, petId },
    { new: true }
  );

  res.status(200).json(updatedAppointment);
});

// export const deleteAppointment = asyncHandler(async (req, res, next) => {
//   const { appointmentId } = req.params;
  
//   console.log(appointmentId);
//   const appointment = await Appointment.findById(appointmentId);
//   if (!appointment) {
//     return next(new ErrorResponse("Appointment ID is required", 404));
//   }

//   if (appointment.userId.toString() !== req.user._id.toString()) {
//     return next(
//       new ErrorResponse("Unauthorized to delete this appointment", 403)
//     );
//   }

//   await appointment.remove();

//   res.status(204).json({});
// });

export const getDoctorAppointments = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  if (appointment.userId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Unauthorized to access this appointment", 403)
    );
  }

  res.status(200).json(appointment);
});