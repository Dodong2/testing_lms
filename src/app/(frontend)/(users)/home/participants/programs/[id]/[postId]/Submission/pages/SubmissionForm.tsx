'use client'
import React, { useState } from "react"
import toast from "react-hot-toast"
/* util */
import { UploadButton } from "@/util/Uploadthing"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
import { useSubmissionEvents } from "@/hooks/socket/useSubmissionEvents"
import { Submission } from "@/types/submissiontypes"
/* components */
import { FileUpload } from "@/components/FileUpload"
/* icons */

interface SubmissionFormProps {
  postId: string
  programId: string
}

interface FileMeta {
  name: string;
  url: string;
  type: string;
}

const SubmissionForm = ({ postId, programId }: SubmissionFormProps) => {
  useSubmissionEvents(programId, postId)
  const { mutate: submitWork, isPending } = useSubmission(programId, postId).useSubmitWork()
  const { data: submissions, isLoading } = useSubmission(programId, postId).useGetSubmssions()
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [links, setLinks] = useState<string[]>([""]);

  const mySubmission = submissions?.[0] as Submission | undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validLinks = links.filter((link) => link.trim() !== "")
    if (!files.length && validLinks.length === 0) {
      toast.error('Please attach at least one file or provide a link.')
      return
    }
    submitWork({ links: validLinks, files })
  }


  return (
    <div className="space-y-1 bg-[#00306E] p-3 rounded-2xl">
      <div></div>
      <h2 className="font-bold text-2xl text-white">Task Submission</h2>

      {/* If user has already submitted */}
      {mySubmission ? (
        <div className="p-3 border rounded bg-gray-50">
          <p className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            ✅ Already submitted on{" "}
            {new Date(mySubmission.createdAt).toLocaleDateString()}
          </p>

          <p className="text-sm mt-2">
            <span className="font-semibold">Grade:</span>{" "}
            {mySubmission.grade !== null && mySubmission.grade !== undefined
              ? `${mySubmission.grade}/100`
              : "0/100 (Not graded yet)"}
          </p>

          {mySubmission.feedback && (
            <p className="text-sm mt-1 italic text-gray-600">
              Feedback: {mySubmission.feedback}
            </p>
          )}

          <div className="mt-2">
            <p className="font-medium text-sm">Your Files:</p>
            {mySubmission.files && mySubmission.files.length > 0 ? (
              <ul className="text-sm mt-1">
                {mySubmission.files.map((f, idx) => (
                  <li key={idx}>
                    📎{" "}
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No files uploaded.</p>
            )}

            {mySubmission.links && mySubmission.links.length > 0 && (
              <div className="mt-2">
                <p className="font-medium text-sm">Submitted Links:</p>
                <ul className="list-disc list-inside text-sm">
                  {mySubmission.links.map((link, idx) => (
                    <li key={idx}>
                      🔗{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        // If no submission yet
         <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-white">Submit your work below:</p>

          {/* Dynamic Links Section */}
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  placeholder={`Link ${index + 1} (e.g., Google Drive, Docs)`}
                  value={link}
                  onChange={(e) => {
                    const updated = [...links]
                    updated[index] = e.target.value
                    setLinks(updated)
                  }}
                  // required={index === 0}
                  className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLinks((prev) => prev.filter((_, i) => i !== index))}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setLinks((prev) => [...prev, ""])}
              className="mt-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              + Add another link
            </button>
          </div>

          {/* File Upload Section */}
          <p className="text-lg font-semibold text-white">Files:</p>
          <FileUpload files={files} setFiles={setFiles} />

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SubmissionForm