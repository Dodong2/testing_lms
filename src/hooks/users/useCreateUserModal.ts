import { useState } from "react"

export const useCreateUserModal = () => {
    const [openCreateUser, setOpenCreateUser] = useState(false)

    const handleOpenCreateUser = () => {
        setOpenCreateUser(true)
    }

    const handleCloseCreateUser = () => {
        setOpenCreateUser(false)
    }

    return { openCreateUser, handleCloseCreateUser, handleOpenCreateUser }
}