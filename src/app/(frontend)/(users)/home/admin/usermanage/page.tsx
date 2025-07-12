'use client'
import { useUsers } from "@/hooks/users/useUsers"
import { usersLists } from "@/types/usersManagetypes"

export default function UserManage() {
    const { useUsersLists } = useUsers()
    const { data: users, isLoading } = useUsersLists() 


    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ): (
               <ul>
          {users?.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email} ({user.role})
            </li>
          ))}
        </ul>
            )}
        </div>
    )
}