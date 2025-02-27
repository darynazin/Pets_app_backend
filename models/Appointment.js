import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true }, //added new field
    petId: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    additionalNotes: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default model("Appointment", appointmentSchema);
