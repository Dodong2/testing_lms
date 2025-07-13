// types for useProgramModal hooks
export interface programsTypes {
    id: string
    title:string
    subtitle: string
    explanation: string
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