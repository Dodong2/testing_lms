import { useState } from "react"

export const usePostModal = () => {
    const [openPost, setOpenPost] = useState(false)

    const OpenPostModal = () => {
        setOpenPost(true)
    }

    const ClosePostModal = () => {
        setOpenPost(false)
    }

    return { openPost, OpenPostModal, ClosePostModal }
}

