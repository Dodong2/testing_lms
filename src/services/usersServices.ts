import { apiFetch } from "./apiClient"
import { UpdateUsersData, CreateUserData, CreateUserResponse, usersLists } from "@/types/usersManagetypes"

//pang create ng users
export const createUser = async(data: CreateUserData) => {
        return apiFetch<CreateUserResponse>("/api/register", {
            method: "POST",
            body: JSON.stringify(data)
        })
}

//pang get ng users (for admin)
export const getUsersLists = async(): Promise<usersLists[]> => {
    return apiFetch<usersLists[]>("/api/users")
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