'use client'
import { useState } from "react"
import { useProgram } from "./useProgram"

export const DeletePrograms = () => {
 const { useDeletePrograms } = useProgram()
 const { mutate: deleteProgram } = useDeletePrograms(() => {
   setProgramToDelete(null)
 })
 const [programToDelete, setProgramToDelete] = useState<string | null>(null)

 

 const confirmDelete = (programId: string) => {
    setProgramToDelete(programId)
 }

 const handleConfirm = () => {
    if(programToDelete) {
        deleteProgram(programToDelete)
    }
 }

 const handleCancel = () => {
    setProgramToDelete(null)
 }

 return { confirmDelete, handleConfirm, handleCancel }
}

