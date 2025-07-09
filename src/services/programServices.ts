
// pang get lahat ng programs (for all roles)
export const getPrograms = async() => {
    const res = await fetch('/api/program')
    if(!res.ok) {
        throw new Error('Failed to fetch programs')
    }
    return res.json()
}

// types ng create Program
interface ProgramData {
    title: string
    subtitle: string
    explanation: string
    emails: string[]
}
// para pang create ng Programs (for admin)
export const createProgram = async(data: ProgramData) => {
    const res = await fetch('/api/program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if(!res.ok) {
        throw new Error('Failed to create program')
    }
    return res.json()
}

// pang add ng members sa existing program (for admin)
export const addProgramMembers = async(programId: string, emails: string[]) => {
    const res = await fetch(`/api/program/${programId}/addmembers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
    })
    if(!res.ok) {
        throw new Error('Failed to add members')
    }
    return res.json()
}

//pang counts kung ilang beneficiary at instructors (for admin)
export const getAllProgramMemberCounts = async () => {
  const res = await fetch(`/api/program/member-counts`)
  if (!res.ok) throw new Error("Failed to fetch member counts")
  return res.json()
}

// pang-delete ng programs (for admin)
export const deletePrograms = async (programId: string) => {
    const res = await fetch(`/api/program/${programId}/deleteprograms`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })

    if(!res.ok) {
        throw new Error('Failed to delete program')
    }

    return res.json()
}