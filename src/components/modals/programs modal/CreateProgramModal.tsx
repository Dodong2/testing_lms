/* Para sa paggawa ng program for admin */
'use client'
import { CreatePrograms } from "@/hooks/program/CreatePrograms"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface ActionProps {
    onClose: () => void
    onSuccess:() => void
}

const CreateProgramModal = ({ onClose, onSuccess }: ActionProps) => {
    const { formData, setFormData, handleCreateProgram, isPending } = CreatePrograms({ onSuccess })
    useLockBodyScroll(true)
    
  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleCreateProgram} className="space-y-5 text-gray-800">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Create Program</h2>
          <p className="text-1xl font-semibold text-gray-500 text-center">Create a new program extension.</p>
          <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value})} required className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"/>
          <input placeholder="subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value})} required className="w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"/>
          <textarea rows={5} placeholder="description" value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value})} required className="w-full p-2 pb-2 rounded border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"/>
          {/* <input placeholder="Emails (comma-separated)" value={formData.emails} onChange={(e) => setFormData({ ...formData, emails: e.target.value})} /> */}
          <div className="flex justify-center space-x-6 pt-4">
          <button onClick={onClose} className="px-6 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
            Cancel
            </button>
            <button type="submit" disabled={isPending} className="px-6 py-2 bg-[#2ECC40] text-white font-medium rounded-full shadow-lg hover:bg-green-600 duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
            {isPending ? 'Creating...' : 'Create'}
          </button>
          </div>
        </form>
       </div>
    </div>
  )
}

export default CreateProgramModal