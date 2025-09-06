'use client'
/* icons */
import { IoMdAlert } from "react-icons/io";
import { DeleteUserModalProps } from "@/types/usersManagetypes"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

 const DeleteUserModal = ({ userName, onConfirm, isDeleting, onCancel }: DeleteUserModalProps) => {
    useLockBodyScroll(true)

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <div className="text-lg font-semibold mb-4 flex items-center gap-3"><IoMdAlert size={40} className="text-red-500"/> <span>Delete Confirmation</span></div>
            <p className="mb-4">Are you sure you want to delete <strong>{userName}</strong>?</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancel</button>
                <button onClick={onConfirm} disabled={isDeleting} className="px-6 py-2 text-white rounded-md transition duration-150 ease-in-out bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
  )
}
 export default DeleteUserModal
