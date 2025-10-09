'use client'

import React, { useState } from "react"
import toast from "react-hot-toast"
/* util */
import { UploadButton } from "@/util/Uploadthing"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
import { useSubmissionEvents } from "@/hooks/socket/useSubmissionEvents"
import { Submission } from "@/types/submissiontypes"


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
  const [links, setLinks] = useState("");

  const mySubmission = submissions?.[0] as Submission | undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!files.length && !links.trim()) {
      toast.error('Please attach at least one file or provide a link.')
    }
    submitWork({ links, files })
  }

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-700">Task Submission</h2>

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

            {mySubmission.links && (
              <p className="text-sm mt-1">
                🔗{" "}
                <a
                  href={mySubmission.links}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View submitted link
                </a>
              </p>
            )}
          </div>
        </div>
      ) : (
        // If no submission yet
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">Submit your work below:</p>

          <input
            type="url"
            placeholder="Optional link (e.g., Google Drive, Docs)"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <UploadButton
            endpoint="fileUploader"
            content={{
              allowedContent: () => (
                <p className="text-xs text-gray-500 mt-2">
                  Allowed: PDF, DOCX, PPTX, XLSX, Images
                </p>
              ),
            }}
            onClientUploadComplete={(res) => {
              if (res) {
                const uploaded = res.map((file) => ({
                  name: file.name,
                  url: file.ufsUrl,
                  type: file.type,
                }));
                setFiles((prev) => [...prev, ...uploaded]);
              }
            }}
            onUploadError={(error: Error) => {
              console.error("❌ Upload error:", error);
              alert(`Upload failed: ${error.message}`);
            }}
          />

          {files.length > 0 && (
            <ul className="text-sm mt-2">
              {files.map((f, idx) => (
                <li key={idx} className="truncate">
                  📎 {f.name}
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  )
}

export default SubmissionForm