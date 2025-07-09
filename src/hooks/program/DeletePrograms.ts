'use client'
import { useProgram } from "./useProgram"

export const DeletePrograms = () => {
 const { useDeletePrograms } = useProgram()
 const deleteProgram = useDeletePrograms()

 const handleDelete = (programId: string) => {
    if(confirm("Are you sure you want to delete this program?")){
        deleteProgram.mutate(programId)
    }
 }

 return { handleDelete }
}

