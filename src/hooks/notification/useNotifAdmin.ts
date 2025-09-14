import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, CreateNotifAdmin } from "@/services/notification";
import { Notification } from "@/types/notifAdmintypes";

export const useNotifAdmin = () => {

    const useGetNotifications = (page: number, limit = 10) => {
        return useQuery({
            queryKey: ['notifications', page],
            queryFn: () => getNotifications(page, limit)
        })
    }

    const useCreateNotifications = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (data: { userId: string; type: Notification["type"]; message: string; referenceId?: string }) =>
                CreateNotifAdmin(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['notifications'] })
            },
            onError: () => {
                console.error("Failed to create notification");
            }
        })
    }

    return { useGetNotifications, useCreateNotifications }
}
