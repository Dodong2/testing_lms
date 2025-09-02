'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react";
import Link from "next/link";
import { useProgramEvents } from "@/hooks/socket/useProgramSocket";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { DeletePrograms } from "@/hooks/program/DeletePrograms";
import { useUpdateProgramsModal } from "@/hooks/program/useUpdateProgramsModal";
import { useViewMemberModal } from "@/hooks/program/useViewMemberModal";
import { useSearch } from "@/hooks/searchbar/useSearch";
import { useCreateProgramsModal } from "@/hooks/program/useCreateProgramsModal";
/* icons */
import { FiPlus, FiUser, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaList } from "react-icons/fa";/* components */
import { SearchBar } from "@/components/SearchBar";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
/* components */
import CreateProgramModal from "@/components/modals/programs modal/CreateProgramModal";
import UpdateProgamsModal from "@/components/modals/programs modal/UpdateProgramsModal";
import ViewMemberModal from "@/components/modals/programs modal/ViewMemberModal";
import DeleteProgramsModal from "@/components/modals/programs modal/DeleteProgramsModal";

export default function ProgramManage() {
  useProgramEvents()
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()
  const { createModal, openCreateModal, closeCreateModal } = useCreateProgramsModal()
  const { deleteModal , selectedDeleteProgram, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting } = DeletePrograms()
  const { selectedProgram, updateModal, openModalUpdate, closeModalUpdate } = useUpdateProgramsModal()
  const { selectedAdd, addModal, openAddModal, closeAddModal, existingMembers } = useViewMemberModal()
  const { handleFilteredProgram, filteredPrograms} = useSearch()
  const { data: programData, isLoading } = usePrograms()

    useEffect(() => {
  if (programData?.programs) {
    handleFilteredProgram(programData.programs)
  }
}, [programData, handleFilteredProgram])

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null
  
  
  return (
    <div className="bg-[#E3FDE7] p-6 rounded-md shadow-md">
      {/* search bar */}
      <div className="flex items-center justify-between mb-4">
        {programData?.programs && (
          <SearchBar
            data={programData.programs}
            onFiltered={handleFilteredProgram}
            keysToSearch={['title']}
            placeholder="Search program title..."
            />
        )}
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-400 ml-4 cursor-pointer active:scale-95 transition-transform" onClick={openCreateModal}
        >
          <FiPlus className="inline-block mr-2" />
          Add New Program
        </button>
      </div>

      {/* Program Card 1 */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
      <div>{session.user.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.length > 0 ? (
          filteredPrograms?.map(program => {
          const counts = program.memberCounts ?? { instructors: 0, beneficiaries: 0 }
          return (
            <div key={program.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-2"><FiUser className="mr-1" />{counts?.beneficiaries ?? 0} Learners</div>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{counts?.instructors ?? 0} Instructors</div>

                {/* buttons */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex gap-1.5">
                <button className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                onClick={() => openAddModal(program)}>
                <FaList className="inline-block mr-2" />
                <p>View Members</p>
              </button>
              <Link href={`/home/participants/programs/${program.id}`}>
              <button className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"> 
                <FaRegArrowAltCircleRight className="inline-block mr-2"/>
                <p>View Programs</p></button>
              </Link>
              </div>
              </div>
              
              </div>

            {/* Edit / Delete */}
              <div className="flex items-center gap-2">
              <button onClick={() => openModalUpdate(program)} className="text-yellow-500 hover:text-yellow-700 duration-200 focus:outline-none mr-2 cursor-pointer active:scale-65 transition-transform" title="Edit program">
                <FiEdit className="h-5 w-5" />
              </button>
              <button onClick={() => openDeleteModal(program)} className="text-red-500 hover:text-red-700 duration-200 focus:outline-none cursor-pointer active:scale-65 transition-transform" title="Delete program">
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
                </div>
            </div>
          )
        })
        ) : (
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-gray-500 italic">No programs found.</p>
          </div>
        )}
        
      </div>)}
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
                    onClose={closeAddModal}/>
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