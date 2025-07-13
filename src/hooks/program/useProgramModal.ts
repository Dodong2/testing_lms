import { useState } from "react"
import { programsTypes } from "@/types/programManagetypes"

export const useProgramModal = () => {
  const [selectedProgram, setSelectedProgram] = useState<programsTypes | null>(null)
  const [updateModal, setUpdateModal] = useState(false)

  const openModalUpdate = (program: programsTypes) => {
    setSelectedProgram(program)
    setUpdateModal(true)
  }

  const closeModalUpdate = () => {
    setUpdateModal(false)
    setSelectedProgram(null)
  }

  return {
    selectedProgram,
    updateModal,
    openModalUpdate,
    closeModalUpdate
  }
}
