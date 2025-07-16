'use client'
import { useState } from "react"
import { usersLists } from "@/types/usersManagetypes"
import { useUsers } from "./useUsers"

export const DeleteUser = () => {
    const { useDeleteUsers } = useUsers()
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUsers()
    const [selectedDeleteUser, setSelectedDeleteUser] = useState<usersLists | null>(null)
    const [deleteModal, setDeleteModal] = useState(false)

    const openDeleteModal = (user: usersLists) => {
        setSelectedDeleteUser(user)
        setDeleteModal(true)
        
    }

    const closeDeleteModal = () => {
        setDeleteModal(false)
        setSelectedDeleteUser(null)
    }

    const handleConfirmDelete = () => {
        if(!selectedDeleteUser) return
        deleteUser(selectedDeleteUser.id, {
            onSuccess: () => {
                closeDeleteModal()
            }
        })
    }

 return { deleteModal, selectedDeleteUser, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting }
}

