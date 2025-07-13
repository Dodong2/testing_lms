import { useState } from "react"
import { addMembersProps } from "@/types/programManagetypes"

export const useAddMemberModal = () => {
  const [selectedAdd, setSelectedAdd] = useState<addMembersProps | null>(null)
  const [addModal, setAddModal] = useState(false)

    const openAddModal = (program: { id: string; title: string }) => {
    setSelectedAdd({ programId: program.id, title: program.title })
    setAddModal(true)
  }

  const closeAddModal = () => {
    setAddModal(false)
    setSelectedAdd(null)
  }

  return { selectedAdd, addModal, openAddModal, closeAddModal }
}
