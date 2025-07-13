'use client'
import { DeleteUserModalProps } from "@/types/usersManagetypes"

 const DeleteUserModal = ({ userName, onConfirm, isDeleting, onCancel }: DeleteUserModalProps) => {
  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{userName}</strong>?</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
  )
}
 export default DeleteUserModal
