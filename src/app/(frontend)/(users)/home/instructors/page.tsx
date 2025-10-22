'use client'
import { useSession } from "next-auth/react"
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { useProgramEvents } from "@/hooks/socket/useProgramSocket";
/* components */
import { SearchBar } from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
/* icons */
import { FiPlus, FiUser, FiEdit, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { FaList } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";


export default function Instructors() {
  useProgramEvents()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()
  const { data: programData, isLoading } = usePrograms(page, search)

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null

  return (
    <div>
      <div className="mt-2">
        {/* search bar */}
        {/* <div className="flex items-center justify-between mb-4">
          <SearchBar onSearch={setSearch} placeholder="Search program title..." />
        </div> */}

        <h2 className="text-2xl font-bold italic text-[#EFEFEF]">Your Programs</h2>

        {/* Program Card 1 */}
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <div>{(session.user.role === 'ADMIN' || session.user.role === 'INSTRUCTOR') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {programData?.programs && programData?.programs.length > 0 ? (
                programData.programs?.map(program => {
                  const counts = program.memberCounts ?? { instructors: 0, beneficiaries: 0, totalMembers: 0 }
                  return (
                    <div key={program.id} className="bg-white rounded-lg shadow overflow-hidden border-1 border-gray-500 hover:border-blue-500 transition-transform duration-200 hover:scale-[1.02]">
                      <div>
                        <Link href={`/home/participants/programs/${program.id}`}>
                          {/* Top gray box */}
                          <div className="flex justify-between bg-[#FFBD17] p-2 w-full">
                            <div>
                              <div className="relative flex items-center text-gray-950 text-sm mt-1"><FiUser className="mr-1" />{counts?.beneficiaries ?? 0} Learners </div>
                              <div className="flex items-center text-gray-950 text-sm mt-1"><FiUser className="mr-1" />{counts?.instructors ?? 0} Instructors</div>
                              <div className="flex items-center text-gray-950 text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
                            </div>
                            {/* <div className=""> */}
                              <span className="text-xs text-gray-950 p-1 rounded-2xl text-center whitespace-nowrap">since {format(new Date(program.createdAt), "MMM/dd/yyyy")}</span>
                            {/* </div> */}
                          </div>

                          {/* Bottom content */}
                          <div className="bg-[#525252] flex items-center justify-between p-4">
                            <span className="text-[#EFEFEF] text-lg font-medium">{program.title}</span>
                            <button className="bg-[#EFEFEF] text-[#525252] rounded-full p-2 hover:bg-gray-500">
                              <FiArrowRight />
                            </button>
                          </div>
                        </Link>

                      </div>

                    </div>
                  )
                })
              ) : (
                <EmptyState message="No programs found." />
              )}

            </div>)}

            {/* pagination control */}
            <div className="flex justify-end items-center gap-4 mt-4">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                <span>Prev</span> <FaAngleLeft />
              </button>
              <span className="text-gray-700 font-medium">Page {programData?.page} of {programData?.totalPages}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === programData?.totalPages} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                <span>Next</span> <FaAngleRight />
              </button>
            </div>
          </div>)}

      </div>
    </div>
  )
}