import express from "express";
import { syncUser, getMe, checkAndCleanUnverified } from "./authController.js";
import { verifyFirebaseToken } from "./authMiddleware.js";

const router = express.Router();

router.post("/check-unverified", checkAndCleanUnverified); // naya route, no auth needed
router.post("/sync", verifyFirebaseToken, syncUser);
router.get("/me", verifyFirebaseToken, getMe);

export default router;