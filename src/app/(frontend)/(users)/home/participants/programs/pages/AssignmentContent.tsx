import { usePost } from "@/hooks/post/usePost"
import { useSession } from "next-auth/react"
import TaskPostItem from "@/components/posts/TaskPostItem"
import { usePostEvents } from "@/hooks/socket/usePostSocket";
import { useOpenPostModal } from "@/hooks/post/useOpenPostModal";
import UpdatePostModal from "@/components/modals/post modal/UpdatePostModal";
import DeletePostModal from "@/components/modals/post modal/DeletePostModal";

export default function AssignmentContent({ programId }: { programId: string }) {
  const { data: session } = useSession()
  const { data: posts, isLoading } = usePost(programId).usePosts()
  const { mutate: createComment } = usePost(programId).useCreateComment()
  const {
    handleToggleUpdateModal,
    OpenUpdate,
    selectedPost,
    handleToggleDeleteModal,
    OpenDelete,
  } = useOpenPostModal();

  usePostEvents(programId)

  if (!programId || programId === "undefined") {
    return <div>Invalid program ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;

  const taskPosts = posts?.filter((post) => post.tag === "TASK") ?? []

  return (
    <div className="space-y-6 rounded-md shadow mt-3">
      {/* assigments lists */}
      {taskPosts.length > 0 ? (
        taskPosts.map((post) =>  (
          <TaskPostItem key={post.id}
            post={post}
            session={session}
            programId={programId}
            handleToggleUpdateModal={handleToggleUpdateModal}
            handleToggleDeleteModal={handleToggleDeleteModal}
            createComment={createComment}
          />
        ) )
      ) : (
        <p>No activity</p>
      )}

      {/* post update modal */}
      {OpenUpdate && selectedPost && (
        <UpdatePostModal
          programId={programId}
          postId={selectedPost.id}
          content={selectedPost.content}
          files={selectedPost.files ?? []}
          deadline={selectedPost.deadline ?? ""}
          onClose={() => handleToggleUpdateModal(selectedPost)}
          onSuccess={() => handleToggleUpdateModal(selectedPost)}
        />
      )}

      {/* post delete modal */}
      {OpenDelete && selectedPost && (
        <DeletePostModal
          programId={programId}
          postId={selectedPost.id}
          onClose={() => handleToggleDeleteModal(selectedPost)}
          onSuccess={() => handleToggleDeleteModal(selectedPost)}
        />
      )}

    </div>
  )
}
