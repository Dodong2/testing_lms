'use client'
import { getUsersLists } from "@/services/usersServices"
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


    




    return { useUsersLists }
}

