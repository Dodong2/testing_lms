'use client'
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"
import { useProgram } from "@/hooks/program/useProgram"
import { useSession } from "next-auth/react"
import { useProgramEvents } from "@/hooks/socket/useProgramSocket"
import { SearchBar } from "@/components/SearchBar"

export default function Programs() {
  useProgramEvents()
  // search & pagination for future purposes 
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()

  const { data: programData, isLoading } = usePrograms(page, search)

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null // Prevent render flicker


  return (
    <div>
      {/* Search bar, for future purposes */}
      {session.user.role === 'ADMIN' && (
        <SearchBar onSearch={setSearch} placeholder="Search program title..." />
      )}
      <h2 className="text-2xl font-bold italic text-gray-800">Your Programs</h2>
      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
  {isLoading ? (
    <p>Loading...</p>
  ) : programData?.programs && programData.programs.length > 0 ? (
    programData.programs.map((program) => (
      <div
        key={program.id}
        className="bg-white rounded-lg shadow overflow-hidden border border-transparent hover:border-blue-500 transition-all"
      >
        <Link href={`/home/participants/programs/${program.id}`}>
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
      </div>
    ))
  ) : (
    <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 italic">
      <Image
        src="/not-found.png"
        alt="no-programs"
        width={150}
        height={150}
        className="mb-2"
      />
      <p>No programs available yet.</p>
    </div>
  )}
</div>


      {/* pagination control, for future purposes */}
      {session.user.role === 'ADMIN' && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span>Page {programData?.page} of {programData?.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === programData?.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      )}


    </div>
  )
}