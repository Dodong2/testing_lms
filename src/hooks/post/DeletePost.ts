import { usePost } from "./usePost"

interface DeletePostProps {
    programId: string
    postId: string
    onSuccess?: () => void
}

export const DeletePost = ({ programId, postId, onSuccess }: DeletePostProps) => {
    const { mutate: deletePosts, isPending } = usePost(programId).useDeletePost()

    const handleConfirmDelete = () => {
        deletePosts({ postId }, { onSuccess: () => onSuccess?.() })
    }
    
    return { isPending, handleConfirmDelete }
}
