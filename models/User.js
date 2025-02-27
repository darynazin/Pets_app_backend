import { Schema, model } from "mongoose";

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

export default model("User", userSchema);
