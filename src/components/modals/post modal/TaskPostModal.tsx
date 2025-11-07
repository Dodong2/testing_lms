"use client";
import { useState } from "react";
/* hooks */
import { usePost } from "@/hooks/post/usePost";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
/* components */
import { FileUpload } from "@/components/FileUpload";
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
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [deadline, setDeadline] = useState("");
  const { mutate: createPost, isPending } = usePost(programId).useCreatePost();
  const [postType, setPostType] = useState<"TASK" | "ANNOUNCEMENT">("ANNOUNCEMENT");

  useLockBodyScroll(true);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (postType === 'TASK' && !title.trim()) {
      toast.error("Title is required for task posts.")
      return
    }

    if (postType === "TASK" && !deadline) {
      toast.error("Deadline is required for task posts.");
      return;
    }

    createPost(
      postType === "TASK"
        ? { title, content, files, deadline, tag: "TASK" }
        : { content, files, tag: "ANNOUNCEMENT" },
      {
        onSuccess: () => {
          setTitle("")
          setContent("");
          setFiles([]);
          setDeadline("");
          setPostType("ANNOUNCEMENT");
          onSuccess();
        },
      }
    );
  };

  // ❌ Disallowed file MIME types
  const disallowedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  ];

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: "rgba(70, 70, 70, 0.3)" }}>
      <div className="bg-[#E7E7E7] rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-3 rounded-lg">
          {/* Post type select */}
          <div className="flex rounded-t-lg sticky top-0 z-10">
            <label className={`flex items-center justify-center gap-2 w-full rounded-tl-lg p-2 cursor-pointer transition-colors font-semibold ${postType === 'ANNOUNCEMENT' ? 'bg-[#00306E] text-white' : 'bg-gray-100 hover:bg-gray-300'}`}>
              <input
                type="radio"
                name="postType"
                value="ANNOUNCEMENT"
                checked={postType === "ANNOUNCEMENT"}
                onChange={() => setPostType("ANNOUNCEMENT")}
                className="hidden"
              />
              Announcement
            </label>

            <label className={`flex items-center justify-center gap-2 w-full p-2 cursor-pointer transition-colors font-semibold rounded-tr-lg ${postType === 'TASK' ? 'bg-[#00306E] text-white' : 'bg-gray-100 hover:bg-gray-300'}`}>
              <input
                type="radio"
                name="postType"
                value="TASK"
                checked={postType === "TASK"}
                onChange={() => setPostType("TASK")}
                className="hidden"
              />
              Task
            </label>
          </div>


          <div className="p-2 flex flex-col gap-3">
            {/* title */}
            {postType === 'TASK' && (
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title for this task"
                className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
              />
            )}

            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === "TASK" ? "Write a task description..." : "Write an announcement..."
              }
              className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              rows={7}
              required
            />

            {/* Deadline input */}
            {postType === "TASK" && (
              <div>
                <label className="text-sm font-medium text-red-500">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  required={postType === "TASK"}
                />
              </div>
            )}

            {/* File Upload */}
            <FileUpload files={files} setFiles={setFiles} />

            <div className="flex gap-2 justify-end">
              <button type="button"
                className="px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={onClose}>
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer active:scale-95 transition-transform" disabled={isPending}>
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskPostModal;
