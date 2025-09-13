"use client";

import { useState } from "react";
import { usePost } from "@/hooks/post/usePost";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core";

interface FileMeta {
  name: string;
  url: string;
  type: string;
}

interface TaskPostModalProps {
  programId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const TaskPostModal = ({ programId, onSuccess, onClose }: TaskPostModalProps) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [deadline, setDeadline] = useState("");
  const { mutate: createPost, isPending } = usePost(programId).useCreatePost();

  useLockBodyScroll(true);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (files.length > 0 && !deadline) {
      alert("Deadline is required for task posts with files.");
      return;
    }

    createPost(
      { content, files, deadline },
      {
        onSuccess: () => {
          setContent("");
          setFiles([]);
          setDeadline("");
          onSuccess();
        },
      }
    );
  };

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-50"
      style={{ backgroundColor: "rgba(70, 70, 70, 0.3)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a task description..."
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={2}
            required
          />

          {/* Deadline input */}
          {files.length > 0 && (
            <div>
              <label className="text-sm font-medium">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
          )}

          {/* File Upload */}
          <UploadButton<OurFileRouter, "fileUploader">
            endpoint="fileUploader"
            content={{
              allowedContent: () => (
                <p className="text-xs text-gray-500 mt-2">
                  Allowed: PDF, DOCX, PPTX, XLSX, Images
                </p>
              ),
            }}
            onClientUploadComplete={(res) => {
              if (res) {
                const uploaded = res.map((file) => ({
                  name: file.name,
                  url: file.ufsUrl,
                  type: file.type,
                }));
                setFiles((prev) => [...prev, ...uploaded]);
              }
            }}
            onUploadError={(error: Error) => {
              console.error("❌ Upload error:", error);
              alert(`Upload failed: ${error.message}`);
            }}
          />

          {/* Preview uploaded files */}
          {files.length > 0 && (
            <ul className="text-sm mt-2">
              {files.map((f, idx) => (
                <li key={idx} className="truncate">
                  📎 {f.name}
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-gray-800 text-white px-3 py-2 rounded text-sm sm:text-base"
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post Task"}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded text-sm sm:text-base"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskPostModal;
