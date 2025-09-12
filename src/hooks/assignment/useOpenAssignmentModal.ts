"use client"
import { useState } from "react"

export const useOpenAssignmentModal = () => {
    const [openCreate, setOpenCreate] = useState(false)

    const toggleOpenAssignment = () => {
        setOpenCreate((prev) => !prev )
    }

    return { openCreate, toggleOpenAssignment }
}
