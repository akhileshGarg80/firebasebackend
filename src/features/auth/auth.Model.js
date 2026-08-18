import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    photoURL: { type: String, default: "" },
    provider: { type: String, default: "password" }, // "password" ya "google.com"
  },
  { timestamps: true }
);

const User = mongoose.model("User", authSchema);
export default User;