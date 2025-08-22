"use client"
/* hooks */
import { useProgram } from "@/hooks/program/useProgram";
import { useCreateFeedback } from "@/hooks/feedback/useCreateFeedback";
/* icons */
import { FiAlertTriangle, FiBell } from "react-icons/fi";

export default function Feedback() {
  const { data: programData, isLoading } = useProgram().usePrograms()
  const { handleSubmit, programId, setProgramId, visibility, setVisibility, type, setType, subject, setSubject, description, setDescription, isPending } = useCreateFeedback()

  return (
    <div className="bg-gray-100 rounded-md shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Submit Feedback</h2>
        {/* program name */}
        <div className="mb-4">
          <label htmlFor="program" className="block text-gray-700 text-sm font-bold mb-2">
            Program Name
          </label>

          <div className="relative">
            <select
              id="program"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value=''>Select program</option>
              {isLoading ? (<p>Loading</p>) : (
                <>{programData?.programs?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}</>
              )}

            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* checked */}
        <div className="flex">
          <div className="border rounded-md p-2">
            <label className="inline-flex items-center text-gray-700 mr-4">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-yellow-500"
                value="Anonymous"
                checked={visibility === "Anonymous"}
                onChange={() => setVisibility("Anonymous")}
                required
              />
              <FiAlertTriangle className="ml-1 h-5 w-5" />
              <span className="ml-2">Anonymous</span>
            </label>
          </div>
          <div className="border rounded-md p-2">
            <label className="inline-flex items-center text-gray-700 mr-4">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-green-600"
                value="Identified"
                checked={visibility === "Identified"}
                onChange={() => setVisibility("Identified")}
                required
              />
              <FiBell className="ml-1 h-5 w-5" />
              <span className="ml-2">Identified</span>
            </label>
          </div>
        </div>

        {/* feedback type */}
        <div className="mb-4">
          <label htmlFor="feedbackType" className="block text-gray-700 text-sm font-bold mb-2">
            Feedback Type
          </label>
          <div className="relative">
            <select
              id="feedbackType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option>Bug Report</option>
              <option>User Report</option>
              <option>General Feedback</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Brief description of your feedback"
            required
          />
        </div>

        {/* description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={9}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Provide detailed information about your feedback..."
            required
          />
        </div>
        <button
          type="submit" disabled={isPending}
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isPending ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  )
}