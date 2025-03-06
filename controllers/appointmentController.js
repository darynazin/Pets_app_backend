import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Appointment from "../models/Appointment.js";

export const getUserAppointments = asyncHandler(async (req, res, next) => {
  const userAppointments = await Appointment.find({
    userId: req.session.user.id,
  })
    .populate({
      path: "petId",
      select: "name",
    })
    .populate({
      path: "doctorId",
      select: "name address",
    });

  if (!userAppointments || userAppointments.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(userAppointments);
});

export const getAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id)
<<<<<<< Updated upstream
  .populate({
    path: "petId",
    select: "name",
  })
  .populate({
    path: "doctorId",
    select: "name address",
  });
console.log("appointment", appointment)
=======
    .populate({
      path: "petId",
      select: "name",
    })
    .populate({
      path: "doctorId",
      select: "name address image",
    });
  console.log("appointment", appointment);
>>>>>>> Stashed changes
  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  res.status(200).json(appointment);
});

export const createAppointment = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;

  const { doctorId, date, timeSlot, petId, additionalNotes } = req.body;

  if (!doctorId || !date || !timeSlot || !petId) {
    return next(new ErrorResponse("All fields are required", 400));
  }

  const newAppointment = new Appointment({
    userId,
    doctorId,
    date,
    timeSlot,
    petId,
    additionalNotes,
  });

  await newAppointment.save();

  res.status(201).json(newAppointment);
});

export const updateAppointment = asyncHandler(async (req, res, next) => {
  const { _id, userId, doctorId, date, timeSlot, petId, additionalNotes } = req.body;
  const appointment = await Appointment.findById(_id);
  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  if (appointment.userId.toString() !== req.session.user.id.toString()) {
    return next(
      new ErrorResponse("Unauthorized to update this appointment", 403)
    );
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    _id,
    { userId, doctorId, date, timeSlot, petId, additionalNotes },
    { new: true }
  );

  res.status(200).json(updatedAppointment);
});

export const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorResponse("Appointment ID is required", 404));
  }

  if (appointment.userId.toString() !== req.session.user.id.toString()) {
    return next(
      new ErrorResponse("Unauthorized to delete this appointment", 403)
    );
  }

  await Appointment.findByIdAndDelete(id);

  res.status(200).json({ message: "Appointment deleted successfully" });
});

export const getDoctorAppointments = asyncHandler(async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const doctorAppointments = await Appointment.find({ doctorId });

  if (!doctorAppointments || doctorAppointments.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(doctorAppointments);
});
