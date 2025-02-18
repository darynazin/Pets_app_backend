import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
  username: { type: String, required: true },
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
});

export default model("Doctor", doctorSchema);