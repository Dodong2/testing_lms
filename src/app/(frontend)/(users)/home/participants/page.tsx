'use client'
import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
/* hooks */
import { useProgram } from "@/hooks/program/useProgram"
import { useJoinRequests } from "@/hooks/program/useJoinRequests"
import { useProgramEvents } from "@/hooks/socket/useProgramSocket"
/* components */
import { SearchBar } from "@/components/SearchBar"
import EmptyState from "@/components/EmptyState"
import Loading from "@/components/Loading"
/* icons */
import { FiArrowRight, FiUser } from "react-icons/fi"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { SiGoogleclassroom } from "react-icons/si";


export default function Programs() {
  useProgramEvents()
  // search & pagination for future purposes 
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({})
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()

  const { data: programData, isLoading } = usePrograms(page, search)
  const { mutate: joinProgram, isPending: joining } = useJoinRequests().useJoinProgram()
  const { mutate: cancelProgram, isPending: canceling } = useJoinRequests().useCancelJoin()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null // Prevent render flicker


  return (
    <div>
      {/* Search bar, for future purposes */}
      <SearchBar onSearch={setSearch} placeholder="Search program title..." />

      <h2 className="text-2xl font-bold italic text-gray-800">Your Programs</h2>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {isLoading ? (
          <Loading />
        ) : programData?.programs && programData.programs.length > 0 ? (
          programData.programs.map((program) => {
            const isJoined = program.joined
            const isPending = program.pending;

            return (
              <div
                key={program.id}
                className="bg-white rounded-lg shadow overflow-hidden border-2 border-gray-500 hover:border-blue-500 transition-transform duration-200 hover:scale-[1.02]"
              >
                {/* Kung joined na siya, clickable */}
                {isJoined ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <SiGoogleclassroom size={25} className="text-gray-700" />
                      <span className="bg-amber-300 p-1 text-xs text-center rounded-[10px]">Joined</span>
                    </div>
                    <span className="text-lg font-medium">{program.title}</span>
                    <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
                    <div className="flex justify-center items-center">
                      <Link href={`/home/participants/programs/${program.id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap">view program</button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Kung hindi pa joined, walang link — Join button lang
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <SiGoogleclassroom size={25} className="text-gray-700" />
                      <span className="bg-amber-300 p-1 text-xs text-center rounded-[10px]">{isJoined ? 'Joined' : isPending ? "Pending" : "Not a member yet"}</span>
                    </div>
                    <span className="text-lg font-medium">{program.title}</span>
                    <div className="flex items-center text-gray-600 text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
                    <div className="flex justify-center items-center">
                      {isPending ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              cancelProgram(program.id);
                            }}
                            disabled={canceling}
                            className={`px-3 py-1 rounded text-white ${canceling
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                              }`}
                          >
                            {canceling ? "Canceling..." : "Cancel"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              joinProgram(program.id);
                            }}
                            disabled={joining}
                            className={`px-3 py-1 rounded text-white ${joining
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-amber-500 hover:bg-amber-600"
                              }`}
                          >
                            {joining ? "Sending..." : "Join"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                )}

                {/* Bottom content */}
              </div>
            )
          })
        ) : (
          <EmptyState message="No programs available yet." />
        )}
      </div>


      {/* pagination control, for future purposes */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
          <span>Prev</span> <FaAngleLeft />
        </button>
        <span className="text-gray-700 font-medium">Page {programData?.page} of {programData?.totalPages}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page === programData?.totalPages} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
          <span>Next</span> <FaAngleRight />
        </button>
      </div>


    </div>
  )
}