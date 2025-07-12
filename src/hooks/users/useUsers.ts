'use client'
import { getUsersLists, updateUsers } from "@/services/usersServices"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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


    




    return { useUsersLists, useUpdateUsers }
}

