"use client";

import { useState } from "react";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import PostFiles from "@/components/posts/PostFiles";
import ModalFileViewer from "@/components/ModalFileViewer";
import FileViewer from "@/components/FileViewer";
import { PostGetTypes, FileMeta, SubmissionPostTypes } from "@/types/postManagetypes";

const SubmissionForm = dynamic(() => import("./SubmissionForm"));
const SubmissionList = dynamic(() => import("./SubmissionList"));

export interface SubmissionClientProps {
    session: Session;
    programId: string;
    postId: string;
    post: SubmissionPostTypes
    files: FileMeta[]
}

export default function SubmissionClient({
    session,
    programId,
    postId,
    post,
    files,
}: SubmissionClientProps) {
    const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-[#222222] rounded-2xl">
            <div>
                <h1 className="font-bold text-2xl text-white">{post.title}</h1>
                <p className="text-xs text-white">{post.content}</p>

                <div className="shadow-sm mt-3 border border-gray-400 rounded-t-2xl">
                    {files.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-3">
                            {files.map((file, idx) => (
                                <PostFiles key={idx} name={file.name} url={file.url} onClick={(f) => setSelectedFile(f)} />
                            ))}
                        </div>
                    )}
                    {files.length === 0 && (
                        <div className="border-t border-gray-100 p-3 text-sm text-gray-500 text-center italic">
                            No files attached to this post.
                        </div>
                    )}
                </div>
            </div>

            <div>
                {session.user.role === "BENEFICIARY" && <SubmissionForm postId={postId} programId={programId} />}
            </div>
            {/* {session.user.role === "INSTRUCTOR" && <SubmissionList postId={postId} programId={programId} />} */}

            <ModalFileViewer isOpen={!!selectedFile} onClose={() => setSelectedFile(null)}>
                {selectedFile && <FileViewer fileUrl={selectedFile.url} fileType={getFileType(selectedFile.url)} />}
            </ModalFileViewer>
        </div>
    );
}
