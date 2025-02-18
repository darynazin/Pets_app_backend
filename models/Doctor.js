import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  hoursAvailable: { type: String, required: false, default: "10-12" },
});

export default model("Doctor", doctorSchema);