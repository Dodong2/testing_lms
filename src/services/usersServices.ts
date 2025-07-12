import { UpdateUsersData } from "@/types/usersManagetypes"
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


