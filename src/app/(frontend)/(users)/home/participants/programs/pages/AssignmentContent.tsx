import { useSession } from "next-auth/react"
/* hooks */
import { usePost } from "@/hooks/post/usePost"
import { usePostEvents } from "@/hooks/socket/usePostSocket";
import { useOpenPostModal } from "@/hooks/post/useOpenPostModal";
/* components */
import TaskPostItem from "@/components/posts/TaskPostItem"
import UpdatePostModal from "@/components/modals/post modal/UpdatePostModal";
import DeletePostModal from "@/components/modals/post modal/DeletePostModal";
import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";

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

  if (isLoading) return <Loading size={45}/>;

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
        <EmptyState message="no Assigment yet." />
      )}

      {/* post update modal */}
      {OpenUpdate && selectedPost && (
        <UpdatePostModal
          programId={programId}
          title={selectedPost.title}
          postId={selectedPost.id}
          content={selectedPost.content}
          files={selectedPost.files ?? []}
          deadline={selectedPost.deadline ?? ""}
          onClose={() => handleToggleUpdateModal(selectedPost)}
          onSuccess={() => handleToggleUpdateModal(selectedPost)}
          tags={selectedPost.tag}
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
