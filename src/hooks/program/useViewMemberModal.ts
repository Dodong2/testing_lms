import { useState, useMemo } from "react"
import { addMembersProps } from "@/types/programManagetypes"
import { useProgram } from "./useProgram"
interface ProgramWithMembers {
  id: string
  title: string
}


export const useViewMemberModal = () => {
  const [selectedAdd, setSelectedAdd] = useState<addMembersProps | null>(null)
  const [addModal, setAddModal] = useState(false)
  const {useProgramById} = useProgram()
  const { data: program, refetch } = useProgramById(selectedAdd?.programId || "")

  const existingMembers = useMemo(() => {
    if(!program?.members) return []
    return program.members.map((m) => ({
      email: m.user.email,
      name: m.user.name,
      role: m.user.role
    }))
  }, [program?.members])



    const openAddModal = (program: ProgramWithMembers) => {
    setSelectedAdd({ programId: program.id, title: program.title })
    setAddModal(true)
    refetch()
  }

  const closeAddModal = () => {
    setAddModal(false)
    setSelectedAdd(null)
  }

  return { selectedAdd, addModal, openAddModal, closeAddModal, existingMembers }
}
