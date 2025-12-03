import { useState, useMemo } from "react";
/* components */
import GradeModal from "@/components/modals/grading modal/GradeModal";
/* types */
import { Submission } from "@/types/submissiontypes";
import { PostGetTypes } from "@/types/postManagetypes";
/* icons */
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

interface AssignmentTableProps {
  programId: string;
  beneficiaries: { id: string; name: string; image?: string }[]
  taskPosts: PostGetTypes[]
  submissions: Submission[]
}

export const AssignmentTable = ({ programId, beneficiaries, taskPosts, submissions }: AssignmentTableProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [selectedPost, setSelectedPost] = useState<{ id: string; title: string } | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string, image?: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Create a map for quick submission lookup
  const submissionMap = useMemo(() => {
    const map = new Map();
    submissions.forEach(sub => {
      const key = `${sub.student.id}-${sub.postId}`;
      map.set(key, sub);
    });
    return map;
  }, [submissions]);

  const handleCellClick = (studentId: string, studentName: string, postId: string, postTitle: string, studentImage?: string) => {
    const key = `${studentId}-${postId}`;
    const submission = submissionMap.get(key);
    
    setSelectedSubmission(submission || null);
    setSelectedPost({ id: postId, title: postTitle });
    setSelectedStudent({ id: studentId, name: studentName, image: studentImage });
    setIsModalOpen(true);
  }

  const getSubmissionForStudentAndPost = (studentId: string, postId: string) => {
    const key = `${studentId}-${postId}`;
    return submissionMap.get(key);
  }

  const getGradeDisplay = (submission: Submission | undefined) => {
    if (!submission) return "0/100";
    return submission.grade != null ? `${submission.grade}/100` : "0/100";
  }

  if (taskPosts.length === 0) {
    return <div className="text-center py-8 text-gray-500">No task posts found.</div>;
  }

  return (
    <div className="bg-[#525252] space-y-6 rounded-md shadow mt-3 overflow-x-auto p-3">
      <table border={1} className="border-collapse text-center text-sm text-gray-200 rounded-lg">
        <thead>
          <tr className="border-b border-white">
            <th className="px-2 py-1 font-semibold">Name</th>
            {taskPosts.map(post => (
              <th key={post.id} className="px-2 py-1 font-semibold max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {post.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map(student => (
            <tr key={student.id} className="border-b border-gray-600 hover:bg-[#5c5c5c] transition">
              <td className="px-2 py-1 w-[200px] whitespace-normal break-words text-left">
                  <span>{student.name}</span>
              </td>
              {taskPosts.map(post => {
                const submission = getSubmissionForStudentAndPost(student.id, post.id);
                const hasSubmission = !!submission;
                const gradeDisplay = getGradeDisplay(submission);
                
                return (
                  <td 
                    key={post.id} 
                    onClick={() => handleCellClick(student.id, student.name, post.id, post.title, student.image)}
                    className="px-2 py-1 hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2 text-1xl">
                      {/* {gradeDisplay} */}
                      {hasSubmission ? 
                        <FaCheck size={20} className="text-green-500" /> : 
                        <IoClose size={20} className="text-red-600"/>
                      }
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedPost && selectedStudent && (
        <GradeModal
          programId={programId}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          student={selectedStudent}
          submission={selectedSubmission}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubmission(null);
            setSelectedPost(null);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  )
}