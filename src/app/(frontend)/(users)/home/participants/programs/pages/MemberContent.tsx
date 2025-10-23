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

  const renderMembers = (members: typeof program.members) => (
    <ul className="space-y-2">
      {members.length === 0 ? (
        <li className="text-gray-500 italic">No members found.</li>
      ) : (
        members.map((member) => (
          <li key={member.user.id} className="flex items-center gap-3 justify-between">
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
                <p className="font-medium text-gray-800">{member.user.name}</p>
                <p className="text-sm text-gray-500">{member.user.role}</p>
              </div>
            </div>

            {removeMode && (
              <input
                type="checkbox"
                checked={selectedEmails.includes(member.user.email)}
                onChange={(e) =>
                  handleToggleEmail(member.user.email, e.target.checked)
                }
                className="form-checkbox h-5 w-5 text-red-500 rounded-md"
              />
            )}
          </li>
        ))
      )}
    </ul>
  )

  return (
    <div className="bg-gray-100 space-y-6 rounded-md shadow mt-3 p-6">
      {session.user.role === 'INSTRUCTOR' && (
        <button onClick={toggleJoinOpen} className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 whitespace-nowrap">requests ({requests?.length})</button>
      )}

      {session.user.role === 'INSTRUCTOR' && (
        <div className="flex gap-2">
          <button
            onClick={() => setRemoveMode((prev) => !prev)}
            className={`px-4 py-2 rounded-md font-medium shadow 
        ${removeMode ? "bg-gray-400 text-white" : "bg-red-500 text-white hover:bg-red-600"}`}
          >
            {removeMode ? "Cancel" : "Remove"}
          </button>

          {removeMode && (
            <button
              onClick={handleRemove}
              disabled={isRemoving || selectedEmails.length === 0}
              className={`px-4 py-2 rounded-md font-medium shadow
                ${selectedEmails.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"}`}
            >
              {isRemoving ? "Removing..." : `Confirm Remove (${selectedEmails.length})`}
            </button>
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-900">Members</h2>

      {/* <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Admins</h3>
        {renderMembers(groupedMembers.ADMIN)}
      </div> */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Instructors</h3>
        {renderMembers(groupedMembers.INSTRUCTOR)}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Beneficiaries</h3>
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
