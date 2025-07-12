'use client'
import React, { useState } from "react"
import { useUsers } from "./useUsers"
import { UpdateUsersProps } from "@/types/usersManagetypes"
import toast from "react-hot-toast"

export const UpdateUsers = ({ UserId, initialData, onSuccess }: UpdateUsersProps) => {
    const { useUpdateUsers } = useUsers()
    const { mutate: updateUser, isPending } = useUpdateUsers()
    const [formData, setFormData] = useState(initialData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev =>  ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateUser(
            { UserId, data: formData },
            { onSuccess: () => {
                toast.success('User updated successfully!')
                onSuccess?.()
            } }
        )
    }

   

    return { formData, handleChange, handleSubmit, isPending }
}

