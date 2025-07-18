import { useState } from "react"

export const useCreateProgramsModal = () => {
    const [createModal, setCreateModal] = useState(false)

    const openCreateModal = () => {
        setCreateModal(true)
    }
    
    const closeCreateModal = () => {
        setCreateModal(false)
    }
    
    return { createModal, openCreateModal, closeCreateModal }
}

