/* Para sa paggawa ng program for admin */
'use client'
import { CreateUser } from "@/hooks/users/CreateUser"
import { CreateUserData } from "@/types/usersManagetypes"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface ActionProps {
    onClose: () => void
    onSuccess: () => void
}

const CreateUserModal = ({ onClose, onSuccess }: ActionProps) => {
    const { formData, setFormData, handleCreateUser, isPending } = CreateUser({ onSuccess })
    useLockBodyScroll(true)

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <form onSubmit={handleCreateUser} className="space-y-5 text-gray-800">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Create User</h2>
                    <p className="text-1xl font-semibold text-gray-500 text-center">Add a new user to the system.</p>
                    <input
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    />
                    <input
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    />
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as CreateUserData["role"] })}
                        className="w-full pb-2 border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 bg-transparent text-gray-700"
                    >
                        <option value="BENEFICIARY">Beneficiary</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <div className="flex justify-center space-x-6 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer active:scale-95 transition-transform"            >
                            {isPending ? 'Creating...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUserModal