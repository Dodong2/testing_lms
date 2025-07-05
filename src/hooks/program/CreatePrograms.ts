/* Para sa paggawa ng program for admin */
import { useProgram } from "./useProgram"
import { useState } from "react"

export const CreatePrograms = () => {
    const { useCreateProgram } = useProgram()
    const createProgram = useCreateProgram()
    const [ formData, setFormData ] = useState({
        title: '',
        subtitle: '',
        explanation: '',
        emails: ''
    })

    //button for creating programs
    const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault()
    const emails = formData.emails.split(',').map(e => e.trim())

    createProgram.mutate({ ...formData, emails }, {
      onSuccess: () => {
        setFormData({ title: '', subtitle: '', explanation: '', emails: '' })
      }
    })
  }


  return { formData, setFormData, handleCreateProgram }
}

