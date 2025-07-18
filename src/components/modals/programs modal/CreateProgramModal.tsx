/* Para sa paggawa ng program for admin */
'use client'
import { CreatePrograms } from "@/hooks/program/CreatePrograms"

interface ActionProps {
    onClose: () => void
    onSuccess:() => void
}

const CreateProgramModal = ({ onClose, onSuccess }: ActionProps) => {
    const { formData, setFormData, handleCreateProgram, isPending } = CreatePrograms({ onSuccess })
    
  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleCreateProgram}>
          <h2>Create Program</h2>
          <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value})} required />
          <input placeholder="subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value})} required />
          <input placeholder="explanation" value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value})} required />
          <input placeholder="Emails (comma-separated)" value={formData.emails} onChange={(e) => setFormData({ ...formData, emails: e.target.value})} />
          <button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </form>
       </div>
    </div>
  )
}

export default CreateProgramModal