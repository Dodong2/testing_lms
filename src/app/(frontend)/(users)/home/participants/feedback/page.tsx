"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram";
import { useCreateFeedback } from "@/hooks/feedback/useCreateFeedback";
/* icons */
import { FiAlertTriangle, FiBell } from "react-icons/fi";
import { SearchBar } from "@/components/SearchBar";

export default function Feedback() {
  // search & pagination for future purposes 
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data: session } = useSession()
  const { data: programData, isLoading } = useProgram().usePrograms(page, search, true)
  const { handleSubmit, programId, setProgramId, visibility, setVisibility, type, setType, subject, setSubject, description, setDescription, isPending } = useCreateFeedback()

  if (!session) return null // Prevent render flicker

  const programs = programData?.programs?.filter(p => {
    // beneficiary → only joined programs
    if (session.user.role === "BENEFICIARY") return p.joined === true
    // others (admin/instructor) → show all
    return true
  }) ?? []

  return (
    <div>
      <div className="bg-[#FFBD17] p-2 rounded-t-md">
        <h2 className="text-xl font-bold text-gray-900">Submit Feedback</h2>
      </div>

      <div className="bg-[#525252] rounded-b-md shadow-md p-5">
        {/* Search bar, for future purposes */}
        {session.user.role === 'ADMIN' && (
          <SearchBar onSearch={setSearch} placeholder="Search program title..." />
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

          {/* program name */}
          <div className="mb-4">
            <label htmlFor="program" className="block text-white text-sm font-bold mb-2">
              Program Name
            </label>

            <div className="relative">
              <select
                id="program"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" required
              >
                <option value=''>Select program</option>
                {isLoading ? (<option>Loading</option>) : programs?.length > 0 ? (
                  <>{programs?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}</>
                ) : (
                  <option disabled>No programs joined yet</option>
                )}

              </select>
            </div>
          </div>

          {/* checked */}
          <div>
            <label htmlFor="program" className="block text-white text-sm font-bold mb-2">
              Submit As
            </label>
            <div className="flex gap-2">
              <div className="rounded-md p-2 bg-white transition-all duration-200 active:scale-90">
                <label className="inline-flex items-center text-gray-700 mr-4">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-yellow-500"
                    value="Anonymous"
                    checked={visibility === "Anonymous"}
                    onChange={() => setVisibility("Anonymous")}
                    required
                  />
                  <FiAlertTriangle className="ml-1 h-5 w-5 text-amber-400" />
                  <span className="ml-2">Anonymous</span>
                </label>
              </div>

              <div className="rounded-md p-2 bg-white transition-all duration-200 active:scale-90">
                <label className="inline-flex items-center text-gray-700 mr-4">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-green-600"
                    value="Identified"
                    checked={visibility === "Identified"}
                    onChange={() => setVisibility("Identified")}
                    required
                  />
                  <FiBell className="ml-1 h-5 w-5 text-amber-400" />
                  <span className="ml-2">Identified</span>
                </label>
              </div>
            </div>
          </div>

          {/* feedback type */}
          <div className="mb-4">
            <label htmlFor="feedbackType" className="block text-white text-sm font-bold mb-2">
              Feedback Type
            </label>
            <div className="relative">
              <select
                id="feedbackType"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" required
              >
                <option>Bug Report</option>
                <option>User Report</option>
                <option>General Feedback</option>
              </select>
            </div>
          </div>

          {/* subject */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-white text-sm font-bold mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="Brief description of your feedback"
              required
            />
          </div>

          {/* description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <label htmlFor="description" className="block text-white text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={9}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="Provide detailed information about your feedback..."
              required
            />
            <div className="flex justify-end items-center">
              <button type="submit" disabled={isPending} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 active:scale-90">
                {isPending ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>

        </form>

        {/* pagination control, for future purposes */}
        {session.user.role === 'ADMIN' && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <span>Page {programData?.page} of {programData?.totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page === programData?.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        )}

      </div>
    </div>
  )
}