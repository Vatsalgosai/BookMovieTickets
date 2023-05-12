import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    default: "User",
  },
  status: {
    type: Number,
    default: 1,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
