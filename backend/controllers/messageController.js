import cloudinary from "../configs/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const { text } = req.body;
    const image = req.file;

    let imageUrl;

    if (image) {
      // upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image.path, {
        folder: "chat-app/messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId: myId,
      receiverId: userToChatId,
      text: text,
      image: imageUrl || "",
    });

    // real-time functionality
    const receiverSocketId = getReceiverSocketId(userToChatId); // we get this only if user is online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // send message to particular receiver not all users
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);

    res.status(500).json({ message: "Internal server error" });
  }
}
