"use client";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core";
import toast from "react-hot-toast";
import React, { useRef, useState } from "react";
/* components */
import PostFiles from "@/components/posts/PostFiles";
import ModalFileViewer from "@/components/ModalFileViewer";
import FileViewer from "@/components/FileViewer";

interface FileMeta {
  name: string;
  url: string;
  type: string;
}

interface FileUploadProps {
  files: FileMeta[];
  setFiles: React.Dispatch<React.SetStateAction<FileMeta[]>>;
}

const disallowedTypes = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
];

export const FileUpload = ({ files, setFiles }: FileUploadProps) => {
  // ✅ track if upload was aborted to prevent false success
  const uploadAborted = useRef(false);
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
    <>
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

      <UploadButton<OurFileRouter, "fileUploader">
        endpoint="fileUploader"
        content={{
          allowedContent: () => (
            <p className="text-xs text-gray-500 mt-2">
              Allowed: PDF, Images, and Videos only
            </p>
          ),
        }}
        onBeforeUploadBegin={(incomingFiles) => {
          const filtered = incomingFiles.filter((file) => {
            if (disallowedTypes.includes(file.type)) {
              toast((t) => (
                <span>
                  ❌ <b>{file.name}</b> not allowed. Please upload{" "}
                  <b>PDF, Images, or Videos</b> only.
                  <button
                    className="ml-2 text-red-500 underline"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    Dismiss
                  </button>
                </span>
              ));
              return false;
            }
            return true;
          });

          // ✅ Abort upload safely if no valid files remain
          if (filtered.length === 0) {
            uploadAborted.current = true;
            // Return empty so UploadThing won’t error out
            return [];
          }

          uploadAborted.current = false;
          return filtered;
        }}
        onClientUploadComplete={(res) => {
          // ✅ Skip if aborted earlier
          if (uploadAborted.current || !res || res.length === 0) return;

          const uploaded = res.map((file) => ({
            name: file.name,
            url: file.ufsUrl,
            type: file.type,
          }));

          setFiles((prev) => [...prev, ...uploaded]);
          toast.success("Files uploaded successfully!");
        }}
        onUploadError={(error: Error) => {
          if (!uploadAborted.current)
            toast.error(`Upload failed: ${error.message}`);
        }}
      />

      

      <ModalFileViewer isOpen={!!selectedFile} onClose={() => setSelectedFile(null)}>
        {selectedFile && <FileViewer fileUrl={selectedFile.url} fileType={getFileType(selectedFile.url)} />}
      </ModalFileViewer>
    </>
  );
};
