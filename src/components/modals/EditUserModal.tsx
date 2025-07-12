'use client'
import { UpdateUsers } from "@/hooks/users/UpdateUser"

interface EditUserModalProps {
  UserId: string
  initialData: {
    name: string
    email: string
    role: string
  }
  onClose: () => void
  onSuccess: () => void
}

 const EditUserModal = ({ UserId, initialData, onClose, onSuccess }: EditUserModalProps) => {
    const { formData,handleChange, handleSubmit, isPending } = UpdateUsers({
        UserId, initialData, onSuccess,
    })
   return (
     <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="name"/>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"/>
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role"/>
                <button type="button" onClick={onClose}>cancel</button><br/>
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save' }
                </button>
            </form>
        </div>
     </div>
   )
 }
 
 export default EditUserModal