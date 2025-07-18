import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/messageController.js";
import upload from "../middleware/uploadMiddleware.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);

messageRouter.post(
  "/send/:id",
  protectRoute,
  upload.single("image"),
  sendMessage
);

export default messageRouter;
