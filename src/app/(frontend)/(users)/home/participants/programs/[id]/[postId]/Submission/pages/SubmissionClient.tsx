"use client";
import { useState } from "react";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
/* components */
import PostFiles from "@/components/posts/PostFiles";
import ModalFileViewer from "@/components/ModalFileViewer";
import FileViewer from "@/components/FileViewer";
/* types */
import { PostGetTypes, FileMeta, SubmissionPostTypes } from "@/types/postManagetypes";
/* pages */
const SubmissionForm = dynamic(() => import("./SubmissionForm"));
/* icons */
import { FaArrowLeft } from "react-icons/fa6";

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
    const router = useRouter()

    const getFileType = (url: string): string => {
        if (url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) return "image";
        if (url.match(/\.pdf$/i)) return "pdf";
        if (url.match(/\.(mp4|webm)$/i)) return "video";
        if (url.match(/\.(mp3|wav)$/i)) return "audio";
        if (url.match(/\.docx?$/i)) return "docx";
        if (url.match(/\.pptx?$/i)) return "pptx";
        return "text";
    };

    const handleBack = () => {
    router.push(`/home/participants/programs/${programId}?tab=assignments`)
  }

    return (<>
        <button onClick={handleBack} className="px-3 py-2 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 mb-2 transition-all duration-200 active:scale-95" title="back"><FaArrowLeft size={20}/></button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-[#222222] rounded-2xl">
            {/* left - instructions */}
            <div>
                <h1 className="font-bold text-2xl text-white">{post.title}</h1>
                <div className="p-0.5 rounded-md w-full bg-white mt-2 mb-2"></div>

                <p className="text-xs text-white">{post.content}</p>

                <div>
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

            {/* right - submit */}
            <div>
                {session.user.role === "BENEFICIARY" && <SubmissionForm postId={postId} programId={programId} />}
            </div>


            <ModalFileViewer isOpen={!!selectedFile} onClose={() => setSelectedFile(null)}>
                {selectedFile && <FileViewer fileUrl={selectedFile.url} fileType={getFileType(selectedFile.url)} />}
            </ModalFileViewer>
        </div>
    </>);
}
