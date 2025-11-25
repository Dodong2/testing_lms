"use client"
import React, { useState, useEffect, HTMLInputTypeAttribute } from "react"
import Image from "next/image"
import { Submission } from "@/types/submissiontypes"
import { toast } from "react-hot-toast"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
/* components */
import FileViewer from "@/components/FileViewer"
import PostFiles from "@/components/posts/PostFiles"
import ModalFileViewer from "@/components/ModalFileViewer"
/* icons */
import { FaCheckCircle } from "react-icons/fa";
import { IoLink } from "react-icons/io5";

interface GradeModalProps {
  programId: string
  postId: string
  postTitle: string
  student: { id: string; name: string; image?: string }
  submission: Submission | null
  onClose: () => void
}

export default function GradeModal({ programId, postId, postTitle, student, submission, onClose }: GradeModalProps) {
  const [grade, setGrade] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null)

  const { useGradeSubmission } = useSubmission(programId, postId)
  const { mutate: gradeWorks, isPending } = useGradeSubmission()

  const [grade50, setGrade50] = useState(50)
  const [grade100, setGrade100] = useState(100)

  // Initialize form with existing grade/feedback if submission exists - SAME LOGIC AS SUBMISSIONLIST
  useEffect(() => {
    if (submission) {
      setGrade(submission.grade || 0)
      setFeedback(submission.feedback || "")
    } else {
      setGrade(0)
      setFeedback("")
    }
  }, [submission])

  // for submit grade
  const handleSubmit = () => {
    if (!submission) {
      toast.error("No submission found to grade")
      return
    }

    // SAME LOGIC AS SUBMISSIONLIST'S handleGradeSubmit
    gradeWorks(
      {
        submissionId: submission.id,
        grade: grade,
        feedback: feedback,
      },
      {
        onSuccess: () => {
          toast.success("Grade submitted successfully!")
          onClose()
        },
        onError: () => {
          toast.error("Failed to submit grade")
        }
      }
    )
  }

  // for logic if nothing changes the can't submit
  const isChanged = submission && (grade !== (submission.grade ?? 0) || feedback !== (submission.feedback ?? 0))
  // for all around logic
  const canSubmit = submission && !isPending && isChanged

  const gradeCap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = Number(e.target.value);
    // Enforce 0–100 range strictly
    const capped = Math.max(0, Math.min(100, input));
    setGrade(capped);
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
    <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-[#E7E7E7] p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-2">
          <div>
            <h1 className="text-[20px] text-gray-900 font-bold mb-2">{postTitle}</h1>
            <div className="p-0.5 rounded-md w-full bg-gray-500"></div>
            <div className="flex items-center gap-2 mt-2">
              {student.image && (
                <Image
                  src={student.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <h3 className="text-lg text-gray-700 font-medium">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {submission?.grade != null
                    ? <span className="text-green-500">Grade: {submission.grade}</span>
                    : 'Not graded yet'}
                </p>
                {submission && (
                  <p className={`text-sm font-medium ${submission.isLate ? 'text-green-500' : 'text-red-500'}`}>
                    {submission.isLate ? 'Submitted On Time' : 'Submitted Late'}
                  </p>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Submission Content - SAME STRUCTURE AS SUBMISSIONLIST */}
        {submission ? (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Submitted Work:</h4>

            {/* Files - SAME AS SUBMISSIONLIST */}
            {submission.files && submission.files.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-amber-500 mb-2">Files:</p>
                <div className="space-y-2">
                  {submission.files.map((file, idx) => (
                    <PostFiles
                      key={idx}
                      name={file.name}
                      url={file.url}
                      onClick={(f) => setSelectedFile(f)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Links - SAME LOGIC AS SUBMISSIONLIST */}
            {submission.links && submission.links.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium text-amber-500 mb-2">Links:</p>
                <div className="space-y-2">
                  {Array.isArray(submission.links) ? (
                    submission.links.map((link, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="mr-2 text-blue-600"><IoLink size={20} /></span>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm break-all hover:text-green-600 transition-colors duration-200"
                        >
                          {link}
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">🔗</span>
                      <a
                        href={submission.links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                      >
                        {submission.links}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!submission.files?.length && !submission.links?.length && (
              <p className="text-gray-500 text-sm">No files or links submitted.</p>
            )}

            {/* Existing Grade & Feedback - SAME AS SUBMISSIONLIST */}
            {submission.grade != null && (
              <div>
                <div className="flex items-center gap-1 font-bold italic text-green-500"><h1>Graded</h1> <FaCheckCircle /></div>
                <div className="p-3 bg-gray-50 rounded border border-gray-300">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Current Grade:</span> {submission.grade}
                  </p>
                  {submission.feedback && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Current Feedback:</span> {submission.feedback}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-3 p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-yellow-700">This student hasn't submitted work for this task yet.</p>
          </div>
        )}

        {/* Grading Form - SAME STRUCTURE AS SUBMISSIONLIST */}
        <div className="p-0.5 rounded-md w-full bg-gray-500"></div>
        <div className="mt-2">
          <h4 className="font-semibold text-gray-700 mb-3">Grade this submission</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade <span className="text-amber-500">(0-100)</span>:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => { gradeCap }}
                  className="bg-white shadow w-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!submission || isPending}
                  required
                />
                {/* Quick-grade buttons */}
                <button
                  onClick={() => setGrade(50)}
                  disabled={!submission || isPending}
                  className={`relative flex justify-center items-center shadow px-3 py-1 rounded-md text-sm font-medium active:scale-95 transition ${grade === 50 ? "bg-[#00306E] text-white cursor-not-allowed" : "bg-white text-gray-700 hover:bg-blue-100"}`}>
                  50
                </button>

                <button
                  onClick={() => setGrade(100)}
                  disabled={!submission || isPending}
                  className={`relative flex justify-center items-center shadow px-3 py-1 rounded-md text-sm font-medium active:scale-95 transition ${grade === 100 ? "bg-[#00306E] text-white cursor-not-allowed" : "bg-white text-gray-700 hover:bg-blue-100"}`}>
                  100
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments:
              </label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                className="bg-white shadow w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide feedback for the student..."
                disabled={!submission || isPending}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-2 py-2 rounded-md font-medium shadow bg-red-500 text-white hover:bg-red-600 transition"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-2 py-2 rounded-md font-medium shadow text-white ${!canSubmit ? "bg-[#00306E] cursor-not-allowed opacity-50" : "bg-[#00306E] hover:bg-blue-700"}`}>
            {isPending ? "Submitting..." : "Submit Grade"}
          </button>
        </div>
      </div>

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