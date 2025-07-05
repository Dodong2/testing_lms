/* para sa pag add ng Learners & Members */
import { useProgram } from "./useProgram"
import { useState } from "react"

interface addProgramMembersProps {
    programId: string
}

export const AddMembers = ({ programId }: addProgramMembersProps) => {
    const [ emailInput, setEmailInput ] = useState('')
    const [ emailLists, setEmailLists ] = useState<string[]>([])
    const { useAddProgramMembers } = useProgram()
    const addMembers = useAddProgramMembers()

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
        addMembers.mutate({ programId, emails: emailLists }, {
            onSuccess: () => {
                alert('Emails added to program')
                setEmailLists([])
            }
        })
    }
    

 return { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit }
}


