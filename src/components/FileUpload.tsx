"use client";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core";
import toast from "react-hot-toast";
import React, { useRef } from "react";

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

  return (
    <>
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

      {files.length > 0 && (
        <ul className="text-sm mt-2">
          {files.map((f, idx) => (
            <li key={idx} className="truncate">
              📎 {f.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
