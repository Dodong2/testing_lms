"use client";
/* hooks */
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ReactEventHandler, useState } from "react";
/* hooks */
import { usePostEvents } from "@/hooks/socket/usePostSocket";
import { usePost } from "@/hooks/post/usePost";
/* utils */
import { formatCreatedAt } from "@/util/formatCreatedAt";
/* icons */
import { FiSend } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";


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

  // for adjust text
  const adjustText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // auto-resize logic
    const target = e.target;
    target.style.height = "auto"; // reset height
    const maxHeight = 6 * 24; // assuming ~24px per line height
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="p-0.5 rounded-md w-full bg-white"></div>
      {/* button comments */}
      <div className="mt-2">
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer 
               text-sky-700 bg-sky-50 border border-transparent 
               hover:bg-sky-100 hover:text-sky-800
               active:scale-95 transition-all duration-150 ease-in-out"
        >
          {/* Icon: I-normalize ang size */}
          <span className="text-lg">
            <FaRegCommentDots />
          </span>


          {comments.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                View comments
              </span>
              <span className="text-xs font-semibold rounded-full bg-sky-500 text-white h-5 w-5 flex items-center justify-center flex-shrink-0">
                {comments.length}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium">
              Add comment
            </span>
          )}
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
                    <button onClick={() => handleDelete(comment.id)} className="ml-2" title="delete this comment?">
                      <FiTrash2 className="text-red-500 transform transition-transform duration-200 hover:scale-135" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 break-words">{comment.content}</p>


              </div>
            </div>
          ))}


          {/* comments input */}
            <div className="bg-white flex items-center rounded-3xl px-3 w-64 focus-within:w-96 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out border-b-3 border-l-3 border-transparent hover:border-b-amber-500 hover:border-l-amber-500 focus-within:border-amber-500">
              <textarea
                value={newComment}
                onChange={(e) => { setNewComment(e.target.value), adjustText(e) }} placeholder="Add Comment" required className="flex-grow py-2 bg-transparent focus:outline-none resize-none overflow-hidden" rows={1} />
              <button
                className={`text-[#00306E] flex items-center justify-center hover:text-gray-800 active:scale-95 transition-transform   ${!newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}>
                <FiSend size={20} />
              </button>
            </div>

          </div>
      )}
    </div>
  );
};

export default Comments;
