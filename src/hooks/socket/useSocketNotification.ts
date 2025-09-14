import { useEffect } from "react";
import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notifAdmintypes";

export const useNotificationEvents = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // when new notification is created
    socket.on("notification-created", (newNotifs: Notification[]) => {
      queryClient.setQueryData<{ notifications: Notification[] }>(
        ["notifications", 1], // <-- match sa useGetNotifications(1)
        (oldData) => {
          if (!oldData) return { notifications: newNotifs }
          const existingIds = new Set(oldData.notifications.map(n => n.id))
          return {
            notifications: [
              ...newNotifs.filter(n => !existingIds.has(n.id)),
              ...oldData.notifications,
            ],
          }
        }
      )
    })

    return () => {
      socket.off("notification-created")
    }
  }, [queryClient])
};