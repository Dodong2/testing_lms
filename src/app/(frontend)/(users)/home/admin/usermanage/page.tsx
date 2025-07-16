'use client'
import { useSession } from "next-auth/react"
/* hooks */
import { useUsers } from "@/hooks/users/useUsers"
import { DeleteUser } from "@/hooks/users/DeleteUser"
/* components */
import EditUserModal from "@/components/modals/user modal/EditUserModal"
import DeleteUserModal from "@/components/modals/user modal/DeleteUserModal"
import { useUpdateModal } from "@/hooks/users/useUpdateModal"
/* types */

export default function UserManage() {
  const { useUsersLists } = useUsers()
  const { data: users, isLoading } = useUsersLists()
  const { deleteModal, selectedDeleteUser, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting } = DeleteUser()
  const { selectedUser, isUpdateModal, openUpdateModal, closeUpdateModal } = useUpdateModal()
  
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>{session.user.role === 'ADMIN' && (<div>
          {users?.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email} ({user.role})
              <button onClick={() => openUpdateModal(user)}>edit</button>
              <button onClick={() => openDeleteModal(user)}>delete</button>
            </li>
          ))}

          {/* update modal for admin */}
          {session.user.role === 'ADMIN' && (<>
            {isUpdateModal && selectedUser && (
              <EditUserModal initialData={{
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role
              }} UserId={selectedUser.id} onSuccess={closeUpdateModal} onClose={closeUpdateModal} />
            )}
          </>)}

          {/* delete modal for admin */}
          {session.user.role === 'ADMIN' && (<>
            {deleteModal && selectedDeleteUser && (
              <DeleteUserModal userName={selectedDeleteUser.name}
                onCancel={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting} />
            )}
          </>)}

        </div>
      )}


      </div>)}
    </div>
  )
}