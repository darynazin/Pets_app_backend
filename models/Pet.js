import { Schema, model } from "mongoose";
import Appointment from "./Appointment.js";

const petSchema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  birthDate: { type: String, required: true },
  image: { type: String, required: false },
  additionalNotes: { type: String, required: false },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

petSchema.pre("findOneAndDelete", async function (next) {
  const pet = await this.model.findOne(this.getFilter());

  if (!pet) return next();

  await Appointment.deleteMany({ petId: pet._id });

  next();
});

export default model("Pet", petSchema);