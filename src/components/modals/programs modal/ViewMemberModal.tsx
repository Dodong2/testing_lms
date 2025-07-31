'use client'
/* para sa pag add ng Learners & Members */
import { AddMembers } from "@/hooks/program/AddMembers"
import { useRemoveMember } from "@/hooks/program/useRemoveMember"

interface AddProgramMembersProps {
  programId: string
  title: string
  onSuccess: () => void
  onClose: () => void
  existingMembers: { email: string; name: string; role: string }[]
} 

const ViewMemberModal = ({ programId, title, onClose, onSuccess , existingMembers }: AddProgramMembersProps) => {
  const { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit, isPending } = AddMembers({ programId, onSuccess })
  const { selectedEmails, handleToggleEmail, handleRemove, isRemoving } = useRemoveMember(programId, onSuccess)

  

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

        <hr />

    <h3>Existing Members</h3>
    <button type="button" onClick={handleRemove} disabled={isRemoving}>
                {isRemoving ? 'Removing...' : `Remove (${selectedEmails.length})` }
              </button>
        <ul>
          {existingMembers.map((member) => (
            <li key={member.email} className="flex justify-between items-center">
              <span>{member.email}</span>
              <input type="checkbox" checked={selectedEmails.includes(member.email)}
              onChange={(e) => handleToggleEmail(member.email, e.target.checked)}
              />
                
            </li>
          ))}
        </ul>


    </div>
    </div>
  )
}

export default ViewMemberModal