import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  hoursAvailable: { type: String, required: false, default: "10-12" },
  pets: { type: [ String ], required: false, default: [] },
});

export default model("User", userSchema);