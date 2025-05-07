// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isMarried: Boolean,
});

const User = mongoose.model("User", userSchema);

export default User;
