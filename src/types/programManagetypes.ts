// types for useProgramModal hooks
export interface programsTypes {
    id: string
    title:string
    subtitle: string
    explanation: string
    memberCounts?: ProgramCounts
}
//types extend ng programsTypes
export interface ProgramCounts {
  instructors: number
  beneficiaries: number
}

//types for UpdatePrograms.ts hooks
export interface updateProgramProps {
    programId: string
    initialData: {
        title: string
        subtitle: string
        explanation: string
    }
    onSuccess?: () => void
}

//types for 
export interface addMembersProps {
    programId: string
    title: string
}

// types for get program (paginated & search)
export interface ProgramGetTypes {
  id: string
  title: string
  subtitle: string
  explanation: string
  totalMembers: number
  createdAt: string
  memberCounts?: {
    instructors: number
    beneficiaries: number
  }
  joined: boolean
  pending: boolean
}