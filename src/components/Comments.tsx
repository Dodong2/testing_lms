"use client";
/* hooks */
import Image from "next/image";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChatSquareTextFill } from "react-icons/bs";
import { usePostEvents } from "@/hooks/socket/usePostSocket";

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


const Comments: React.FC<CommentsProps> = ({ programId, postId, comments =[], onAddComment }) => {
  usePostEvents(programId)
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = () => {
    if(!newComment.trim()) return
    onAddComment(programId, postId, newComment)
    setNewComment("")
  }

  const formatDate = (dateString?: string) => {
    if(!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="p-1 rounded-md w-full bg-white"></div>
      {/* button comments */}
              <div>
                <button
                  onClick={() => setShowComments((prev) => !prev)}
                  className="bg-gray-300 flex items-center justify-center gap-2 p-2 rounded-md hover:bg-gray-500 cursor-pointer active:scale-95 transition-transform">
                  <span className="text-2xl"><BsChatSquareTextFill/></span>
                  <span className="text-1xl font-mono">{comments.length > 0 ? `View comments (${comments.length})` : 'Add comment' }</span>
                </button>
              </div>
      
      {/* comments */}
      {showComments && (
        <div className="space-y-4">
          {/* Existing Comments */}
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 bg-white p-3 rounded-md">
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.author.name}</span>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt && (
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  </div>
              
            </div>
          ))}



        {/* comments input */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <input
            type="text" value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add Comment"
            className="flex-1 p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button onClick={handleSubmitComment} disabled={!newComment.trim()} className={`text-gray-600 hover:text-gray-800 active:scale-95 transition-transform ${!newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <FiSend />
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
