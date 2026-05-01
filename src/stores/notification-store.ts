import { create } from "zustand";
import type { Notification } from "../lib/types";
import { mockNotifications } from "../lib/mock-data";

interface NotificationState {
  notifications: Notification[];
  toast: { message: string; type: "success" | "error" | "info" } | null;
  addNotification: (notif: Omit<Notification, "id" | "created_at" | "is_read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  toast: null,

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },

  markRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n,
      ),
    }));
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
    }));
  },

  unreadCount: () => get().notifications.filter((n) => !n.is_read).length,

  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null }),
}));
