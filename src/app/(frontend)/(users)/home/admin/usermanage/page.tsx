'use client'
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useState } from "react"
/* hooks */
import { useUsers } from "@/hooks/users/useUsers"
import { DeleteUser } from "@/hooks/users/DeleteUser"
import { useUpdateUserModal } from "@/hooks/users/useUpdateUserModal"
import { useCreateUserModal } from "@/hooks/users/useCreateUserModal"
import { useUserEvents } from "@/hooks/socket/useUserSocket"
/* components */
import CreateUserModal from "@/components/modals/user modal/CreateUserModal"
import EditUserModal from "@/components/modals/user modal/EditUserModal"
import DeleteUserModal from "@/components/modals/user modal/DeleteUserModal"
import { SearchBar } from "@/components/SearchBar"
/* icons */
import { FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { MdEdit } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function UserManage() {
  useUserEvents()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data: session, status } = useSession()
  const { useUsersLists } = useUsers()
  const { data: usersData, isLoading } = useUsersLists(page, search)
  const { openCreateUser, handleCloseCreateUser, handleOpenCreateUser } = useCreateUserModal()
  const { deleteModal, selectedDeleteUser, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting } = DeleteUser()
  const { selectedUser, isUpdateModal, openUpdateModal, closeUpdateModal } = useUpdateUserModal()

  // useEffect(() => {
  //   if(usersData) {
  //     handleFiltered(usersData?.users)
  //   }
  // }, [usersData, handleFiltered])

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null

  return (
    <div className="bg-[#E3FDE7] p-6 rounded-md shadow-md">
      {/* search & add members */}
      <div className="flex items-center justify-between mb-4">
        <SearchBar onSearch={setSearch} placeholder="Search users.." />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ml-4 cursor-pointer active:scale-95 transition-transform" onClick={handleOpenCreateUser}>
          <FiUserPlus className="inline-block mr-2" />
          Add New User
        </button>
      </div>

      {isLoading ? (
        <p className="text-center py-4 text-gray-500">Loading...</p>
      ) : (
        <>
          {session.user.role === 'ADMIN' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#E3FDE7]">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        USER
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        EMAIL
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        ROLE
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersData?.users && usersData?.users.length > 0 ? (
                      usersData?.users.map((user) => (
                        <tr key={user.id} className="hover:bg-[#E3FDE7] transition-colors duration-150">
                          <td className="py-3 px-4 whitespace-nowrap text-gray-700">{user.name}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openUpdateModal(user)}
                              className="text-yellow-500 hover:text-yellow-700 duration-200 focus:outline-none mr-2 cursor-pointer active:scale-65 transition-transform"
                              title="Edit User"
                            >
                              <MdEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="text-red-500 hover:text-red-700 duration-200 focus:outline-none cursor-pointer active:scale-65 transition-transform"
                              title="Delete User"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500 italic">
                          <div className="flex flex-col items-center justify-center">
                            <Image src="/not-found.png" alt="not-found" width={150} height={150} />
                            No users found.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* pagination control */}
                <div className="flex justify-end items-center gap-4 mt-4">
                  <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                    <span>Prev</span> <FaAngleLeft />
                  </button>
                  <span className="text-gray-700 font-medium">Page {usersData?.page} of {usersData?.totalPages}</span>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page === usersData?.totalPages} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                    <span>Next</span> <FaAngleRight />
                  </button>
                </div>

              </div>

              {/* --- Modals --- */}
              {/* update modal for admin */}
              {isUpdateModal && selectedUser && (
                <EditUserModal
                  initialData={{
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                  }}
                  UserId={selectedUser.id}
                  programs={selectedUser.ProgramMember}
                  onSuccess={closeUpdateModal}
                  onClose={closeUpdateModal}
                />
              )}

              {/* delete modal for admin */}
              {deleteModal && selectedDeleteUser && (
                <DeleteUserModal
                  userName={selectedDeleteUser.name}
                  onCancel={closeDeleteModal}
                  onConfirm={handleConfirmDelete}
                  isDeleting={isDeleting}
                />
              )}

              {openCreateUser && (
                <CreateUserModal onSuccess={handleCloseCreateUser} onClose={handleCloseCreateUser} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}