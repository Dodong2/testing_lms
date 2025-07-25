'use client'
/* services */
import { getUsersLists, createUser, updateUsers, deleteUser } from "@/services/usersServices"
/* react query */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
/* types */
import { CreateUserData, CreateUserResponse, usersLists } from "@/types/usersManagetypes"
import toast from "react-hot-toast"

export const useUsers = () => {
    
    //pang get ng lahat ng User lists
    const useUsersLists = () => {
        return useQuery<usersLists[]>({
        queryKey: ['users'],
        queryFn: getUsersLists
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




    return { useUsersLists, useCreateUser, useUpdateUsers, useDeleteUsers }
}

