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
import { SkeletonGrid } from "@/components/SkeletonGrid"
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
  const { data: programData, isLoading } = usePrograms(page, search, filter === 'JOINED')
  const { mutate: joinProgram, isPending: joining } = useJoinRequests().useJoinProgram()
  const { mutate: cancelProgram, isPending: canceling } = useJoinRequests().useCancelJoin()

  if (status === "loading") return <SkeletonGrid count={6} variant="card" />
  if (!session) return null // Prevent render flicker

  // for button filter all & joined program
  const filteredPrograms = programData?.programs?.filter((program) => {
    if (filter === "JOINED") return program.joined
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
            onClick={() => {setFilter("ALL"), setPage(1)}}
            className={`px-2 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${filter === "ALL" ?  "bg-[#EFEFEF] text-gray-800 hover:bg-blue-100" : "bg-[#00306E] hover:bg-[#06234a] text-[#EFEFEF] shadow-md"}`}>
            All Programs
          </button>

          <button
            onClick={() => {setFilter("JOINED"), setPage(1)}}
            className={`px-2 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${filter === "JOINED" ?  "bg-[#EFEFEF] text-gray-800 hover:bg-blue-100" : "bg-[#00306E] hover:bg-[#06234a] text-[#EFEFEF] shadow-md"}`}>
            Your Programs
          </button>
        </div>
      </div>


      <h2 className="text-2xl font-bold italic text-[#EFEFEF]">{filter === 'ALL' ? 'All Programs' : 'Your Programs'}</h2>

      {/* Dashboard content */}
        {isLoading ? (
          <SkeletonGrid count={6} variant="programs" />
        ) : filteredPrograms && filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 p-6 bg-[#525252] rounded-md shadow-md">
          {filteredPrograms.map((program) => {
            const isJoined = program.joined
            const isPending = program.pending;

            return (
              <div
                key={program.id}
                className="bg-[#E7E7E7] rounded-lg shadow overflow-hidden border-2 border-gray-500 hover:border-blue-500 transition-transform duration-200 hover:scale-[1.02]"
              >
                {/* Kung joined na siya, clickable */}
                {isJoined ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      {isJoined ? <PiSealCheckDuotone className="text-amber-300" size={25} /> : <div></div>}
                      <span className="bg-amber-300 p-1 text-xs text-center rounded-[10px]">Joined</span>
                    </div>
                    <span className="text-lg text-gray-900 font-medium">{program.title}</span>
                    <div className="flex items-center text-gray-900 text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
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
                    <span className="text-lg text-gray-900 font-medium">{program.title}</span>
                    <div className="flex items-center text-gray-900 text-sm mt-1"><FiUser className="mr-1" />{program.totalMembers} total members</div>
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
          })}
        </div>) : (
          <EmptyState message="No programs available yet." />
        )}


      {/* pagination control, for future purposes */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="flex items-center justify-center gap-2 px-1 py-1 bg-white shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer active:scale-95 transition-transform">
          <FaAngleLeft /> <span>Prev</span> 
        </button>
        <span className="text-white font-medium">Page {programData?.page} of {programData?.totalPages}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page === programData?.totalPages} className="flex items-center justify-center gap-2 px-1 py-1 bg-white shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer active:scale-95 transition-transform">
          <span>Next</span> <FaAngleRight />
        </button>
      </div>


    </div>
  )
}