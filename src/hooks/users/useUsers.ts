'use client'
/* services */
import { getUsersLists, createUser, updateUsers, deleteUser, getUserRoleStats } from "@/services/usersServices"
/* react query */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
/* types */
import { CreateUserData, CreateUserResponse, UsersResponsePaginated, RoleStatsResponse } from "@/types/usersManagetypes"
import toast from "react-hot-toast"

export const useUsers = () => {

    //pang get ng lahat ng User lists
    const useUsersLists = (page: number, search: string) => {
        return useQuery<UsersResponsePaginated>({
            queryKey: ['users', page, search],
            queryFn: () => getUsersLists(page, search),
            placeholderData: keepPreviousData
        })
    }

    //pang add ng users
    const useCreateUser = () => {
        const queryClient = useQueryClient()
        return useMutation<CreateUserResponse, Error, CreateUserData>({
            mutationFn: createUser,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["user"] })
                toast.success("User Added successfully!")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }

    //pang update ng lahat ng User
    const useUpdateUsers = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: updateUsers,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['users'] })
                queryClient.invalidateQueries({ queryKey: ['user-registration-stats'] })
                toast.success('User updated successfully!')
            },
            onError: (error) => {
                toast.error(error.message)
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
                toast.success("User deleted successfully!")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }

    //for charts
    const useUserRoleStats = () => {
        return useQuery<RoleStatsResponse>({
            queryKey: ["user-role-stats"],
            queryFn: getUserRoleStats,
        })
    }




    return { useUsersLists, useCreateUser, useUpdateUsers, useDeleteUsers, useUserRoleStats }
}

