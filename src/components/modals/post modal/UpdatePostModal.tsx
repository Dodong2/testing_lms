import { useSession } from "next-auth/react"
import { UpdatePost } from "@/hooks/post/UpdatePost"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core"
import { FileMeta } from "@/types/postManagetypes"

interface UpdatePostProps {
    programId: string
    postId: string
    content: string
    files: FileMeta[]
    deadline: string
    onSuccess?: () => void
    onClose: () => void
}

const UpdatePostModal = ({ programId, postId, content, files = [], deadline = "", onSuccess, onClose }: UpdatePostProps) => {
    const { data: session } = useSession()
    const { isPending, setContentData, filesData, setFilesData, setDeadlineData, handleSubmit } = UpdatePost({ programId, postId, content, files, deadline, onSuccess })
    useLockBodyScroll(true)

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* content */}
                    <input
                        type="text"
                        name="content"
                        defaultValue={content}
                        onChange={(e) => setContentData(e.target.value)}
                        className="border p-2 w-full"
                    />

                    {/* file upload only for ADMIN/INSTRUCTOR */}
                    {(session?.user.role === "ADMIN" || session?.user.role === "INSTRUCTOR") && (
                        <div>
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
                                            url: file.url,
                                            type: file.type,
                                        }))
                                        setFilesData((prev) => [...(prev ?? []), ...uploaded])
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    console.error("❌ Upload error:", error)
                                    alert(`Upload failed: ${error.message}`)
                                }}
                            />
                        </div>
                    )}

                    {/* deadline */}
                    <input
                        type="date"
                        onChange={(e) => setDeadlineData(e.target.value)}
                        defaultValue={deadline ? deadline.split("T")[0] : ""}
                        className="border p-2 w-full"
                    />

                    {/* Preview uploaded files */}
                    {filesData.length > 0 && (
                        <ul className="text-sm mt-2">
                            {filesData.map((f, idx) => (
                                <li key={idx} className="truncate">
                                    📎 {f.name}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* actions */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {isPending ? "Updating..." : "Update"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}
export default UpdatePostModal