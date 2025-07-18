import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in getUsers:", message);

      toast.error("Something went wrong!");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in getMessages:", message);

      toast.error("Something went wrong!");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    set({ isSendingMessage: true });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });

      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unknown error";

      console.log("Error in sendMessage:", message);

      toast.error("Failed to send message");

      return false;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  setSelectedUser: (selectedUser) => {
    // reset unread messages count when user opens that chat
    const updatedUnread = { ...get().unreadMessages };

    if (selectedUser?._id) {
      updatedUnread[selectedUser._id] = 0;
    }
    set({ selectedUser, unreadMessages: updatedUnread });
  },

  clearSelectedUser: () => set({ selectedUser: null }),

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (!socket || !authUser) return;

    socket.off("newMessage"); // avoid duplicate listeners

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, incrementUnreadMessages, messages } = get();

      const isCurrentChat = selectedUser?._id === newMessage.senderId;

      // Always add message if its from current chat
      if (isCurrentChat) {
        set({ messages: [...messages, newMessage] });
      } else {
        // increment unread messages count
        incrementUnreadMessages(newMessage.senderId);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (socket) {
      socket.off(`newMessage`);
    }
  },

  unreadMessages: {},

  incrementUnreadMessages: (senderId) => {
    const current = get().unreadMessages[senderId] || 0;

    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [senderId]: current + 1,
      },
    }));
  },
}));
