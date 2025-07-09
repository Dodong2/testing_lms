'use client'
/* para sa pag add ng Learners & Members */
import { AddMembers } from "@/hooks/program/AddMembers"

interface AddProgramMembersProps {
  programId: string
  title: string
}

const AddProgramMembers = ({ programId, title }: AddProgramMembersProps) => {
  const { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit } = AddMembers({ programId })

  return (
    <form onSubmit={handleSubmit}>
      <h1>added members on {title}</h1>
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