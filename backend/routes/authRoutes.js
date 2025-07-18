import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.put(
  "/update-profile",
  protectRoute,
  upload.single("image"),
  updateProfile
);

authRouter.get("/check-auth", protectRoute, checkAuth);

export default authRouter;
