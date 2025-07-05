'use client'
/* para sa pag add ng Learners & Members */
import { AddMembers } from "@/hooks/program/AddMembers"

interface AddProgramMembersProps {
  programId: string
}

const AddProgramMembers = ({ programId }: AddProgramMembersProps) => {
  const { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit } = AddMembers({ programId })

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Add emails (comma separated)" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
      <button type="button" onClick={handleAddToList}>Add Learners</button>

      <ul>
        {emailLists.map((email, idx) => (
          <li key={idx}>{email}</li>
        ))}
      </ul>

        {emailLists.length > 0 && (
          <button type="submit">Add Members</button>
        )}

    </form>
  )
}

export default AddProgramMembers