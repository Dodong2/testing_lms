'use client'
import { useState } from "react"
import { useSession } from "next-auth/react"
/* hooks */
import { useUsers } from "@/hooks/users/useUsers"
/* components */
import EditUserModal from "@/components/modals/EditUserModal"
/* types */
import { usersLists } from "@/types/usersManagetypes"

export default function UserManage() {
    const { useUsersLists } = useUsers()
    const { data: users, isLoading } = useUsersLists()
    const [selectedUser, setSelectedUser] = useState<usersLists | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data: session, status } = useSession()

    if (status === "loading") return <div>Loading...</div>
  if (!session) return null

    const openModal = (user: usersLists) => {
      setSelectedUser(user)
      setIsModalOpen(true)
    }

     const closeModal = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
    }


    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ): (
               <div>
          {users?.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email} ({user.role})
              <button onClick={() => openModal(user)}>edit</button>
            </li>
          ))}

          {session.user.role === 'ADMIN' && (<>
          {isModalOpen && selectedUser && (
          <EditUserModal initialData={{
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role
          }} UserId={selectedUser.id} onSuccess={closeModal} onClose={closeModal}/>
        )}
        </>)}
          
        </div>
            )}

        

        </div>
    )
}