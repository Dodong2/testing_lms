/* Para sa paggawa ng program for admin */
import { useProgram } from "./useProgram"
import { useState } from "react"

export const CreatePrograms = ({ onSuccess }: { onSuccess: () => void }) => {
    const { mutate: createProgram, isPending } = useProgram().useCreateProgram()
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

    createProgram({ ...formData, emails }, {
      onSuccess: () => {
        setFormData({ title: '', subtitle: '', explanation: '', emails: '' })
            onSuccess()
        
      }
    })
  }

  return { formData, setFormData, handleCreateProgram, isPending }
}

