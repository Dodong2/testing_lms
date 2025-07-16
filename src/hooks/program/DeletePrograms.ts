'use client'
import { useState } from "react"
import { useProgram } from "./useProgram"
import { programsTypes } from "@/types/programManagetypes"

export const DeletePrograms = () => {
 const { useDeletePrograms } = useProgram()
 const { mutate: deleteProgram, isPending: isDeleting } = useDeletePrograms()
 const [selectedDeleteProgram, setSelectedDeleteProgram] = useState<programsTypes | null>(null)
 const [deleteModal, setDeleteModal] = useState(false)


 const openDeleteModal = (program: programsTypes) => {
    setSelectedDeleteProgram(program)
    setDeleteModal(true)
 }

 const handleConfirmDelete = () => {
    if(!selectedDeleteProgram) return
    deleteProgram(selectedDeleteProgram.id, {
      onSuccess: () => {
         closeDeleteModal()
      }
    })
 }

 const closeDeleteModal = () => {
    setDeleteModal(false)
    setSelectedDeleteProgram(null)
 }

 return { deleteModal , selectedDeleteProgram, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting }
}

