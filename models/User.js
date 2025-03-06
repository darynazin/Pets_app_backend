import { Schema, model } from "mongoose";
import Pet from "./Pet.js";
import Appointment from "./Appointment.js";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.includes('@');
      },
      message: props => `${props.value} is not a valid email! It must contain "@"`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  image: { type: String, required: false },
  petsId: [{ type: Schema.Types.ObjectId, ref: "Pet", default: [] }],
  role: { type: String, default: "user" },
});

userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());

  if (!user) return next();

  await Pet.deleteMany({ ownerId: user._id });

  await Appointment.deleteMany({ userId: user._id });

  next();
});

export default model("User", userSchema);
