'use client'
import { useState } from "react"
import toast from "react-hot-toast"
/* components */
import FileViewer from "@/components/FileViewer"
import PostFiles from "@/components/posts/PostFiles"
import ModalFileViewer from "@/components/ModalFileViewer"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
import { useSubmissionEvents } from "@/hooks/socket/useSubmissionEvents"
/* types */
import { Submission } from "@/types/submissiontypes"
/* components */
import { FileUpload } from "@/components/FileUpload"
/* icons */
import { FaCheckCircle } from "react-icons/fa";
import { IoLink } from "react-icons/io5";

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
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null)

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

  const getFileType = (url: string): string => {
    if (url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) return "image";
    if (url.match(/\.pdf$/i)) return "pdf";
    if (url.match(/\.(mp4|webm)$/i)) return "video";
    if (url.match(/\.(mp3|wav)$/i)) return "audio";
    if (url.match(/\.docx?$/i)) return "docx";
    if (url.match(/\.pptx?$/i)) return "pptx";
    return "text";
  };

  return (
    <div className="rounded-2xl">
      <div className="p-2 bg-[#00306E] rounded-t-md"><h2 className="font-bold text-2xl text-white">Task Submission</h2></div>
      {/* If user has already submitted */}
      {mySubmission ? (
        <div className="p-3 rounded-b-md bg-[#E7E7E7]">
          <h1 className="font-semibold text-gray-900">Status</h1>
          <div className="text-sm flex items-center gap-1">
            <FaCheckCircle className="text-green-500" size={15}/> 
            <div className="text-gray-900">
              Already submitted on
            {new Date(mySubmission.createdAt).toLocaleDateString()}
            </div>
          </div>

          <p className="text-sm mt-2 flex items-center gap-2">
            <span className="font-semibold">Grade:</span>{" "}
            {mySubmission.grade !== null && mySubmission.grade !== undefined
              ? <div className="font-semibold"><span className="text-green-600">{mySubmission.grade}</span>/100</div>
              : <div className="font-semibold"><span className="text-red-600">0</span>/100 <span className="text-amber-500">(Not graded yet)</span></div>}
          </p>

          {mySubmission.feedback && (
            <p className="text-sm mt-1 italic text-gray-600">
              Feedback: {mySubmission.feedback}
            </p>
          )}

          <div className="mt-2">
            <p className="text-gray-900 font-medium text-sm">File Submmited:</p>
            {mySubmission.files && mySubmission.files.length > 0 ? (
              <ul className="text-sm mt-1">
                {mySubmission.files.map((f, idx) => (
                  <PostFiles
                    key={idx}
                    name={f.name}
                    url={f.url}
                    onClick={(f) => setSelectedFile(f)}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No files uploaded.</p>
            )}

            {mySubmission.links && mySubmission.links.length > 0 && (
              <div className="mt-2">
                <p className="font-medium text-sm">Submitted Links:</p>
                <ul className="text-sm">
                  {mySubmission.links.map((link, idx) => (
                    <li key={idx}>
                      <div className="flex items-center gap-1">
                      <IoLink className="text-blue-600" size={20}/>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-green-600 transition-colors duration-200 mb-1"
                      >
                        {link}
                      </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        // If no submission yet
        <form onSubmit={handleSubmit} className="p-3 rounded-b-md bg-[#E7E7E7]">
          <h1 className="font-semibold text-gray-900">Submit your work below:</h1>

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
          <p className="text-gray-900 font-medium text-sm mt-2"></p>
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

      {/* File Viewer Modal */}
      <ModalFileViewer isOpen={!!selectedFile} onClose={() => setSelectedFile(null)}>
        {selectedFile && (
          <FileViewer
            fileUrl={selectedFile.url}
            fileType={getFileType(selectedFile.url)}
          />
        )}
      </ModalFileViewer>
    </div>
  )
}

export default SubmissionForm