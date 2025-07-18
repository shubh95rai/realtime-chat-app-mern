import jwt from "jsonwebtoken";

export function generateToken(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // set cookie
  res.cookie("token", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1d in milliseconds
    httpOnly: true, // Restricts access to the cookie to HTTP requests only (not accessible via JavaScript).
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" means cookie IS sent with cross-site requests (for auth)
    secure: process.env.NODE_ENV === "production", // Sends the cookie only over HTTPS.
  });

  return token;
}
