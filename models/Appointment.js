import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  appointmentTime: { type: String, required: true },
  petName: { type: String, required: false },
  additionalNotes: { type: String, required: false },
});

export default model("Appointment", appointmentSchema);