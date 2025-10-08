'use client'

/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
import { useState } from "react"
import { useSubmissionEvents } from "@/hooks/socket/useSubmissionEvents"

interface SubmissionLists {
  postId: string
  programId: string
}

const SubmissionList = ({ postId, programId }: SubmissionLists) => {
  useSubmissionEvents(programId, postId)
  const { data: getSubmissions, isLoading } = useSubmission(programId, postId).useGetSubmssions()
  const { mutate: gradeWorks, isPending } = useSubmission(programId, postId).useGradeSubmission()

  const [openSubmissionId, setOpenSubmissionId] = useState<string | null>(null)
  const [grade, setGrade] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>('')

  if (isLoading) return <p>Loading submissions...</p>;
  if (!getSubmissions?.length) return <p>No submissions yet.</p>;

  const handleToggle = (id: string) => {
    setOpenSubmissionId((prev) => (prev === id ? null : id))
  }

  const handleGradeSubmit = (submissionId: string) => {
    gradeWorks(
      { submissionId, grade, feedback },
      {
        onSuccess: () => {
          setGrade(0)
          setFeedback('')
          setOpenSubmissionId(null)
        }
      }
    )
  }


  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-gray-700 mb-2">Submitted Works</h2>
      {getSubmissions.map((submission) => (
        <div key={submission.id} className="border p-3 rounded-md" onClick={() => handleToggle(submission.id)}>
          <div className="flex justify-between items-center">
            <p className="font-medium text-gray-800">{submission.student.name}</p>
            <p className="text-sm text-gray-500">
              {submission.grade ? `Grade: ${submission.grade}` : 'Not graded yet'}
            </p>
          </div>

          {/* Links */}
          {submission.links && (
            <a href={submission.links} className="text-blue-500" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              View Link
            </a>
          )}

          {/* Files */}
          {submission.files && submission.files?.length > 0 && (
            <ul className="text-sm mt-2">
              {submission.files?.map((file, idx) => (
                <li key={idx}>
                  📎 <a href={file.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{file.name}</a>
                </li>
              ))}
            </ul>
          )}

          {/* Collapsible grading form */}
          {openSubmissionId === submission.id && (
            <div className="mt-3 border-t pt-3"
              onClick={(e) => e.stopPropagation()}>
              <h4 className="font-semibold text-gray-700 mb-2">Grade this submission</h4>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm focus:ring focus:ring-gray-400"
                  placeholder="Enter grade (0–100)"
                />

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Feedback (optional)"
                  className="border rounded-md px-2 py-1 text-sm focus:ring focus:ring-gray-400 resize-none"
                  rows={3}
                />
                <button
                  onClick={() => handleGradeSubmit(submission.id)}
                  disabled={isPending}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition disabled:opacity-50 w-fit"
                >
                  {isPending ? 'Grading...' : 'Submit Grade'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SubmissionList