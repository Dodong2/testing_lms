import { usersLists } from "@/types/usersManagetypes"
import { useState, useCallback } from "react"

export const useSearch = () => {
    //for user management
  const [filteredUsers, setFilteredUsers] = useState<usersLists[]>([])
  const handleFiltered = useCallback((filtered: usersLists[]) => {
        setFilteredUsers(filtered)
    }, [])

    //for program management

return {filteredUsers, handleFiltered}
}

