import { Schema, model } from "mongoose";
import Appointment from "./Appointment.js";

const doctorSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  image: { type: String, required: false },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  role: { type: String, default: "doctor" },
});

doctorSchema.pre("findOneAndDelete", async function (next) {
  const doctor = await this.model.findOne(this.getFilter());

  if (!doctor) return next();

  await Appointment.deleteMany({ doctorId: doctor._id });

  next();
});

export default model("Doctor", doctorSchema);