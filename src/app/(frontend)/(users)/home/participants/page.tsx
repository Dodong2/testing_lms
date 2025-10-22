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
import { PiSealCheckDuotone } from "react-icons/pi";

export default function Programs() {
  useProgramEvents()
  // search & pagination for future purposes 
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [joiningProgramId, setJoiningProgramId] = useState<string | null>(null)
  const [cancelingProgramId, setCancelingProgramId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"ALL" | "JOINED">("ALL")
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()
  const { data: programData, isLoading } = usePrograms(page, search)
  const { mutate: joinProgram, isPending: joining } = useJoinRequests().useJoinProgram()
  const { mutate: cancelProgram, isPending: canceling } = useJoinRequests().useCancelJoin()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null // Prevent render flicker

  // for button filter all & joined program
  const filteredPrograms = programData?.programs?.filter((program) => {
    if (filter === "JOINED") return program.joined === true
    return true
  })

  return (
    <div>
      {/* Search bar & filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        {/* <SearchBar
          onSearch={(value) => {
            setSearch(value)
            if (value.trim() !== "") {
              setFilter("ALL")
            }
          }}
          placeholder="Search program title..."
        /> */}
        <div></div>

        <div className="flex gap-2 md:mt-0 mt-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-2 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${filter === "ALL" ? "bg-[#00306E] hover:bg-[#06234a] text-[#EFEFEF] shadow-md" : "bg-[#EFEFEF] text-gray-800 hover:bg-blue-100"}`}>
            All Programs
          </button>

          <button
            onClick={() => setFilter("JOINED")}
            className={`px-2 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${filter === "JOINED" ? "bg-[#00306E] hover:bg-[#06234a] text-[#EFEFEF] shadow-md" : "bg-[#EFEFEF] text-gray-800 hover:bg-blue-100"}`}>
            Your Programs
          </button>
        </div>
      </div>


      <h2 className="text-2xl font-bold italic text-[#EFEFEF]">{filter === 'ALL' ? 'All Programs' : 'Your Programs'}</h2>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {isLoading ? (
          <Loading />
        ) : filteredPrograms && filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => {
            const isJoined = program.joined
            const isPending = program.pending;

            return (
              <div
                key={program.id}
                className="bg-[#525252] rounded-lg shadow overflow-hidden border-2 border-gray-500 hover:border-blue-500 transition-transform duration-200 hover:scale-[1.02]"
              >
                {/* Kung joined na siya, clickable */}
                {isJoined ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      {isJoined ? <PiSealCheckDuotone className="text-amber-300" size={25} /> : <div></div>}
                      <span className="bg-amber-300 p-1 text-xs text-center rounded-[10px]">Joined</span>
                    </div>
                    <span className="text-lg text-[#EFEFEF] font-medium">{program.title}</span>
                    <div className="flex items-center text-[#EFEFEF] text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
                    <div className="mt-2">
                      <Link href={`/home/participants/programs/${program.id}`} className="w-full flex justify-center items-center">
                        <button className="italic bg-[#00306E] w-3/4 hover:bg-[#06234a] text-white font-semibold py-2 px-4 rounded-3xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap">view program</button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Kung hindi pa joined, walang link — Join button lang
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div></div>
                      <span className="bg-amber-300 p-1 text-xs text-center rounded-[10px]">{isJoined ? 'Joined' : isPending ? "Pending" : "Not joined"}</span>
                    </div>
                    <span className="text-lg text-[#EFEFEF] font-medium">{program.title}</span>
                    <div className="flex items-center text-[#EFEFEF] text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
                    <div className="flex justify-center items-center mt-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setCancelingProgramId(program.id)
                              cancelProgram(program.id, {
                                onSettled: () => setCancelingProgramId(null)
                              });
                            }}
                            disabled={cancelingProgramId === program.id}
                            className={`italic text-white ${cancelingProgramId === program.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#6E0000] hover:bg-[#b00101]"
                              } w-3/4 font-semibold py-2 px-4 rounded-3xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap`}
                          >
                            {cancelingProgramId === program.id ? "canceling..." : "cancel request"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setJoiningProgramId(program.id)
                              joinProgram(program.id, {
                                onSettled: () => setJoiningProgramId(null)
                              });
                            }}
                            disabled={joiningProgramId === program.id}
                            className={`italic text-white ${joiningProgramId === program.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#00306E] hover:bg-[#06234a]"
                              } w-3/4 font-semibold py-2 px-4 rounded-3xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap`}
                          >
                            {joiningProgramId === program.id ? "requesting..." : "join request"}
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