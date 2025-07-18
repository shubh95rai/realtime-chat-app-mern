import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorised - No token provided",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        message: "Unauthorised - Invalid token",
      });
    }

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
