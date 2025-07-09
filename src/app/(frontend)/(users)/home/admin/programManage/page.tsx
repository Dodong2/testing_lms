'use client'
import { useState } from "react";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { DeletePrograms } from "@/hooks/program/DeletePrograms";
import { useSession } from "next-auth/react"
/* icons */
import { FiSearch, FiPlus, FiUser, FiEdit, FiTrash2 } from 'react-icons/fi';
/* components */
import AddProgramMembers from "@/components/admin/AddProgramMembers";
import AddMemberModal from "@/components/modals/AddMemberModal";
import CreateProgramForm from "@/components/admin/CreateProgramForm";

type ProgramCounts = {
  programId: string
  instructors: number
  beneficiaries: number
}

export default function ProgramManage() {
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ createModal, setCreateModal ] = useState(false)
  const { data: session, status } = useSession()
  const { useAllProgramCounts, usePrograms } = useProgram()
  const { handleDelete } = DeletePrograms()
  const { data: countsData } = useAllProgramCounts()

  const getCounts = (programId: string) => 
    countsData?.find((c: ProgramCounts) => c.programId === programId) ?? { instructors: 0, beneficiaries: 0 }

  const { data: programData, isLoading } = usePrograms()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null
  

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      {/* search bar */}

      {/* Program Card 1 */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        programData?.programs?.map(program => {
          const counts = getCounts(program.id)
          return (
            <div key={program.id} className="bg-white rounded-md shadow mb-4 p-4">
              <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{counts?.beneficiaries ?? 0} Learners</div>
                <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{counts?.instructors ?? 0} Instructors</div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                onClick={() => setIsModalOpen(true)}>
                <FiPlus className="inline-block mr-2" />
                Add Learners
              </button>
              
              {/* test create program can be deleted */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                onClick={() => setCreateModal(true)}>
                <FiPlus className="inline-block mr-2" />
                Add Program
              </button>
              </div>

              <div className="space-x-2">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <FiEdit className="h-5 w-5" />
              </button>
              <button className="text-red-500 hover:text-red-700 focus:outline-none" onClick={() => handleDelete(program.id)}>
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal for Admin Add members to programs */}
            {session.user.role === 'ADMIN' && (<>
              {isModalOpen && (
                <AddMemberModal onClose={() => setIsModalOpen(false)}>
                  <AddProgramMembers programId={program.id} title={program.title}/>
                </AddMemberModal>
              )}
              </>)}

              {createModal && (
                <AddMemberModal onClose={() => setCreateModal(false)}>
                  <CreateProgramForm/>
                </AddMemberModal>
              )}

                </div>
            </div>
          )
        })
      )}
    </div>
  )
}