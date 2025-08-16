import { apiFetch } from "./apiClient"

// pang get lahat ng programs (for all roles)
export const getPrograms = async() => {
    return apiFetch('/api/program')
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
    return apiFetch('/api/program', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

// pang add ng members sa existing program (for admin)
export const addProgramMembers = async(programId: string, emails: string[]) => {
    return apiFetch(`/api/program/${programId}/addmembers`, {
        method: 'POST',
        body: JSON.stringify({ emails })
    })
}

// pang-delete ng programs (for admin)
export const deletePrograms = async (programId: string) => {
    return apiFetch(`/api/program/${programId}/deleteprograms`, {
        method: 'DELETE'
    })
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
    return apiFetch(`/api/program/${programId}/updateprograms`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}

export const removeProgramMember = async(programId: string, email: string) => {
    return apiFetch(`/api/program/${programId}/removemember`, {
        method: 'DELETE',
        body: JSON.stringify({ email })
    })
}

//types ng getProgramId
export interface ProgramWithMembers {
  id: string
  title: string
  description?: string | null
  createdAt: string
  updatedAt: string
  members: {
    user: {
      id: string
      email: string
      name: string
      role: "ADMIN" | "INSTRUCTOR" | "BENEFICIARY"
    }
  }[]
}
// pang get ng program pero per ID
export const getProgramById = async(programId: string): Promise<ProgramWithMembers> => {
    return apiFetch<ProgramWithMembers>(`/api/program/${programId}`)
}