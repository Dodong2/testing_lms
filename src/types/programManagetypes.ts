// types for get user in useUsersLists hooks
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