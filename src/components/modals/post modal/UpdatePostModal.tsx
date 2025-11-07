import { useSession } from "next-auth/react"
import { UpdatePost } from "@/hooks/post/UpdatePost"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/(backend)/api/uploadthing/core"
import { FileMeta } from "@/types/postManagetypes"
import { FileUpload } from "@/components/FileUpload";

interface UpdatePostProps {
    programId: string
    postId: string
    title: string
    content: string
    files: FileMeta[]
    deadline: string
    onSuccess?: () => void
    onClose: () => void
    tags?: "ANNOUNCEMENT" | "TASK" | "NORMAL"
}

const UpdatePostModal = ({ programId, postId, title, content, files = [], deadline = "", onSuccess, onClose, tags }: UpdatePostProps) => {
    const { data: session } = useSession()
    const { isPending, titleData, setTitleData, setContentData, filesData, setFilesData, setDeadlineData, handleSubmit } = UpdatePost({ programId, postId, title, content, files, deadline, onSuccess })
    useLockBodyScroll(true)

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-[#E7E7E7] rounded-lg shadow-lg max-w-md lg:max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg">
                    {/* post tags */}
                    <div className="flex rounded-t-lg sticky top-0 z-10">
                        <label className={`flex items-center justify-center gap-2 w-full rounded-tl-lg p-2 cursor-pointer transition-colors font-semibold bg-[#00306E] text-white`}>{tags}</label>
                    </div>

                    <div className="p-2 flex flex-col gap-3">
                    {/* title */}
                    {tags === 'TASK' && (
                        <input
                            type="text"
                            name="title"
                            value={titleData}
                            onChange={(e) => setTitleData(e.target.value)}
                            placeholder="title"
                            className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    )}

                    {/* content */}
                    <textarea
                        name="content"
                        defaultValue={content}
                        onChange={(e) => setContentData(e.target.value)}
                        rows={7}
                        required
                         className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />

                    {(session?.user.role === "ADMIN" || session?.user.role === "INSTRUCTOR" && deadline.length > 0) && (<div>
                        {/* deadline */}
                        <label className="text-sm font-medium text-red-500">Deadline</label>
                        <input
                            type="date"
                            onChange={(e) => setDeadlineData(e.target.value)}
                            defaultValue={deadline ? deadline.split("T")[0] : ""}
                             className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    </div>)}

                        {/* file upload only for ADMIN/INSTRUCTOR */}
                    {(session?.user.role === "ADMIN" || session?.user.role === "INSTRUCTOR") && (
                        <FileUpload files={filesData} setFiles={setFilesData} />
                    )}


                    {/* actions */}
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">Cancel</button>
                        <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer active:scale-95 transition-transform">
                            {isPending ? "Updating..." : "Update"}
                        </button>
                    </div>
                    </div>
                </form>
            </div>

        </div>
    )
}
export default UpdatePostModal