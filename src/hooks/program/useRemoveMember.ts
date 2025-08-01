import { useState } from "react"
import { useProgram } from "./useProgram"
import toast from "react-hot-toast"

export const useRemoveMember = (programId: string) => {
    const { mutate: removeMember, isPending } = useProgram().useRemoveProgramMember()

    const [selectedEmails, setSelectedEmails] = useState<string[]>([])
    const [removingEmails, setRemovingEmails] = useState<string[]>([])

    const handleToggleEmail = (email: string, isChecked: boolean) => {
        setSelectedEmails((prev) => 
            isChecked ? [...prev, email] : prev.filter((e) => e !== email)
        )
    }

    const handleRemove = async () => {
        setRemovingEmails(selectedEmails)
        for (const email of selectedEmails) {
            await removeMember({ programId, email })
        }
        setSelectedEmails([])
        setRemovingEmails([])
        //for counts
        const counts = selectedEmails.length
        toast.success(`${counts} Members removed successfully`)


        
        if(selectedEmails.length === 0) {
            toast.error(`Nothing to remove`)
             return
        }
    }
    


    return {
        selectedEmails,
        setSelectedEmails,
        handleToggleEmail,
        isRemoving: isPending,
        handleRemove,
        removingEmails,
    }
}

