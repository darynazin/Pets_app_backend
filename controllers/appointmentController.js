import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Appointment from "../models/Appointment.js";
import timeSlotConfig from "../config/timeSlotConfig.js";

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
    .populate({
      path: "petId",
      select: "name",
    })
    .populate({
      path: "doctorId",
      select: "name address",
    });
  console.log("appointment", appointment);
  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  res.status(200).json(appointment);
});

// Generate time slots based on config
const generateTimeSlots = () => {
  const slots = [];
  const { startHour, endHour, interval } = timeSlotConfig;

  for (let hour = startHour; hour < endHour; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    slots.push(`${formattedHour}:00`);

    if (interval === 30) {
      slots.push(`${formattedHour}:30`);
    }
  }

  return slots;
};

export const getAvailableTimeSlots = asyncHandler(async (req, res, next) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return next(new ErrorResponse("Doctor and date is required", 400));
  }

  // Get day of week (0-6, where 0 is Sunday)
  const dayOfWeek = new Date(date).getDay();

  // Check if the selected day is a working day
  if (!timeSlotConfig.workingDays.includes(dayOfWeek)) {
    return res.status(200).json({
      message: "Selected date is not a working day",
      availableSlots: [],
    });
  }

  // Generate all possible time slots for the day
  const allTimeSlots = generateTimeSlots();

  // Get booked slots from database
  const bookedAppointments = await Appointment.find({
    doctorId,
    date,
  });

  const bookedSlots = bookedAppointments.map((app) => app.timeSlot);

  // Filter out booked slots
  const availableSlots = allTimeSlots.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  res.status(200).json(availableSlots);
}); // change end
export const createAppointment = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;

  const {
    doctorId,
    date,
    timeSlot,
    petId,
    additionalNotes,
    visitType,
    additionalNotes,
  } = req.body;

  if (!doctorId || !date || !timeSlot || !petId || !visitType) {
    return next(new ErrorResponse("All fields are required", 400));
  }

  const newAppointment = new Appointment({
    userId,
    doctorId,
    date,
    timeSlot,
    petId,
    additionalNotes: additionalNotes || "",
  });

  await newAppointment.save();
  res.status(201).json(newAppointment);
});

export const updateAppointment = asyncHandler(async (req, res, next) => {
  const { _id, userId, doctorId, date, timeSlot, petId, additionalNotes } =
    req.body;
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
