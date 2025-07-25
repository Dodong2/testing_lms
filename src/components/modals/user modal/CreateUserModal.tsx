/* Para sa paggawa ng program for admin */
'use client'
import { CreateUser } from "@/hooks/users/CreateUser"
import { CreateUserData } from "@/types/usersManagetypes"

interface ActionProps {
    onClose: () => void
    onSuccess:() => void
}

const CreateUserModal = ({ onClose, onSuccess }: ActionProps) => {
    const { formData, setFormData, handleCreateUser, isPending } = CreateUser({ onSuccess })
    
  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleCreateUser}>
          <h2>Create User</h2>
          <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value})} required />
          <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value})} required />
          {/* options for role */}
          <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as CreateUserData["role"] })}>
            <option value="BENEFICIARY">Beneficiary</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>    
          </select>

          <button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Add User'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </form>
       </div>
    </div>
  )
}

export default CreateUserModal