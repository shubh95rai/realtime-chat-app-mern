# 💬 Real-Time Chat App

A modern, full-stack **Real-Time Chat Application** built using the **MERN Stack**. It supports **JWT authentication**, **real-time messaging** via **Socket.io**, **unread message tracking**, and **image uploads** through **Cloudinary**. The UI is styled with **Tailwind CSS** and **Daisy UI**, and global state is managed using **Zustand**.

## ✨ Features

### 👥 Users

- 🔐 **Sign up / Sign in** with **JWT Authentication**
- 💬 **1-on-1 Real-Time Messaging**
- 📸 **Image Uploads in Chat** (via **Cloudinary**)
- 🟢 **Live Online / Offline Status**
- 🔔 **Unread Message Badges**
- 📱 **Fully Responsive UI**
- 🎨 **Theme Switching** with **35 Daisy UI Themes**

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Daisy UI (35 Prebuilt Themes)
- Zustand (State Management)
- Axios
- Socket.io-client

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- Cloudinary (Image Storage)
- JSON Web Token (JWT)
- bcrypt.js

## 📦 Features in Detail

- **Authentication & Authorization**: Secure JWT-based login & protected routes
- **Real-Time Messaging**: Fast, event-driven messaging via **Socket.io**
- **Unread Message Badges**: Display count of unseen messages per conversation
- **Image Sharing**: Seamless image upload using **Cloudinary**
- **Online Status**: Track and display user online/offline state
- **Zustand Store**: Lightweight and efficient state management for UI and socket state
- **Responsive Interface**: Tailored for mobile, tablet, and desktop with **Tailwind CSS + Daisy UI**
- **Theme Support**: Choose from **35 Daisy UI themes** for a personalized look

## 🔔 Messaging Logic

- Real-time bidirectional communication using WebSocket rooms
- Messages are persisted in MongoDB
- Online users are tracked via socket events
- Notifications show unread messages until chat is opened
- Uploaded images are hosted on Cloudinary and sent as media messages

## 🌐 Live Demo

🔗 **[Real-Time Chat App](https://realtime-chat-app-57d0.onrender.com)**
