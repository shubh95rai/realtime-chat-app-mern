import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { clearTokenCookie, generateToken } from "../lib/utils.js";
import cloudinary from "../configs/cloudinary.js";

export async function signup(req, res) {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // generate salt and hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    // generate jwt token
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate jwt token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    clearTokenCookie(res);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    clg.log("Error in logout controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const image = req.file;
    const userId = req.user._id;

    if (!image) {
      return res
        .status(400)
        .json({ message: "Please provide a profile picture" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image.path, {
      folder: "chat-app/profile-pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function checkAuth(req, res) {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}
