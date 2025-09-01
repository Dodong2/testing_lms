'use client'
import { DeletePost } from "@/hooks/post/DeletePost"
/* icons */
import { IoMdAlert } from "react-icons/io";
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
            <div className="text-lg font-semibold mb-4 flex items-center gap-3"><IoMdAlert size={40} className="text-red-500"/> <span>Delete Confirmation</span></div>
            <p className="mb-4">Are you sure you want to this post?</p>
            <div className="flex justify-end space-x-3">
                <button onClick={onClose} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">No, cancel</button>
                <button onClick={handleConfirmDelete} disabled={isPending} className="px-6 py-2 text-white rounded-md transition duration-150 ease-in-out bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    {isPending ? 'Deleting...' : 'Yes, I\'m sure'}
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeletePostModal