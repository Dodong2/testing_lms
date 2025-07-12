
//pang get ng users (for admin)
export const getUsersLists = async() => {
    const res = await fetch('http://localhost:3000/api/users')
    if(!res.ok) {
        throw new Error('Failed to get user lists')
    }
    return res.json()
}



