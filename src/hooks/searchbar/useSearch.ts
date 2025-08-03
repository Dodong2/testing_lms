import { usersLists } from "@/types/usersManagetypes"
import { programsTypes } from "@/types/programManagetypes"
import { useState, useCallback } from "react"

export const useSearch = () => {
  const [filteredUsers, setFilteredUsers] = useState<usersLists[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<programsTypes[]>([])

    //for user management
    const handleFiltered = useCallback((filtered: usersLists[]) => {
        setFilteredUsers(filtered)
    }, [])

    //for program management
    const handleFilteredProgram = useCallback((filtered: programsTypes[]) => {
        setFilteredPrograms(filtered)
    }, [])

return {filteredUsers, handleFiltered, filteredPrograms, handleFilteredProgram}
}

