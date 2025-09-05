import { apiFetch } from "./apiClient"
import { UpdateUsersData, CreateUserData, CreateUserResponse, UsersResponsePaginated } from "@/types/usersManagetypes"

//pang create ng users
export const createUser = async(data: CreateUserData) => {
        return apiFetch<CreateUserResponse>("/api/register", {
            method: "POST",
            body: JSON.stringify(data)
        })
}

//pang get ng users (for admin)
export const getUsersLists = async(page: number, search: string): Promise<UsersResponsePaginated> => {
    return apiFetch<UsersResponsePaginated>(`/api/users?page=${page}&search=${search}`)
}

//pang update ng user (for admin)
export const updateUsers = async({ UserId, data }: UpdateUsersData) => {
    return apiFetch(`/api/users/${UserId}/updateusers`, {
        method: "PATCH",
        body: JSON.stringify(data)
    })


}

//pang delte ng user (for admin)
export const deleteUser = async(UserId: string) => {
    return apiFetch(`/api/users/${UserId}/deleteusers`, {
        method: "DELETE"
    })
}