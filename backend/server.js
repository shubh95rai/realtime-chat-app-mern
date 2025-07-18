import "dotenv/config";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./configs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./lib/socket.js";

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json()); // parse json data
app.use(cookieParser()); // parse cookies and set them to req.cookies

// routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

// start server after connecting to DB
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Wait until DB is connected
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
