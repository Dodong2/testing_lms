'use client'
import { useState } from "react";
/* hooks */
import { useFeedback } from "@/hooks/feedback/useFeedback"
import { useLocalStorageAdmin } from "@/hooks/feedback/useLocalStorageAdmin";
import { useFeedbackEvents } from "@/hooks/socket/useFeedbackSocket";
import { FaRegUserCircle } from "react-icons/fa";
/* components */
import EmptyState from "@/components/EmptyState";
/* icon */
import { FiGlobe, FiTag } from 'react-icons/fi';
import { MdOutlineDescription } from "react-icons/md";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";


export default function FeedbackManagePage() {
    useFeedbackEvents()
    const [page, setPage] = useState(1)
    const { data, isLoading } = useFeedback().useGetFeedbacks(page, 5)
    const { openId, readIds, handleToggle } = useLocalStorageAdmin()
    const [filter, setFilter] = useState<"All" | "Identified" | "Anonymous">("All")

    const feedbacksData = data?.feedbacks || []
    const totalPages = data?.totalPages || 1

    const filterFeedbacks = feedbacksData.filter((f) => {
        if(filter === 'All') return true
        if(filter === 'Anonymous') return f.visibility === 'Anonymous' 
        if(filter === 'Identified') return f.visibility !== 'Anonymous'
        return true
    })

    return (
        <div className="p-2 md:p-5">
            <h1 className="text-2xl font-bold italic text-gray-800 mb-6">Feedback Management</h1>

             {/* 🔘 Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {["ALL", "Anonymous", "Identified"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "All" | "Anonymous" | "Identified")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 active:scale-95 border-b-2 border-transparent hover:border-b-green-500
              ${filter === type
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-gray-700"}`}
          >
            {type}
          </button>
        ))}
      </div>

            <div>{feedbacksData.length}</div>
            {isLoading ? (<p className="text-center text-gray-500">Loading feedbacks...</p>) : feedbacksData.length > 0 ? (<>
                <div className="space-y-4">
                    {feedbacksData?.map((f) => {

                        const isAnon = f.visibility === 'Anonymous'
                        const isOpen = openId === f.id
                        const isRead = readIds.has(f.id)

                        //para sa callbacks
                        const userName = f.user?.name || 'Unknown User'
                        const userRole = f.user?.role || 'Unknown Role'
                        const programTitle = f.program?.title || 'Unknown Program'
                        const createdAt = f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Unknown Date'

                        return (
                            <div key={f.id} className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${!isRead ? "border-l-4 border-red-500" : ""}`}>
                                {/* Summary row */}
                                <div onClick={() => handleToggle(f.id, isOpen)} className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 ${!isRead ? "bg-red-50" : "hover:bg-[#E3FDE7]"} ${isOpen ? 'bg-[#F8E0C4]' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-semibold ${!isRead ? "text-amber-800" : "text-gray-900"} truncate`}>
                                            {isAnon ? `Anonymous Feedback` : `${userName}`}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {`${programTitle} • ${userRole}`}
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 ml-4">
                                        <span className="hidden md:inline-block mr-2">Date: {createdAt}</span>
                                        <button className={`p-1 rounded-full text-center transition ${isOpen ? 'text-red-500 hover:text-red-700' : 'text-[#2ECC40] hover:text-green-700'}`}>
                                            {isOpen ? <FaChevronDown size={20} /> : <FaChevronLeft size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {isOpen && (
                                    <div className={`p-4 border-t border-white bg-[#F8E0C4]`}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <FiGlobe className="mr-2 text-green-500" />
                                                <span className="font-medium">Visibility:</span> <span className="ml-1">{f.visibility || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiTag className="mr-2 text-yellow-500" />
                                                <span className="font-medium">Type:</span> <span className="ml-1">{f.type || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MdOutlineDescription className="mr-2 text-amber-950" />
                                                <span className="font-medium">Subject:</span> <span className="ml-1">{f.subject || 'Unknown'}</span>
                                            </div>
                                            {!isAnon && (
                                                <div className="flex items-center">
                                                    <FaRegUserCircle className="mr-2 text-blue-500" />
                                                    <span className="font-medium">Submitted by:</span> <span className="ml-1">{userName}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-800">Description:</span>
                                            <p className="mt-2 text-gray-600 leading-relaxed">{f.description || 'No description provided.'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-end items-center gap-4 mt-6">
                    <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                        <FaAngleLeft /> <span>Prev</span>
                    </button>
                    <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="flex items-center justify-center gap-3 px-2 py-2 text-gray-700 bg-yellow-100 shadow-lg rounded disabled:opacity-50 border-b border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform">
                        <span>Next</span> <FaAngleRight />
                    </button>
                </div>

            </>) : (
                <EmptyState message="No feedback available yet."/>
            )}

        </div>
    )
}