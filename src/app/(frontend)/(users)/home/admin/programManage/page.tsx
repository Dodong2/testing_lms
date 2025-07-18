'use client'
import { useState } from "react";
import { useSession } from "next-auth/react"
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { DeletePrograms } from "@/hooks/program/DeletePrograms";
import { useProgramModal } from "@/hooks/program/useProgramModal";
import { useAddMemberModal } from "@/hooks/program/useAddMemberModal";
import { useSearch } from "@/hooks/searchbar/useSearch";
/* icons */
import { FiPlus, FiUser, FiEdit, FiTrash2 } from 'react-icons/fi';
/* components */
import Modal from "@/components/modals/Modal";
import CreateProgramForm from "@/components/admin/CreateProgramForm";
import UpdateProgamsModal from "@/components/modals/programs modal/UpdateProgramsModal";
import { SearchBar } from "@/components/SearchBar";
// import DeleteProgramsForm from "@/components/admin/DeleteProgramsForm";
import AddMemberModal from "@/components/modals/programs modal/AddMemberModal";
import DeleteProgramsModal from "@/components/modals/programs modal/DeleteProgramsModal";

/* types */

type ProgramCounts = {
  programId: string
  instructors: number
  beneficiaries: number
}

export default function ProgramManage() {
  const [ createModal, setCreateModal ] = useState(false)
  const { data: session, status } = useSession()
  const { useAllProgramCounts, usePrograms } = useProgram()
  const { deleteModal , selectedDeleteProgram, openDeleteModal, handleConfirmDelete, closeDeleteModal, isDeleting } = DeletePrograms()
  const { selectedProgram, updateModal, openModalUpdate, closeModalUpdate } = useProgramModal()
  const { selectedAdd, addModal, openAddModal, closeAddModal } = useAddMemberModal()
  const { data: countsData } = useAllProgramCounts()
  const { handleFilteredProgram, filteredPrograms} = useSearch()

  const getCounts = (programId: string) => 
    countsData?.find((c: ProgramCounts) => c.programId === programId) ?? { instructors: 0, beneficiaries: 0 }

  const { data: programData, isLoading } = usePrograms()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null
  

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      {/* search bar */}
      <div className="flex items-center justify-between mb-4">
        {programData && (
          <SearchBar
            data={programData.programs}
            onFiltered={handleFilteredProgram}
            keysToSearch={['title']}
            placeholder="Search users..."
            />
        )}
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-400 ml-4"
        onClick={() => setCreateModal(true)}>
          <FiPlus className="inline-block mr-2" />
          Add New Program
        </button>
      </div>

      {/* Program Card 1 */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
      <>{session.user.role === 'ADMIN' && (
        filteredPrograms?.map(program => {
          const counts = getCounts(program.id)
          return (
            <div key={program.id} className="bg-white rounded-md shadow mb-4 p-4">
              <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{counts?.beneficiaries ?? 0} Learners</div>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{counts?.instructors ?? 0} Instructors</div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                onClick={() => openAddModal(program)}>
                <FiPlus className="inline-block mr-2" />
                Add Learners
              </button>
              </div>

              <div className="space-x-2">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={() => openModalUpdate(program)}>
                <FiEdit className="h-5 w-5" />
              </button>
              <button className="text-red-500 hover:text-red-700 focus:outline-none" onClick={() => openDeleteModal(program)}>
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
            
            

              {/* Modal for Admin create programs */}
              {session.user.role === 'ADMIN' && (<>
                {createModal && (
                <Modal onClose={() => setCreateModal(false)}>
                  <CreateProgramForm/>
                </Modal>
              )}
              </>)}
              

                </div>
            </div>
          )
        })
      )}</>)}

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


              {/* Modal for Admin Add members to programs */}
            {session.user.role === 'ADMIN' && (<>
              {addModal && selectedAdd && (
                  <AddMemberModal programId={selectedAdd.programId}
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