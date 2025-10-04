/* for instructors */
"use client";
import { useState } from "react";
import { usePost } from "@/hooks/post/usePost";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core";
import toast from "react-hot-toast";

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
  const [postType, setPostType] = useState<"TASK" | "ANNOUNCEMENT">("ANNOUNCEMENT")


  useLockBodyScroll(true);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (postType === "TASK" && !deadline) {
      toast.error("Deadline is required for task posts.")
      return
    }

    createPost(
      postType === "TASK"
        ? { content, files, deadline, tag: "TASK" }
        : { content, files, tag: "ANNOUNCEMENT" }, // 👈 isama files kahit announcement
      {
        onSuccess: () => {
          setContent("");
          setFiles([]);
          setDeadline("");
          setPostType("ANNOUNCEMENT");
          onSuccess();
        },
      }
    );
  };

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(70, 70, 70, 0.3)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-3">

          {/* Post type select */}
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="postType"
                value="TASK"
                checked={postType === "TASK"}
                onChange={() => setPostType("TASK")}
              />
              Task
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="postType"
                value="ANNOUNCEMENT"
                checked={postType === "ANNOUNCEMENT"}
                onChange={() => setPostType("ANNOUNCEMENT")}
              />
              Announcement
            </label>
          </div>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === "TASK" ? "Write a task description..." : "Write an announcement..."
            }
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={2}
            required
          />

          {/* Deadline input */}
          {postType === "TASK" && (
            <div>
              <label className="text-sm font-medium">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border rounded-md p-2"
                required={postType === "TASK"}
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
              {isPending ? "Posting..." : postType === 'TASK' ? "Post Task" : "Post Announcement"}
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
