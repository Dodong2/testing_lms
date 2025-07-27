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
  programs: ProgramMembership[]
  
}

type ProgramMembership = {
  program: {
    id: string;
    title: string;
  };
};

 const EditUserModal = ({ UserId, initialData, onClose, onSuccess, programs }: EditUserModalProps) => {
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
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save' }
                </button>
                <button type="button" onClick={onClose}>cancel</button>
            </form>
            {/* user program are in */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Programs:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {programs.length > 0 ? (
                  programs.map(({ program }) => (
                    <li key={program.id}>{program.title}</li>
                  ))
                ): (
                  <li>No assigned programs</li>
                )}
              </ul>
            </div>
        </div>
     </div>
   )
 }
 
 export default EditUserModal