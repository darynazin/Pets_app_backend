import { Schema, model } from "mongoose";

const petSchema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  birthDate: { type: String, required: true },
  image: { type: String, required: false },
  additionalNotes: { type: String, required: false },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model("Pet", petSchema);