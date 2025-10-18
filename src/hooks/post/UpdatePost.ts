'use client'
import { useState } from "react"
import { usePost } from "./usePost"
import { FileMeta } from "@/types/postManagetypes"
import { title } from "process"

interface UpdatePostProps {
    programId: string
    postId: string
    title: string
    content: string
    files?: FileMeta[];
    deadline?: string
    onSuccess?: () => void
}

export const UpdatePost = ({ programId, postId,  content, files = [], deadline, onSuccess }: UpdatePostProps) => {
    const { mutate: updatePosts, isPending } = usePost(programId).useUpdatePost()
    const [titleData, setTitleData] = useState(title)
    const [contentData, setContentData] = useState(content)
    const [filesData, setFilesData] = useState<FileMeta[]>(files)
    const [deadlineData, setDeadlineData] = useState(deadline)


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updatePosts({ postId, payload: {title: titleData, content: contentData, files: filesData, deadline: deadlineData } }, { onSuccess: () => onSuccess?.() })
    }

    return { isPending, setTitleData, setContentData, filesData ,setFilesData, setDeadlineData ,handleSubmit }

}
