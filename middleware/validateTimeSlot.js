import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Appointment from "../models/Appointment.js";
import timeSlotConfig from "../config/timeSlotConfig.js";

export const validateTimeSlot = asyncHandler(async (req, res, next) => {
  const { doctorId, date, timeSlot, petId, visitType } = req.body;

  // Check required fields
  if (!doctorId || !date || !timeSlot || !petId || !visitType) {
    return next(new ErrorResponse("Required fields are missing", 400));
  }

  // Validate time slot format
  const timeSlotRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeSlotRegex.test(timeSlot)) {
    return next(new ErrorResponse("Invalid time slot format", 400));
  }

  // Validate time slot is within working hours
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const { startHour, endHour, interval } = timeSlotConfig;

  if (hours < startHour || hours >= endHour || minutes % interval !== 0) {
    return next(
      new ErrorResponse(
        `Time slot must be between ${startHour}:00 and ${endHour}:00 in ${interval}-minute intervals`,
        400
      )
    );
  }

  // Check for double booking
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date,
    timeSlot,
  });

  if (existingAppointment) {
    return next(new ErrorResponse("This time slot is already booked", 400));
  }

  // Validate date is not in the past
  const appointmentDate = new Date(`${date}T${timeSlot}`);
  const now = new Date();

  if (appointmentDate < now) {
    return next(new ErrorResponse("Cannot book appointments in the past", 400));
  }

  // Validate visit purpose
  const validTypes = [
    "Routine Checkup",
    "Vaccination",
    "Skin Issues",
    "Digestive Issues",
    "Surgery/Castration",
    "Emergency",
    "Other",
  ];

  if (!validTypes.includes(visitType)) {
    return next(new ErrorResponse("Invalid visit purpose", 400));
  }

  next();
});
