'use client'
import { useProgram } from "./useProgram";
import { useState } from "react";

interface updateProgramProps {
    programId: string
    initialData: {
        title: string
        subtitle: string
        explanation: string
    }
    onSuccess?: () => void
}

export const UpdatePrograms = ({ programId, initialData, onSuccess }: updateProgramProps) => {
  const { useUpdatePrograms } = useProgram()
  const {mutate: updatePrograms, isPending} = useUpdatePrograms()
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updatePrograms(
        { programId, data: formData },
        { onSuccess: () => {
            alert("Program updated successfully!")
            onSuccess?.()
        } }
    )
  }


  return { formData, handleChange, handleSubmit, isPending }
}

 