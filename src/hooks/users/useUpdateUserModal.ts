import { useState } from "react"
import { usersLists } from "@/types/usersManagetypes"

export const useUpdateUserModal = () => {
    const [selectedUser, setSelectedUser] = useState<usersLists | null>(null)
    const [isUpdateModal, setIsUpdateModal] = useState(false)

    const openUpdateModal = (user: usersLists) => {
        setSelectedUser({
            ...user,
            ProgramMember: user.ProgramMember ?? [],
        })
        setIsUpdateModal(true)
    }

    const closeUpdateModal = () => {
        setIsUpdateModal(false)
        setSelectedUser(null)
    }

    return { selectedUser, isUpdateModal, openUpdateModal, closeUpdateModal }
}

