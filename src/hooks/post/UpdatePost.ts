'use client'
import { useState } from "react"
import { usePost } from "./usePost"

interface UpdatePostProps {
    programId: string
    postId: string
    content: string
    onSuccess?: () => void
}

export const UpdatePost = ({ programId, postId, content, onSuccess }: UpdatePostProps) => {
    const { mutate: updatePosts, isPending } = usePost(programId).useUpdatePost()
    const [contentData, setContentData] = useState(content)


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updatePosts({ postId, content: contentData }, { onSuccess: () => onSuccess?.() })
    }

    return { isPending, setContentData, handleSubmit }

}
