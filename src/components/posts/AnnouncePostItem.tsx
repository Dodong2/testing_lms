"use client"
import { useState } from "react";
import Image from "next/image"
import { Session } from "next-auth";
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
import { CiPen } from "react-icons/ci";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { HiChevronDown } from 'react-icons/hi';
/* utils */
import { formatCreatedAt } from "@/util/formatCreatedAt";

interface TaskPostItemProps {
    post: PostGetTypes
    session: Session | null
    programId: string
    handleToggleUpdateModal: (post: PostGetTypes) => void;
    handleToggleDeleteModal: (post: PostGetTypes) => void;
    createComment: (args: { programId: string; postId: string; content: string }) => void;
}

const AnnouncePostItem = ({ post, session, programId, handleToggleUpdateModal, handleToggleDeleteModal, createComment }: TaskPostItemProps) => {
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
        <div key={post.id} className="bg-[#222222] p-3 rounded-md focus:outline-none focus:ring-2 hover:ring-gray-500">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
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
                        <p className="font-semibold text-xs sm:text-sm md:text-base text-[#E9E9E9] whitespace-nowrap">{post.author.name}</p>
                        <p className="text-xs text-[#E9E9E9]">{formatCreatedAt(post.createdAt)}</p>
                    </div>
                </div>

                {/* right side */}
                <div className="flex justify-center items-center gap-1 text-lg">
                    {/* tags */}
                    {/* <div className="text-sm font-medium font-serif flex items-center justify-center gap-0.5 text-gray-800 bg-white p-0.5 rounded-md"><CiPen className="text-xs" /> <span className="text-xs sm:text-sm">{post.tag}</span></div> */}
                    {(session?.user.email && session.user.role !== 'BENEFICIARY') && (<>
                    {/* Edit / Delete */}
                    <div className="relative">
                        {/* Menu Toggle Button */}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}  className="text-white hover:text-gray-800 p-1 rounded-full hover:bg-amber-500 cursor-pointer active:scale-75 transition-transform">
                            <FiMoreVertical className="text-lg" />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col items-stretch animate-fadeIn z-10">
                                <button onClick={() => {handleToggleUpdateModal(post); setMenuOpen(false);}} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-amber-200 rounded-t-2xl transition-colors">
                                    <FiEdit className="text-yellow-500" /> Edit
                                </button>

                                <button onClick={() => {handleToggleDeleteModal(post); setMenuOpen(false);}} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-amber-200 rounded-b-2xl transition-colors">
                                    <FiTrash2 className="text-red-500" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                    </>)}
                </div>

            </div>


            {/* Content */}
            <PostsContent content={post.content} />

            {/* Files & Deadline */}
            {post.files && post.files?.length > 0 && (
                 <div key={post.id} className="shadow-sm mt-3 border-1 border-t-0 border-gray-400 rounded-t-2xl">
                    <div onClick={() => setShowFiles((prev) => !prev)} className="flex justify-between items-center bg-white p-3 shadow-2xl rounded-t-2xl cursor-pointer transition duration-150">
                        <div className="flex items-center gap-2">
                            {showFiles ? (
                               < FaRegFolderOpen className="text-gray-800"/>
                            ) : (
                                < FaRegFolder className="text-gray-800"/>
                            )}

                            {/* Text at File Count */}
                            <span className="font-medium text-gray-800">
                                Files ({post.files?.length || 0})
                            </span>
                        </div>

                      
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-800 font-medium">
                                View files
                            </span>

                            {/* Arrow Icon na umiikot */}
                            <HiChevronDown  className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${showFiles ? 'rotate-180' : ''}`}/>
                        </div>
                    </div>
                        
                    {showFiles && post.files && post.files.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
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

export default AnnouncePostItem