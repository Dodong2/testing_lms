import { UpdateUsersData, CreateUserData, CreateUserResponse } from "@/types/usersManagetypes"

//pang create ng users
export const createUser = async(data: CreateUserData): Promise<CreateUserResponse> => {
    const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })

    if(!res.ok) {
        throw new Error("Failed to add user")
    }

    return res.json()
}

//pang get ng users (for admin)
export const getUsersLists = async() => {
    const res = await fetch('/api/users')
    if(!res.ok) {
        throw new Error('Failed to get user lists')
    }
    return res.json()
}

//pang update ng user (for admin)
export const updateUsers = async({ UserId, data }: UpdateUsersData) => {
    const res = await fetch(`/api/users/${UserId}/updateusers`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    if(!res.ok) {
        throw new Error('Failed to update User')
    }
    return res.json()
}

//pang delte ng user (for admin)
export const deleteUser = async(UserId: string) => {
    const res = await fetch(`/api/users/${UserId}/deleteusers`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
    })

    if(!res.ok) {
        throw new Error('Failed to delete User')
    }

    return res.json()
}