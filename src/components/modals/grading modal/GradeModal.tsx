"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Submission } from "@/types/submissiontypes"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
/* components */
import FileViewer from "@/components/FileViewer"
import PostFiles from "@/components/posts/PostFiles"
import ModalFileViewer from "@/components/ModalFileViewer"
/* icons */
import { toast } from "react-hot-toast"

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
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl text-gray-900 font-bold">{postTitle}</h1>
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
                  {submission?.grade != null ? `Grade: ${submission.grade}` : 'Not graded yet'}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Submission Content - SAME STRUCTURE AS SUBMISSIONLIST */}
        {submission ? (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Submitted Work:</h4>
            
            {/* Files - SAME AS SUBMISSIONLIST */}
            {submission.files && submission.files.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Files:</p>
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
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Links:</p>
                <div className="space-y-2">
                  {Array.isArray(submission.links) ? (
                    submission.links.map((link, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="mr-2">🔗</span>
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
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
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Grade:</span> {submission.grade}
                </p>
                {submission.feedback && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Current Feedback:</span> {submission.feedback}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-yellow-700">This student hasn't submitted work for this task yet.</p>
          </div>
        )}

        {/* Grading Form - SAME STRUCTURE AS SUBMISSIONLIST */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-3">Grade this submission</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade (0-100):
              </label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={grade} 
                onChange={e => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!submission || isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback:
              </label>
              <textarea 
                value={feedback} 
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            disabled={isPending}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!submission || isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
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