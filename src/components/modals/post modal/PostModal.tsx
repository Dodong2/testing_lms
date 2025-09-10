'use client'
import { useState } from "react"
import { usePost } from "@/hooks/post/usePost"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core";

interface PostModalActionProps {
  onSuccess: () => void
  onClose: () => void
  programId: string

}



const PostModal = ({ programId, onSuccess, onClose }: PostModalActionProps) => {
  const [content, setContent] = useState("")
  const { mutate: createPost, isPending } = usePost(programId).useCreatePost()
  useLockBodyScroll(true)

  const handleCreatePost = () => {
    if (!content.trim()) return
    createPost({ content })
    setContent('')
    onSuccess()
  }

  return (
    <div className="fixed flex inset-0 items-center justify-center z-50" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post Something / Create a discussions"
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={2}
          />
          <div className="flex gap-1.5">
            <button type="submit" className="bg-gray-800 text-white px-3 py-2 rounded text-sm sm:text-base whitespace-nowrap" disabled={isPending}>
              {isPending ? 'Posting...' : 'Post'}
            </button>
            <button type="button" className="bg-gray-800 text-white px-3 py-2 rounded text-sm sm:text-base whitespace-nowrap" onClick={onClose}>Cancel</button>
          </div>
        </form>

        {/* for uplaoding */}
        <div className="flex flex-col items-center gap-4">
      <UploadButton<OurFileRouter, "fileUploader">
        endpoint="fileUploader"
        content={{
          allowedContent: () => (
            <p className="text-xs text-gray-500 mt-2">Allowed: PDF, DOCX, PPTX, XLSX, Images</p>
          )
        }}
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            console.log("✅ File uploaded:", res[0].ufsUrl);
            alert(`Uploaded: ${res[0].ufsUrl}`);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("❌ Upload error:", error);
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>


        
      </div>
    </div>
  )
}

export default PostModal