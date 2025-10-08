'use client'

import React, { useState } from "react"
import toast from "react-hot-toast"
/* util */
import { UploadButton } from "@/util/Uploadthing"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
import { useSubmissionEvents } from "@/hooks/socket/useSubmissionEvents"


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
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [links, setLinks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(!files.length && !links.trim()) {
      toast.error('Please attach at least one file or provide a link.')
    }
    submitWork({
      links,
      files,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-medium text-gray-700">Submit Your Work</h2>

      <input
        type="url"
        placeholder="Optional link (e.g., Google Drive, Docs)"
        value={links}
        onChange={(e) => setLinks(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {/* File Upload */}
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
  )
}

export default SubmissionForm