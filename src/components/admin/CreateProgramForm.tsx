/* Para sa paggawa ng program for admin */
'use client'
import { CreatePrograms } from "@/hooks/program/CreatePrograms"

const CreateProgramForm = () => {
    const { formData, setFormData, handleCreateProgram } = CreatePrograms()
    
  return (
    <>
        <form onSubmit={handleCreateProgram}>
          <h2>Create Program</h2>
          <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value})} required />
          <input placeholder="subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value})} required />
          <input placeholder="explanation" value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value})} required />
          <input placeholder="Emails (comma-separated)" value={formData.emails} onChange={(e) => setFormData({ ...formData, emails: e.target.value})} />
          <button type="submit">Create Program</button>
        </form>
    </>
  )
}

export default CreateProgramForm