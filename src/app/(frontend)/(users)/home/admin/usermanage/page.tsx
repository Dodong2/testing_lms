'use client'
import { useSession } from "next-auth/react"
/* hooks */
import { useUsers } from "@/hooks/users/useUsers"
import { DeleteUser } from "@/hooks/users/DeleteUser"
import { useUpdateModal } from "@/hooks/users/useUpdateModal"
import { useSearch } from "@/hooks/searchbar/useSearch"
/* components */
import EditUserModal from "@/components/modals/user modal/EditUserModal"
import DeleteUserModal from "@/components/modals/user modal/DeleteUserModal"
import { SearchBar } from "@/components/SearchBar"
/* icons */
import { FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { MdEdit } from "react-icons/md";



export default function UserManage() {
  const { useUsersLists } = useUsers()
  const { data: users, isLoading } = useUsersLists()
  const { deleteModal, selectedDeleteUser, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting } = DeleteUser()
  const { selectedUser, isUpdateModal, openUpdateModal, closeUpdateModal } = useUpdateModal()
  const { filteredUsers, handleFiltered } = useSearch()
  


  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      {/* search & add members */}
      <div className="flex items-center justify-between mb-4">
        {users && (
          <SearchBar
            data={users}
            onFiltered={handleFiltered}
            keysToSearch={['name', 'email', 'role']}
            placeholder="Search users..."
          />
        )}
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-400 ml-4">
          <FiUserPlus className="inline-block mr-2" />
          Add New User
        </button>
      </div>

      {/* tables */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>{session.user.role === 'ADMIN' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md shadow">
            <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold">USER</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold">GMAIL</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold">ROLE</th>
              <th className="py-2 px-4 text-right text-gray-700 font-semibold">ACTION</th>
            </tr>
          </thead>

          {/* actual user data */}
          <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">({user.role})</td>
              <td className="py-2 px-4 text-right">
              <button onClick={() => openUpdateModal(user)} className="text-gray-500 hover:text-gray-700 mr-2 focus:outline-none"><MdEdit className="h-5 w-5" /></button>
              <button onClick={() => openDeleteModal(user)} className="text-red-500 hover:text-red-700 focus:outline-none"><FiTrash2 className="h-5 w-5" /></button>  
              </td>              
            </tr>
          ))}
          </tbody>

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
            </table>
        </div>
      )}


      </>)}
    </div>
  )
}