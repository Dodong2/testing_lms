import Image from "next/image"
import { useState } from "react"
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission"
import { useSubmissionEvents } from "@/hooks/socket/useSubmissionEvents"
/* types */
import { Submission } from "@/types/submissiontypes"

interface SubmissionLists {
  postId: string
  programId: string
}

const SubmissionList = ({ postId, programId }: SubmissionLists) => {
  useSubmissionEvents(programId, postId)
  const { data: getSubmissions, isLoading } = useSubmission(programId, postId).useGetSubmssions()
  const { mutate: gradeWorks, isPending } = useSubmission(programId, postId).useGradeSubmission()

  const [openSubmissionId, setOpenSubmissionId] = useState<string | null>(null)
  const [grades, setGrades] = useState<Record<string, number>>({})
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({})

  if (isLoading) return <p>Loading submissions...</p>
  if (!getSubmissions?.length) return <p>No submissions yet.</p>

  const handleToggle = (submission: Submission) => {
    setOpenSubmissionId(prev => (prev === submission.id ? null : submission.id))
    setGrades(prev => ({ ...prev, [submission.id]: submission.grade ?? 0 }))
    setFeedbacks(prev => ({ ...prev, [submission.id]: submission.feedback ?? '' }))
  }

  const handleGradeSubmit = (submissionId: string) => {
    gradeWorks(
      {
        submissionId,
        grade: grades[submissionId],
        feedback: feedbacks[submissionId],
      },
      {
        onSuccess: () => {
          setOpenSubmissionId(null)
        },
      }
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-gray-700 mb-2">Submitted Works</h2>
      {getSubmissions.map((submission) => (
        <div
          key={submission.id}
          className="border p-3 rounded-md"
          onClick={() => handleToggle(submission)}
        >
          <div className="flex justify-between items-center">
            {submission.student.image && (
              <Image
                src={submission.student.image}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            )}
            <p className="font-medium text-gray-800">{submission.student.name}</p>
            <p className="text-sm text-gray-500">
              {submission.grade != null ? `Grade: ${submission.grade}` : 'Not graded yet'}
            </p>
          </div>

          {/* links */}
          {/* links */}
          {submission.links && (
            <div className="mt-2">
              <p className="font-medium text-sm text-gray-700">Links:</p>
              {Array.isArray(submission.links) ? (
                <ul className="list-disc list-inside text-sm">
                  {submission.links.map((link, idx) => (
                    <li key={idx}>
                      🔗{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-500 underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a
                  href={submission.links}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-500 underline"
                >
                  🔗 {submission.links}
                </a>
              )}
            </div>
          )}


          {/* files */}
          {submission.files && submission.files.length > 0 && (
            <ul className="text-sm mt-2">
              {submission.files.map((file, idx) => (
                <li key={idx}>
                  📎{" "}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {submission.grade != null && (
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Grade:</span> {submission.grade}
              </p>
              {submission.feedback && (
                <p>
                  <span className="font-medium">Feedback:</span> {submission.feedback}
                </p>
              )}
            </div>
          )}

          {/* for grading */}
          {openSubmissionId === submission.id && (
            <div className="mt-3 border-t pt-3" onClick={(e) => e.stopPropagation()}>
              <h4 className="font-semibold text-gray-700 mb-2">Grade this submission</h4>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={grades[submission.id] ?? 0}
                  onChange={(e) =>
                    setGrades((prev) => ({
                      ...prev,
                      [submission.id]: Number(e.target.value),
                    }))
                  }
                  className="border rounded-md px-2 py-1 text-sm focus:ring focus:ring-gray-400"
                  placeholder="Enter grade (0–100)"
                />

                <textarea
                  value={feedbacks[submission.id] ?? ''}
                  onChange={(e) =>
                    setFeedbacks((prev) => ({
                      ...prev,
                      [submission.id]: e.target.value,
                    }))
                  }
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