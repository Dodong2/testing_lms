"use client"
import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { joinOpenModal } from "@/hooks/program/joinOpenModal"
import { useRemoveMember } from "@/hooks/program/useRemoveMember"
import { useProgramEvents } from "@/hooks/socket/useProgramSocket"
import { useJoinRequests } from "@/hooks/program/useJoinRequests"
/* components */
import RequestProgramModal from "@/components/modals/programs modal/RequestProgramModal"
/* icons */
import { FaUserCircle } from "react-icons/fa"
import { request } from "http"
import { FiUser } from "react-icons/fi"

export default function MemberContent({ programId }: { programId: string }) {
  useProgramEvents()
  const { data: session } = useSession()
  const { data: program, isLoading, isError } = useProgram().useProgramById(programId)
  const { joinOpen, toggleJoinOpen } = joinOpenModal()
  const [removeMode, setRemoveMode] = useState(false)
  const { selectedEmails, handleToggleEmail, handleRemove, isRemoving } = useRemoveMember(programId)
  const { data: requests } = useJoinRequests().useRequestLists(programId)

  if (isLoading) return <div>Loading...</div>

  if (isError) {
    console.log(isError)
  }

  if (!session) return null

  if (!program) return <div>No program found.</div>

  const groupedMembers = {
    ADMIN: program.members.filter((m) => m.user.role === "ADMIN"),
    INSTRUCTOR: program.members.filter((m) => m.user.role === "INSTRUCTOR"),
    BENEFICIARY: program.members.filter((m) => m.user.role === "BENEFICIARY")
  }

  // counts members
  const counts = {
    beneficiaries: program.members.filter((m) => m.user.role === 'BENEFICIARY').length,
    instructors: program.members.filter((m) => m.user.role === 'INSTRUCTOR').length,
    totalMembers: program.members.length,
  }

  const renderMembers = (members: typeof program.members) => (
    <ul className="space-y-2">
      {members.length === 0 ? (
        <li className="text-gray-500 italic">No members found.</li>
      ) : (
        members.map((member) => (
          <li key={member.user.id} className="flex items-center gap-3 ">

            {/* remove check */}
            {(removeMode && member.user.role !== 'INSTRUCTOR') && (
              <input
                type="checkbox"
                checked={selectedEmails.includes(member.user.email)}
                onChange={(e) =>
                  handleToggleEmail(member.user.email, e.target.checked)
                }
                className="h-5 w-5 appearance-none rounded-md border border-gray-400 checked:bg-red-500 checked:border-red-500 focus:outline-none cursor-pointer relative 
                checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:top-0 checked:before:left-[1px] checked:before:text-sm"              />
            )}

            {/* member lists */}
            <div className="flex items-center gap-3">
              {member.user.image ? (
                <Image
                  src={member.user.image}
                  alt={member.user.name ?? "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-600 w-10 h-10" />
              )}
              <div>
                <p className="font-medium text-white">{member.user.name}</p>
              </div>
            </div>

          </li>
        ))
      )}
    </ul>
  )

  return (
    <div className="bg-[#525252] space-y-6 rounded-md shadow mt-3 p-6">
      {/* member - actions */}
      <div className="flex justify-between gap-2">
        {/* members - count */}
        <div className="text-white font-semibold flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-[#222222] p-2 flex items-center text-sm mt-1 rounded-lg shadow"><FiUser className="mr-1" /> Learners: <span className="text-amber-400 ml-1">{counts?.beneficiaries ?? 0}</span>  </div>
          <div className="bg-[#222222] p-2 flex items-center text-sm mt-1 rounded-lg shadow"><FiUser className="mr-1" /> Instructors: <span className="text-amber-400 ml-1">{counts?.instructors ?? 0}</span> </div>
          <div className="bg-[#222222] p-2 flex items-center text-sm mt-1 rounded-lg shadow"><FiUser className="mr-1" /> total members: <span className="text-amber-400 ml-1">{counts?.totalMembers}</span> </div>
        </div>

        {/* actions */}
        <div className="flex gap-2 h-10">
          {/* remove button */}
          {session.user.role === 'INSTRUCTOR' && (
            <div className="flex gap-2">
              <button
                onClick={() => setRemoveMode((prev) => !prev)}
                className={`px-2 py-2 rounded-md font-medium shadow 
              ${removeMode ? "bg-gray-400 text-white" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                {removeMode ? "Cancel" : "Remove"}
              </button>

              {removeMode && (
                <button
                  onClick={handleRemove}
                  disabled={isRemoving || selectedEmails.length === 0}
                  className={`relative px-2 py-2 rounded-md font-medium shadow
                ${selectedEmails.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-700 text-white"}`}
                >
                  {isRemoving ? "Removing..." : `Confirm remove`}
                  {selectedEmails.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{selectedEmails.length}</span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* request button */}
          {session.user.role === 'INSTRUCTOR' && (
            <button onClick={toggleJoinOpen} className="relative flex justify-center items-center bg-[#00306E] hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap">
              Requests {requests?.length ? (<span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{requests?.length}</span>) : null}
            </button>
          )}
        </div>

      </div>

      {/* <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Admins</h3>
        {renderMembers(groupedMembers.ADMIN)}
      </div> */}

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Instructors</h3>
        {renderMembers(groupedMembers.INSTRUCTOR)}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Learners</h3>
        {renderMembers(groupedMembers.BENEFICIARY)}
      </div>

      {joinOpen && (
        <RequestProgramModal
          programId={programId}
          onClose={toggleJoinOpen}
        />
      )}

    </div>
  )
}
