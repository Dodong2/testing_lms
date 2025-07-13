'use client'
/* para sa pag add ng Learners & Members */
import { AddMembers } from "@/hooks/program/AddMembers"

interface AddProgramMembersProps {
  programId: string
  title: string
  onSuccess: () => void
  onClose: () => void
} 

const AddMemberModal = ({ programId, title, onClose, onSuccess }: AddProgramMembersProps) => {
  const { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit, isPending } = AddMembers({ programId, onSuccess })

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50"  style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
    <form onSubmit={handleSubmit}>
      <h1>added members on {title}</h1>
      <input type="email" placeholder="Add emails (comma separated)" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
      <button onClick={onClose}>Cancel</button>
      <button type="button" onClick={handleAddToList}>Add Learners</button>

      <ul>
        {emailLists.map((email, idx) => (
          <li key={idx}>{email}</li>
        ))}
      </ul>

        {emailLists.length > 0 && (
          <button type="submit" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Members'}
          </button>
        )}

    </form>
    </div>
    </div>
  )
}

export default AddMemberModal 