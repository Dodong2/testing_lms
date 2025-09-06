import { UpdatePost } from "@/hooks/post/UpdatePost"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface UpdatePostProps {
    programId: string
    postId: string
    content: string
    onSuccess?: () => void
    onClose: () => void
}

const UpdatePostModal = ({ programId, postId, content, onSuccess, onClose }: UpdatePostProps) => {
    const { isPending, setContentData, handleSubmit } = UpdatePost({ programId, postId, content, onSuccess })
    useLockBodyScroll(true)

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="content" defaultValue={content} onChange={(e) => setContentData(e.target.value)} placeholder="" />
                    <button type='submit' disabled={isPending}>{isPending ? 'Updating...' : 'update'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    )
}
export default UpdatePostModal