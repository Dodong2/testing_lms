"use client";
/* hooks */
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
/* hooks */
import { usePostEvents } from "@/hooks/socket/usePostSocket";
import { usePost } from "@/hooks/post/usePost";
/* utils */
import { formatCreatedAt } from "@/util/formatCreatedAt";
/* icons */
import { FiSend } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";


interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    image: string
  }
  createdAt?: string
}

interface CommentsProps {
  programId: string
  postId: string
  comments: Comment[]
  onAddComment: (programId: string, postId: string, comment: string) => void
}


const Comments: React.FC<CommentsProps> = ({ programId, postId, comments = [], onAddComment }) => {
  usePostEvents(programId)
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("")
  const { mutate: deleteComment } = usePost(programId).useDeleteComments()
  const { data: session } = useSession()

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onAddComment(programId, postId, newComment)
    setNewComment("")
  }

  const handleDelete = (commentId: string) => {
    deleteComment({ postId, commentId })
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="p-0.5 rounded-md w-full bg-white"></div>
      {/* button comments */}
      <div className="">
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex justify-center items-center bg-sky-200 hover:bg-sky-400 hover:text-white border border-gray-300 gap-2 p-1 rounded-md cursor-pointer active:scale-95 transition-transform">
          <span className="text-1xl"><FaRegCommentDots /></span>
          <span className="text-sm">{comments.length > 0
            ? <div className="flex justify-center items-center gap-1">View comments <span className="text-xs rounded-md bg-gray-400 text-white h-5 w-5 flex items-center justify-center">{comments.length}</span></div>
            : 'Add comment'}</span>
        </button>
      </div>

      {/* comments */}
      {showComments && (
        <div className="space-y-4">
          {/* Existing Comments */}
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
                {comment.author.image && (
                  <Image
                    src={comment.author.image}
                    alt={comment.author.name}
                    width={40} height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>

              {/* comment contents */}
              <div className="bg-white p-3 rounded-md w-fit min-w-[180px] max-w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt && (
                        <span className="text-xs text-gray-500">
                          {formatCreatedAt(comment.createdAt)}
                        </span>
                      )}
                    </span>
                  </div>
                  {/* show delete only if user is author */}
                  {session?.user?.id == comment.author.id && (
                    <button onClick={() => handleDelete(comment.id)} className="ml-2 text-red-500 hover:text-red-700">delete</button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 break-words">{comment.content}</p>


              </div>
            </div>
          ))}



          {/* comments input */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text" value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add Comment"
              required
              className="flex-1 p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button className={`text-gray-600 hover:text-gray-800 active:scale-95 transition-transform ${!newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmitComment} disabled={!newComment.trim()} >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
