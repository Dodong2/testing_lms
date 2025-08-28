import { useState } from "react"
import { PostGetTypes } from "@/types/postManagetypes"

export const useOpenPostModal = () => {
    const [selectedPost, setSelectedPost] = useState<PostGetTypes | null>(null)
    const [OpenUpdate, setOpenUpdate] = useState(false)
    const [OpenDelete, setOpenDelete] = useState(false)

    const handleToggleUpdateModal = (post: PostGetTypes) => {
        setSelectedPost(post)
        setOpenUpdate((prev) => ! prev)
    }

    const handleToggleDeleteModal = (post: PostGetTypes) => {
        setSelectedPost(post)
        setOpenDelete((prev) => !prev)
    }

    return { selectedPost, OpenUpdate, handleToggleUpdateModal, OpenDelete, handleToggleDeleteModal }
}
