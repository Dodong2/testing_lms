"use client"
import { CreateAssignment } from "@/hooks/assignment/CreateAssignments"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface AssignmentFormProps {
    programId: string
    onSuccess: () => void
    onClose: () => void
}

const CreateAssignmentModal = ({ programId, onSuccess, onClose }: AssignmentFormProps) => {
    const { formData, setFormData, handleCreateAssignment, isPending } = CreateAssignment({ programId, onSuccess })
    useLockBodyScroll(true)

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
             <form onSubmit={handleCreateAssignment} className="space-y-5 text-gray-800">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            Create Assignment
          </h2>
          <p className="text-1xl font-semibold text-gray-500 text-center">
            Add a new assignment for this program.
          </p>

          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />

          <div className="flex justify-center space-x-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#2ECC40] text-white font-medium rounded-full shadow-lg hover:bg-green-600 duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform"
            >
              {isPending ? "Creating..." : "Add Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAssignmentModal