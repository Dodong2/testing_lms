"use client"
import { FaUserCircle } from "react-icons/fa"
import { useProgram } from "@/hooks/program/useProgram"
import Image from "next/image"

export default function InstructorsContent({ programId }: { programId: string }) {
  const { data: program, isLoading, isError } = useProgram().useProgramById(programId)

  if (isLoading) return <div>Loading...</div>
  
  if (isError) {
    console.log(isError)
  }
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
          <li key={member.user.id} className="flex items-center gap-3">
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
          </li>
        ))
      )}
    </ul>
  )

  return (
    <div className="bg-gray-100 space-y-6 rounded-md shadow mt-3 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Members</h2>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Admins</h3>
        {renderMembers(groupedMembers.ADMIN)}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Instructors</h3>
        {renderMembers(groupedMembers.INSTRUCTOR)}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Beneficiaries</h3>
        {renderMembers(groupedMembers.BENEFICIARY)}
      </div>
    </div>
  )
}
