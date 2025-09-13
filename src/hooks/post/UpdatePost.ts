'use client'
import { useState } from "react"
import { usePost } from "./usePost"
import { FileMeta } from "@/types/postManagetypes"

interface UpdatePostProps {
    programId: string
    postId: string
    content: string
    files?: FileMeta[];
    deadline?: string
    onSuccess?: () => void
}

export const UpdatePost = ({ programId, postId, content, files = [], deadline, onSuccess }: UpdatePostProps) => {
    const { mutate: updatePosts, isPending } = usePost(programId).useUpdatePost()
    const [contentData, setContentData] = useState(content)
    const [filesData, setFilesData] = useState<FileMeta[]>(files)
    const [deadlineData, setDeadlineData] = useState(deadline)


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updatePosts({ postId, payload: {content: contentData, files: filesData, deadline: deadlineData } }, { onSuccess: () => onSuccess?.() })
    }

    return { isPending, setContentData, filesData ,setFilesData, setDeadlineData ,handleSubmit }

}
