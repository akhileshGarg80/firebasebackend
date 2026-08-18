import { auth } from "../../../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await auth.verifyIdToken(token);

    if (!decoded.email_verified) {
      return res.status(403).json({ message: "Email not verified. Please verify first." });
    }

    req.firebaseUser = decoded; // uid, email, email_verified
    next();
  } catch (error) {
    console.error("Token verify error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};