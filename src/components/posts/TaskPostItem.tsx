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
import { FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { formatCreatedAt } from "@/util/formatCreatedAt";
import { CiPen } from "react-icons/ci";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { HiChevronDown } from 'react-icons/hi';

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
    const [menuOpen, setMenuOpen] = useState(false);

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
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* <div className="w-10 h-10 rounded-full overflow-hidden">
                        {post.author.image && (
                            <Image
                                src={post.author.image}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                            />
                        )}
                    </div> */}

                    {/* left side */}
                    <div className="relative group">
                        {/* Main clickable card */}
                        <div className="bg-gray-300 hover:bg-amber-400 p-3 rounded-2xl transition-colors duration-200">
                            <Link href={`/home/participants/programs/${programId}/${post.id}/Submission`}>
                                <h1 className="font-bold text-2xl text-gray-800">{post.title}</h1>
                            </Link>
                            <p className="text-xs text-gray-600">{formatCreatedAt(post.createdAt)}</p>
                        </div>
                        
                        {/* Hover overlay div */}
                        <div className="absolute right-0 top-full mt-1 w-[220px] bg-white shadow-lg rounded-xl border border-gray-200 p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-10">
                            {/* Arrow pointer */}
                            <div className="absolute -top-2 left-6 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>

                            {}
                            <p className="text-sm text-gray-700 font-medium">
                                Click to view instructions and submit your assignment.
                            </p>

                        </div>

                    </div>
                </div>

                {/* right side */}
                <div className="flex justify-center items-center gap-1 text-lg">
                    {/* tags */}
                    <div className="text-sm font-medium font-serif flex items-center justify-center gap-0.5 text-gray-800 bg-white p-0.5 rounded-md"><CiPen className="text-xs" /> <span className="text-xs sm:text-sm">{post.tag}</span></div>
                    {/* Edit / Delete */}
                    <div className="relative">
                        {/* Menu Toggle Button */}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)} className="p-1 rounded-full hover:bg-amber-500 cursor-pointer active:scale-75 transition-transform">
                            <FiMoreVertical className="text-gray-700 text-lg" />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col items-stretch animate-fadeIn z-10">
                                <button onClick={() => { handleToggleUpdateModal(post); setMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
                                    <FiEdit className="text-yellow-500" /> Edit
                                </button>

                                <button onClick={() => { handleToggleDeleteModal(post); setMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors">
                                    <FiTrash2 className="text-red-500" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Content */}
            {session?.user.role === 'INSTRUCTOR' && (
                <PostsContent content={post.content} />
            )}


            {/* Files & Deadline */}
            {session?.user.role === 'INSTRUCTOR' && (
                <div key={post.id} className="border border-gray-200 rounded-lg shadow-sm bg-white mt-3">
                    <div onClick={() => setShowFiles((prev) => !prev)} className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition duration-150">
                        <div className="flex items-center gap-2">
                            {showFiles ? (
                                < FaRegFolderOpen className="text-gray-400" />
                            ) : (
                                < FaRegFolder className="text-gray-400" />
                            )}

                            {/* Text at File Count */}
                            <span className="font-medium text-gray-700">
                                Files ({post.files?.length || 0})
                            </span>
                        </div>

                        {/* DEADLINE AT TOGGLE ARROW */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-red-600 font-medium">
                                Deadline: {post.deadline ? format(new Date(post.deadline), "MMM dd, yyyy") : "N/A"}
                            </span>

                            {/* Arrow Icon na umiikot */}
                            <HiChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${showFiles ? 'rotate-180' : ''}`} />
                        </div>
                    </div>

                    {showFiles && post.files && post.files.length > 0 && (
                        <div className="border-t border-gray-100 p-3 space-y-1">
                            {post.files?.map((file, idx) => (
                                <PostFiles key={idx}
                                    name={file.name}
                                    url={file.url}
                                    onClick={(f) => setSelectedFile(f)}
                                />
                            ))}
                        </div>
                    )}
                    {showFiles && (!post.files || post.files.length === 0) && (
                        <div className="border-t border-gray-100 p-3 text-sm text-gray-500 text-center italic">
                            No files attached to this post.
                        </div>
                    )}
                </div>
            )}

            {/* submission for beneficiary */}
            {/* {session?.user.role === 'BENEFICIARY' && (
                <Link href={`/home/participants/programs/${programId}/${post.id}/Submission`}>
                    <button>Submit your work</button>
                </Link>
            )} */}

            {/* grading for instructor */}
            {/* {session?.user.role === 'INSTRUCTOR' && (
                <Link href={`/home/participants/programs/${programId}/${post.id}/Submission`}>
                <button>Student work</button>
                </Link>
            )} */}


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