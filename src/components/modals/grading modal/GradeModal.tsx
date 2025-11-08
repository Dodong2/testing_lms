"use client"

import { useState } from "react"
import { gradeSubmissionTypes } from "@/types/submissiontypes"
import { toast } from "react-hot-toast"

interface GradeModalProps {
  programId: string
  student: { id: string; name: string }
  post: { id: string; title: string }
  onClose: () => void
}

export default function GradeModal({ programId, student, post, onClose }: GradeModalProps) {
  const [grade, setGrade] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")

  const handleSubmit = () => {
    // call API to save grade
    const payload: gradeSubmissionTypes = {
      programId,
      postId: post.id,
      submissionId: student.id,
      grade,
      feedback
    }
    console.log("Submitting grade payload:", payload)
    toast.success("Grade submitted!")
    onClose()
  }

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
    <div className="bg-[#E7E7E7] p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl text-gray-900">{post.title}</h1>
      <h3>Grade: {student.name}</h3>

      {/* File list placeholder */}
      <div>
        <p>Submitted files will appear here</p>
      </div>

      <div>
        <label>Grade:</label>
        <input type="number" value={grade} onChange={e => setGrade(Number(e.target.value))} />
      </div>

      <div>
        <label>Feedback:</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} />
      </div>

      <button onClick={handleSubmit}>Submit Grade</button>
      <button onClick={onClose}>Close</button>
    </div>
    </div>
  )
}
