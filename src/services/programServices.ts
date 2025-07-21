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

// types ng update program
interface UpdateProgramData {
    programId: string
    data: {
        title: string
        subtitle: string
        explanation: string
    }
}

// pang-update ng program (for admin)
export const updateProgram = async ({programId, data}: UpdateProgramData) => {
    const res = await fetch(`/api/program/${programId}/updateprograms`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    if(!res.ok) {
        throw new Error('Failed to update program')
    }

    return res.json()
}