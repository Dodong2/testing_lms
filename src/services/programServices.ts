
// pang get ng program
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
// para pang create ng Program
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

// pang add ng members sa existing program
export const addProgramMembers = async(programId: string, emails: string[]) => {
    const res = await fetch(`/api/program/${programId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
    })
    if(!res.ok) {
        throw new Error('Failed to add members')
        return res.json()
    }
}

