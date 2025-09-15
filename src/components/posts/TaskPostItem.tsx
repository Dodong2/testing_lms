"use client"
import Image from "next/image"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { formatCreatedAt } from "@/util/formatCreatedAt";
import Comments from "../Comments";
import { PostGetTypes } from "@/types/postManagetypes";
import { Session } from "next-auth";
import { format } from "date-fns";

interface TaskPostItemProps {
    post: PostGetTypes
    session: Session | null
    programId: string
    handleToggleUpdateModal: (post: PostGetTypes) => void;
    handleToggleDeleteModal: (post: PostGetTypes) => void;
    createComment: (args: { programId: string; postId: string; content: string }) => void;
}

const TaskPostItem = ({ post, session, programId, handleToggleUpdateModal, handleToggleDeleteModal, createComment }: TaskPostItemProps) => {
    return (
        <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        {post.author.image && (
                            <Image
                                src={post.author.image}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                            />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{formatCreatedAt(post.createdAt)}</p>
                        <p>{post.tag}</p>
                    </div>
                </div>

                {/* Edit / Delete */}
                {session?.user.id === post.author.id && (
                    <div className="flex gap-4 text-lg ml-4">
                        <button onClick={() => handleToggleUpdateModal(post)} className="relative group flex flex-col items-center">
                            <FiEdit className="text-yellow-500 transform transition-transform duration-200 hover:scale-135" />
                            <span className="absolute -top-6 text-xs bg-gray-800 text-white px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                        </button>
                        <button onClick={() => handleToggleDeleteModal(post)} className="relative group flex flex-col items-center">
                            <FiTrash2 className="text-red-500 transform transition-transform duration-200 hover:scale-135" />
                            <span className="absolute -top-6 text-xs bg-gray-800 text-white px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>
                        </button>
                    </div>
                )}
            </div>


            {/* Content */}
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>


            {/* Files & Deadline */}
            <details key={post.id} className="border rounded-md p-2">
                <summary className="cursor-pointer">
                     (Deadline: {post.deadline ? format(new Date(post.deadline), "dd/MM/yy") : "N/A"})
                </summary>
                {post.files?.map((file) => (
                    <a
                        key={file.url}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-blue-600"
                    >
                        {file.name}
                    </a>
                ))}
            </details>


            {/* Comments */}
            <Comments
                programId={programId}
                postId={post.id}
                comments={post.comments}
                onAddComment={(programId, postId, content) =>
                    createComment({ programId, postId: post.id, content })
                }
            />
        </div>
    )
}

export default TaskPostItem