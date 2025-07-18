import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in checkAuth:", message);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });

      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in signup:", message);

      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in login:", message);

      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });

      useChatStore.getState().clearSelectedUser();

      toast.success("Logged out successfully");

      get().disconnectSocket();
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in logout:", message);

      toast.error(message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      set({ authUser: res.data });

      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in updateProfile:", message);

      toast.error("Image upload failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true,
    });

    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket?.connected) {
      socket.disconnect();
    }

    set({ socket: null });
  },
}));
