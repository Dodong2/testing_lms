import { useEffect } from "react";
import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { usersLists } from "@/types/usersManagetypes";

export const useUserEvents = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        // for create user
        socket.on("user-created", (newUser: usersLists) => {
            queryClient.setQueryData<usersLists[]>(["users"], (old) => {
                if (!old) return [newUser]
                return [newUser, ...old]
            })
        })

        // for update user
        socket.on("user-updated", (updatedUser: usersLists) => {
            queryClient.setQueryData<usersLists[]>(["users"], (old) => {
                if (!old) return []
                return old.map((user) => 
                        user.id === updatedUser.id ? updatedUser : user
                    )
            })
        })

        // for delete user
        socket.on("user-deleted", ({ id }: { id: string }) => {
            queryClient.setQueryData<usersLists[]>(["users"], (old) => {
                if (!old) return []
                return old.filter((user) => user.id !== id)
            })
        })
        
        return () => {
            socket.off("user-created")
            socket.off("user-updated")
            socket.off("user-deleted")
        }

    }, [queryClient])
}