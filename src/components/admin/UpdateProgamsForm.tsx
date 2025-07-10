import { UpdatePrograms } from "@/hooks/program/UpdatePrograms"

interface updateProgramProps {
    programId: string
    initialData: {
        title: string
        subtitle: string
        explanation: string
    }
    onSuccess?: () => void
}

const UpdateProgamsForm = ({ programId, initialData, onSuccess }: updateProgramProps) => {
    const { formData, handleChange, handleSubmit, isPending } = UpdatePrograms({ programId, initialData, onSuccess })

  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={formData.title} onChange={handleChange} className="border p-2 w-full" required />
            <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="border p-2 w-full" required />
            <label>Explanation</label>
            <textarea name="explanation" value={formData.explanation} onChange={handleChange} className="border p-2 w-full"/>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" disabled={isPending}>{isPending ? 'Updating...' : 'Update Program'}</button>
        </form>
    </div>
  )
}

export default UpdateProgamsForm