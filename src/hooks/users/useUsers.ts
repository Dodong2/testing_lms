'use client'
/* services */
import { getUsersLists, updateUsers, deleteUser } from "@/services/usersServices"
/* react query */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
/* types */
import { usersLists } from "@/types/usersManagetypes"

export const useUsers = () => {

    //pang get ng lahat ng User lists
    const useUsersLists = () => {
        return useQuery<usersLists[]>({
        queryKey: ['users'],
        queryFn: getUsersLists
    })
    }

    //pang update ng lahat ng User
    const useUpdateUsers = () => {
        const queryClient = useQueryClient()
        return useMutation({ 
            mutationFn: updateUsers,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['users'] })
            }
         })
    }

    //pang delete ng user
    const useDeleteUsers = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: deleteUser,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['users'] })
            }
        })
    } 




    return { useUsersLists, useUpdateUsers, useDeleteUsers }
}

