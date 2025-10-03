import { UpdatePrograms } from "@/hooks/program/UpdatePrograms"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface updateProgramProps {
    programId: string
    initialData: {
        title: string
        subtitle: string
        explanation: string
    }
    onSuccess?: () => void
    onClose: () => void
}

const UpdateProgamsModal = ({ programId, initialData, onClose, onSuccess }: updateProgramProps) => {
    const { formData, handleChange, handleSubmit, isPending } = UpdatePrograms({ programId, initialData, onSuccess })
    useLockBodyScroll(true)

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Edit Program</h2>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Program Details</h3>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"/>
            <input name="subtitle" value={formData.subtitle} onChange={handleChange} required className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"/>
            <label>Explanation</label>
            <textarea rows={5} name="explanation" value={formData.explanation} onChange={handleChange} className="w-full p-2 pb-2 rounded border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"/>
            <div className="flex justify-center space-x-6 pt-4">
            <button onClick={onClose} className="px-6 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">Cancel</button>
            <button type="submit" disabled={isPending} className="px-6 py-2 bg-[#2ECC40] text-white font-medium rounded-full shadow-lg hover:bg-green-600 duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">{isPending ? 'Updating...' : 'Save'}</button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default UpdateProgamsModal