'use client'
import Image from "next/image";
import { useSession } from "next-auth/react"
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { DeletePrograms } from "@/hooks/program/DeletePrograms";
import { useUpdateProgramsModal } from "@/hooks/program/useUpdateProgramsModal";
import { useViewMemberModal } from "@/hooks/program/useViewMemberModal";
import { useCreateProgramsModal } from "@/hooks/program/useCreateProgramsModal";
import { useProgramEvents } from "@/hooks/socket/useProgramSocket";
/* components */
import CreateProgramModal from "@/components/modals/programs modal/CreateProgramModal";
import UpdateProgamsModal from "@/components/modals/programs modal/UpdateProgramsModal";
import ViewMemberModal from "@/components/modals/programs modal/ViewMemberModal";
import DeleteProgramsModal from "@/components/modals/programs modal/DeleteProgramsModal";
import EmptyState from "@/components/EmptyState";
/* icons */
import { FiPlus, FiUser, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaList } from "react-icons/fa";/* components */
import { SearchBar } from "@/components/SearchBar";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";


export default function ProgramManage() {
  useProgramEvents()
  const [page, setPage ] = useState(1)
  const [search, setSearch] = useState("")
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()
  const { createModal, openCreateModal, closeCreateModal } = useCreateProgramsModal()
  const { deleteModal , selectedDeleteProgram, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting } = DeletePrograms()
  const { selectedProgram, updateModal, openModalUpdate, closeModalUpdate } = useUpdateProgramsModal()
  const { selectedAdd, addModal, openAddModal, closeAddModal, existingMembers, loadingMembers } = useViewMemberModal()
  const { data: programData, isLoading } = usePrograms(page, search)

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null
  
  return (
    <div className="bg-[#E3FDE7] p-6 rounded-md shadow-md">
      {/* search bar */}
      <div className="flex items-center justify-between mb-4">
          <SearchBar onSearch={setSearch} placeholder="Search program title..." />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ml-4 cursor-pointer active:scale-95 transition-transform" onClick={openCreateModal}
        >
          <FiPlus className="inline-block mr-2" />
          Add New Program
        </button>
      </div>

      {/* Program Card 1 */}
      {isLoading ? (
        <p className="text-center py-4 text-gray-500">Loading...</p>
      ) : (
      <div>{session.user.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programData?.programs &&  programData?.programs.length > 0 ? (
          programData.programs?.map(program => {
          const counts = program.memberCounts ?? { instructors: 0, beneficiaries: 0, totalMembers: 0 }
          return (
            <div key={program.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                <div className="relative flex items-center text-gray-600 text-sm mt-2"><FiUser className="mr-1" />{counts?.beneficiaries ?? 0} Learners </div>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{counts?.instructors ?? 0} Instructors</div>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>

                {/* buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex gap-1.5 w-full">
                    <button className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 whitespace-nowrap"
                        onClick={() => openAddModal(program)}>
                      <FaList className="inline-block mr-2" />
                      <p>View Members</p>
                    </button>
                <Link href={`/home/participants/programs/${program.id}`}>
                    <button className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 whitespace-nowrap"> 
                      <FaRegArrowAltCircleRight className="inline-block mr-2"/>
                      <p>View Programs</p></button>
                </Link>
              </div>
              </div>
              
              </div>

            {/* Edit / Delete */}
              <div className="flex flex-col items-end gap-1 border-b-black">
                <div className="flex gap-2">
              <button onClick={() => openModalUpdate(program)} className="text-yellow-500 hover:text-yellow-700 duration-200 focus:outline-none mr-2 cursor-pointer active:scale-65 transition-transform" title="Edit program">
                <FiEdit className="h-5 w-5" />
              </button>
              <button onClick={() => openDeleteModal(program)} className="text-red-500 hover:text-red-700 duration-200 focus:outline-none cursor-pointer active:scale-65 transition-transform" title="Delete program">
                <FiTrash2 className="h-5 w-5" />
              </button>
              </div>
              <div className="col-span-2 text-xs bg-[#E3FDE7] p-1 rounded-2xl text-gray-500 whitespace-nowrap text-center mt-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Added on ({format(new Date(program.createdAt), "MM/dd/yy")})</span>
                </div>
            </div>
                 
                </div>
            </div>
          )
        })
        ) : (
          <EmptyState message="No programs found."/>
        )}
        
      </div>)}

      {/* pagination control */}
            <div className="flex justify-end items-center gap-4 mt-4">
              <button  onClick={() => setPage((p) => p - 1)} disabled={page === 1}  className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                <span>Prev</span> <FaAngleLeft/>
                </button>
              <span className="text-gray-700 font-medium">Page {programData?.page} of {programData?.totalPages}</span>
              <button onClick={() =>  setPage((p) => p + 1)} disabled={page === programData?.totalPages}  className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                <span>Next</span> <FaAngleRight/>
                </button>
            </div>
      </div>)}

      {session.user.role === 'ADMIN' && (<>
        {createModal && (
          <CreateProgramModal onClose={closeCreateModal} onSuccess={closeCreateModal}/>
        )}
      </>)}

      {/* Modal for Admin update existing programs */}
              {session.user.role === 'ADMIN' && (<>
                {updateModal && selectedProgram && (
                  <UpdateProgamsModal programId={selectedProgram.id} initialData={{
                    title: selectedProgram.title,
                    subtitle: selectedProgram.subtitle || '',
                    explanation: selectedProgram.explanation || ''
                  }} onSuccess={closeModalUpdate} onClose={closeModalUpdate} />
                )} 
              </>)}


              {/* Modal for Admin view members in existing programs */}
            {session.user.role === 'ADMIN' && (<>
              {addModal && selectedAdd && (
                  <ViewMemberModal programId={selectedAdd.programId}
                    existingMembers={existingMembers}
                    title={selectedAdd.title}
                    onSuccess={closeAddModal}
                    onClose={closeAddModal}
                    isLoading={loadingMembers}/>
              )}
              </>)}
              
              {/* Modal for Admin Delete Existing program */}
              {session.user.role === 'ADMIN' && (<>
                {deleteModal && selectedDeleteProgram && (
                  <DeleteProgramsModal title={selectedDeleteProgram.title}
                    handleCancel={closeDeleteModal}
                    handleConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}/>
                )}
              </>)}
    </div>
  )
}