import { Schema, model } from "mongoose";

const petSchema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, required: false },
  additionalNotes: { type: String, required: false },
});

export default model("Pet", petSchema);