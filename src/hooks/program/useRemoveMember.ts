import { useState } from "react"
import { useProgram } from "./useProgram"
import toast from "react-hot-toast"

export const useRemoveMember = (programId: string) => {
    const { mutateAsync: removeMember, isPending } = useProgram().useRemoveProgramMember()

    const [selectedEmails, setSelectedEmails] = useState<string[]>([])
    const [removingEmails, setRemovingEmails] = useState<string[]>([])

    const handleToggleEmail = (email: string, isChecked: boolean) => {
        setSelectedEmails((prev) =>
            isChecked ? [...prev, email] : prev.filter((e) => e !== email)
        )
    }

    const handleRemove = async () => {
        // if wealang re-remove
        if (selectedEmails.length === 0) {
            toast.error(`Nothing to remove`)
            return
        }

        setRemovingEmails(selectedEmails)

        // wrap with toast.promise for proper flow
        await toast.promise(
            Promise.all(
                selectedEmails.map((email) => removeMember({ programId, email }))
            ),
            {
                loading: "Removing selected members...",
                success: `${selectedEmails.length} member${selectedEmails.length > 1 ? "s" : ""} removed successfully`,
                error: "Failed to remove one or more members",
            }
        )

        setSelectedEmails([])
        setRemovingEmails([])
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

