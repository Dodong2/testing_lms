"use client"
import { useState } from "react";
import Image from "next/image"
import { Session } from "next-auth";
import Link from "next/link";
/* components */
import Comments from "../Comments";
import PostsContent from "./PostsContent";
import PostFiles from "./PostFiles";
import ModalFileViewer from "../ModalFileViewer";
import FileViewer from "../FileViewer";
/* types */
import { PostGetTypes } from "@/types/postManagetypes";
/* date format */
import { format } from "date-fns";
/* icons */
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { formatCreatedAt } from "@/util/formatCreatedAt";
import { CiPen } from "react-icons/ci";

interface TaskPostItemProps {
    post: PostGetTypes
    session: Session | null
    programId: string
    handleToggleUpdateModal: (post: PostGetTypes) => void;
    handleToggleDeleteModal: (post: PostGetTypes) => void;
    createComment: (args: { programId: string; postId: string; content: string }) => void;
}

const TaskPostItem = ({ post, session, programId, handleToggleUpdateModal, handleToggleDeleteModal, createComment }: TaskPostItemProps) => {
    const [showFiles, setShowFiles] = useState(false)
    const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null)

    const getFileType = (url: string): string => {
        if (url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) return "image";
        if (url.match(/\.pdf$/i)) return "pdf";
        if (url.match(/\.(mp4|webm)$/i)) return "video";
        if (url.match(/\.(mp3|wav)$/i)) return "audio";
        if (url.match(/\.docx?$/i)) return "docx";
        if (url.match(/\.pptx?$/i)) return "pptx";
        return "text";
    };

    return (
        <div key={post.id} className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 hover:ring-gray-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
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
                    </div>
                </div>

                {/* right side */}
                <div className="flex justify-center items-center gap-4 text-lg ml-4">
                    {/* tags */}
                    <div className="text-sm font-medium font-serif flex items-center justify-center gap-0.5 text-gray-800 bg-white p-0.5 rounded-md"><CiPen className="text-xs" /> <span>{post.tag}</span></div>
                    {/* Edit / Delete */}
                    {session?.user.id === post.author.id && (<>
                        <button onClick={() => handleToggleUpdateModal(post)} className="relative group flex flex-col items-center">
                            <FiEdit className="text-yellow-500 transform transition-transform duration-200 hover:scale-135" />
                            <span className="absolute -top-6 text-xs bg-gray-800 text-white px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                        </button>
                        <button onClick={() => handleToggleDeleteModal(post)} className="relative group flex flex-col items-center">
                            <FiTrash2 className="text-red-500 transform transition-transform duration-200 hover:scale-135" />
                            <span className="absolute -top-6 text-xs bg-gray-800 text-white px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>
                        </button>
                    </>)}
                </div>
            </div>


            {/* Content */}
            <PostsContent content={post.content} />


            {/* Files & Deadline */}
            <div key={post.id} className="border rounded-md p-2" onClick={() => setShowFiles((prev) => !prev)}>
                <div className="cursor-pointer">
                    (Deadline: {post.deadline ? format(new Date(post.deadline), "dd/MM/yy") : "N/A"})
                </div>
                {showFiles && post.files && post.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {post.files?.map((file, idx) => (
                            <PostFiles key={idx}
                                name={file.name}
                                url={file.url}
                                onClick={(f) => setSelectedFile(f)}
                            />
                        ))}
                    </div>)}
            </div>
            
            {/* submission for beneficiary */}
            {session?.user.role === 'BENEFICIARY' && (
                <Link href={`/home/participants/programs/${programId}/${post.id}/Submission`}>
                    <button>Submit your work</button>
                </Link>
            )}
            
            {/* grading for instructor */}
            {session?.user.role === 'INSTRUCTOR' && (
                <Link href={`/home/participants/programs/${programId}/${post.id}/Submission`}>
                <button>Student work</button>
                </Link>
            )}


            {/* Comments */}
            <Comments
                programId={programId}
                postId={post.id}
                comments={post.comments}
                onAddComment={(programId, postId, content) =>
                    createComment({ programId, postId: post.id, content })
                }
            />

            <ModalFileViewer isOpen={!!selectedFile} onClose={() => setSelectedFile(null)}>
                {selectedFile && (
                    <FileViewer
                        fileUrl={selectedFile.url}
                        fileType={getFileType(selectedFile.url)}
                    />
                )}
            </ModalFileViewer>
        </div>
    )
}

export default TaskPostItem