import { DeletePost } from "@/hooks/post/DeletePost"

interface DeletePostProps {
    programId: string
    postId: string
    onSuccess?: () => void
    onClose: () => void
}

const DeletePostModal = ({ programId, postId, onSuccess, onClose }: DeletePostProps) => {
    const { isPending, handleConfirmDelete } = DeletePost({programId, postId, onSuccess})
  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p className="mb-4">Are you sure you want to delete?</p>
            <div className="flex justify-end space-x-2">
                <button onClick={handleConfirmDelete} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default DeletePostModal