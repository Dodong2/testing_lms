import { useEffect, useState } from "react"
import { addMembersProps } from "@/types/programManagetypes"
import { useProgram } from "./useProgram"

interface Member {
  user: {
    email: string
    name: string
    role: string
  }
}

interface ProgramWithMembers {
  id: string
  title: string
}


export const useViewMemberModal = () => {
  const [selectedAdd, setSelectedAdd] = useState<addMembersProps | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [existingMembers, setExistingMembers] = useState<Member['user'][]>([])
  const {useProgramById} = useProgram()
  const { data, refetch } = useProgramById(selectedAdd?.programId || "")

  useEffect(() => {
    if(data?.members) {
      const formatted = data.members.map((m) => ({
        email: m.user.email,
        name: m.user.name,
        role: m.user.role
      }))
      setExistingMembers(formatted)
    }
  }, [data])



    const openAddModal = (program: ProgramWithMembers) => {
    setSelectedAdd({ programId: program.id, title: program.title })
    setAddModal(true)
    refetch()
  }

  const closeAddModal = () => {
    setAddModal(false)
    setSelectedAdd(null)
    setExistingMembers([])
  }

  return { selectedAdd, addModal, openAddModal, closeAddModal, existingMembers }
}
