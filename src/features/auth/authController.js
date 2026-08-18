import User from "./auth.Model.js";
import { auth } from "../../../config/firebase.js";

export const syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture, firebase } = req.firebaseUser;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || "",
        photoURL: picture || "",
        provider: firebase?.sign_in_provider || "password",
      });
      console.log("✅ New verified user saved to DB:", email);
    }

    res.status(200).json({
      message: "User synced successfully",
      user: {
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ message: "User not found in DB" });
    res.status(200).json({
      user: { email: user.email, name: user.name, photoURL: user.photoURL },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkAndCleanUnverified = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(email);
    } catch (err) {
      return res.status(200).json({ exists: false });
    }

    if (firebaseUser.emailVerified) {
      return res.status(200).json({
        exists: true,
        verified: true,
        message: "Account already verified. Please login or reset password.",
      });
    }

    await auth.deleteUser(firebaseUser.uid);
    await User.deleteOne({ firebaseUid: firebaseUser.uid });

    return res.status(200).json({
      exists: true,
      verified: false,
      deleted: true,
      message: "Old unverified account removed. You can register again.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};