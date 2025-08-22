
import { useState } from "react"
import toast from "react-hot-toast"
import { useFeedback } from "./useFeedback"

export const useCreateFeedback = () => {
    const { mutate: createFeedback, isPending } = useFeedback().useCreateFeedback()
    const [programId, setProgramId] = useState<string>("")
    const [visibility, setVisibility] = useState<"Anonymous" | "Identified">("Anonymous")
    const [type, setType] = useState<string>("Bug Report")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")

    const resetForm = () => {
        setProgramId("")
        setVisibility("Anonymous")
        setType("Bug Report")
        setSubject("")
        setDescription("")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if(!programId) {
            toast.error("Please select a program")
        } 

        createFeedback({
            programId,
            visibility,
            type,
            subject,
            description,
        }, {
            onSuccess: () => {
                resetForm()
            }
        })
    }

    return { handleSubmit, programId, setProgramId, visibility, setVisibility, type, setType, subject, setSubject, description, setDescription, isPending }
}

