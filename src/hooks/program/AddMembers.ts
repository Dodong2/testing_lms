/* para sa pag add ng Learners & Members */
import { useProgram } from "./useProgram"
import { useState } from "react"

interface addProgramMembersProps {
    programId: string
    onSuccess: () => void
}

export const useAddMembers = ({ programId, onSuccess }: addProgramMembersProps) => {
    const [ emailInput, setEmailInput ] = useState('')
    const [ emailLists, setEmailLists ] = useState<string[]>([])
    const { useAddProgramMembers } = useProgram()
    const {mutate: addMembers, isPending} = useAddProgramMembers()

    const handleAddToList = () => {
        const emails = emailInput
        .split(',')
        .map(e => e.trim())
        .filter(e => e && !emailLists.includes(e))
        setEmailLists(prev => [ ...prev, ...emails ])
        setEmailInput('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(!emailLists.length) return
        addMembers({ programId, emails: emailLists }, {
            onSuccess: () => {
                setEmailLists([])
                onSuccess()
            }
        })
    }
    

 return { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit, isPending }
}


