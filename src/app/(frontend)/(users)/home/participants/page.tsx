'use client'
import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"
import { useProgram } from "@/hooks/program/useProgram"
import { useSession } from "next-auth/react"

export default function Programs() {
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()

  const { data: programData, isLoading } = usePrograms()

  if (status === "loading") return <div>Loading...</div>
  if(!session) return null // Prevent render flicker


    return (
        <div>
            <h2>Your Programs</h2>
       {/* Dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        programData?.programs?.map(program => (
        <div key={program.id}  className="bg-white rounded-lg shadow overflow-hidden">
          <Link href={`/program/${program.id}`}>
            {/* Top gray box */}
            <div className="bg-gray-300 h-32 w-full"></div>

            {/* Bottom content */}
            <div className="flex items-center justify-between p-4">
              <span className="text-lg font-medium">{program.title}</span>
              <button className="bg-gray-400 text-white rounded-full p-2 hover:bg-gray-500">
                <FiArrowRight />
              </button>
            </div>
          </Link>
          
        {/* {session.user.role === 'ADMIN' && (<>
          <AddProgramMembers programId={program.id}/>
        </>)} */}
          
        </div>
      ))
      )}
      </div>
        </div>
    )
}