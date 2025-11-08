import { useState } from "react";
/* hooks */
import { useSubmission } from "@/hooks/submission/useSubmission";
/* components */
import GradeModal from "@/components/modals/grading modal/GradeModal";
/* types */
import { Submission } from "@/types/submissiontypes";
/* icons */
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
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
    <div className="bg-[#525252] space-y-6 rounded-md shadow mt-3 overflow-x-auto p-3">
      <table border={1} className="min-w-1.5 border-collapse text-left text-sm text-gray-200 rounded-lg">
        <thead>
          <tr  className="border-b border-white">
            <th className="px-2 py-1 font-semibold">Name</th>
            {taskPosts.map(post => (
              <th key={post.id}  className="px-2 py-1 font-semibold max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{post.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map(student => (
            <tr key={student.id} className="border-b border-gray-600 hover:bg-[#5c5c5c] transition">
              <td className="px-2 py-1">{student.name}</td>
              {taskPosts.map(post => {
                const submission = submissions.find(sub => sub.student.id === student.id && sub.id === post.id)
                const hasSubmission = !!submission
                return (
                  <td key={post.id} onClick={() => handleCellClick(student.id, student.name, post.id, post.title, hasSubmission)} className="px-2 py-1 hover:bg-gray-400 transition-colors duration-200">
                    <div className="flex items-center gap-2 text-1xl">
                    {hasSubmission ? `0/100 ` : `0/100 `}
                    {hasSubmission ? <FaCheck size={20} className="text-green-500" /> : <IoClose size={20} className="text-red-600"/>}
                    </div>
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
