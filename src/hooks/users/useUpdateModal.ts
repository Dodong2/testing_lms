import { useState } from "react"
import { usersLists } from "@/types/usersManagetypes"

export const useUpdateModal = () => {
    const [selectedUser, setSelectedUser] = useState<usersLists | null>(null)
    const [isUpdateModal, setIsUpdateModal] = useState(false)

    const openUpdateModal = (user: usersLists) => {
        setSelectedUser(user)
        setIsUpdateModal(true)
    }

    const closeUpdateModal = () => {
        setIsUpdateModal(false)
        setSelectedUser(null)
    }

    return { selectedUser, isUpdateModal, openUpdateModal, closeUpdateModal }
}

