import { apiFetch } from "./apiClient";
import { Notification, NotificationPagination } from "@/types/notifAdmintypes";


// GET notifications for admin
export const getNotifications = async(page = 1, limit = 10) => {
  return apiFetch<NotificationPagination>(`/api/notifications?page=${page}&limit=${limit}`, {
    method: 'GET',
    credentials: 'include'
  });
};

// POST: create notification
export const CreateNotifAdmin = async(data: { userId: string; type: Notification["type"]; message: string; referenceId?: string }) => {
    return apiFetch<Notification>('/api/notifications', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
    })
}

// mark all as read
export const markAllAsRead = async () => {
  return apiFetch<{ success: boolean }>('/api/notifications', {
    method: 'PATCH',
    credentials: 'include'
  })
}