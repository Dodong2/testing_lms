import { useState } from "react";
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission";
/* components */
import GradeModal from "@/components/modals/grading modal/GradeModal";
/* types */
import { Submission } from "@/types/submissiontypes";
/* icons */
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { usePost } from "@/hooks/post/usePost";

interface AssignmentTableProps {
  programId: string;
  beneficiaries: { id: string; name: string; image?: string }[]
  submissions: Submission[]
}

export const AssignmentTable = ({ programId, beneficiaries, submissions }: AssignmentTableProps) => {
  const { data: posts } = usePost(programId).usePosts()

  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null)
  const [selectedPost, setSelectedPost] = useState<{ id: string; title: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!posts) return <div>Loading...</div>

  const taskPosts = posts.filter(post => post.tag === 'TASK')

  const handleCellClick = (studentId: string, studentName: string, postId: string, postTitle: string, hasSubmission: boolean) => {
    // if (!hasSubmission) return // optionally only open if submission exists
    setSelectedStudent({ id: studentId, name: studentName })
    setSelectedPost({ id: postId, title: postTitle })
    setIsModalOpen(true)
  }

  return (
    <div className="bg-[#525252] space-y-6 rounded-md shadow mt-3 p-6">
      <table border={1} className="border-2 border-gray-800 border-collapse">
        <thead>
          <tr>
            <th className="border-2 border-gray-800 px-4 py-2 bg-gray-100">Name</th>
            {taskPosts.map(post => (
              <th key={post.id} className="max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis border-2 border-gray-800 px-4 py-2 bg-gray-100">{post.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map(student => (
            <tr key={student.id}>
              <td className="border-2 border-gray-800 px-4 py-2 bg-gray-100">{student.name}</td>
              {taskPosts.map(post => {
                const submission = submissions.find(sub => sub.student.id === student.id && sub.id === post.id)
                const hasSubmission = !!submission
                return (
                  <td key={post.id} onClick={() => handleCellClick(student.id, student.name, post.id, post.title, hasSubmission)} className="border-2 border-gray-800 px-4 py-2 bg-gray-100">
                    {hasSubmission ? `0/100 ` : `0/100 `}
                    {hasSubmission ? <FaCheckCircle /> : <IoMdCloseCircle />}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedStudent && selectedPost && (
        <GradeModal
          programId={programId}
          student={selectedStudent}
          post={selectedPost}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
