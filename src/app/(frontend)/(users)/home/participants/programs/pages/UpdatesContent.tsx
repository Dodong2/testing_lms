"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
/* components */
import PostModal from "@/components/modals/post modal/PostModal";
import UpdatePostModal from "@/components/modals/post modal/UpdatePostModal";
import DeletePostModal from "@/components/modals/post modal/DeletePostModal";
import TaskPostModal from "@/components/modals/post modal/TaskPostModal";
import TaskPostItem from "@/components/posts/TaskPostItem";
import AnnouncePostItem from "@/components/posts/AnnouncePostItem";
// import BeneficiaryPostItem from "@/components/posts/BeneficiaryPostItem";
import EmptyState from "@/components/EmptyState";
/* hooks */
import { usePost } from "@/hooks/post/usePost";
import { usePostEvents } from "@/hooks/socket/usePostSocket";
import { usePostModal } from "@/hooks/post/usePostModal";
import { useOpenPostModal } from "@/hooks/post/useOpenPostModal";


export default function UpdatesContent({ programId }: { programId: string }) {
  const { data: session } = useSession();
  const { openPost, OpenPostModal, ClosePostModal } = usePostModal();
  const { usePosts, useCreateComment } = usePost(programId);
  const { data: posts, isLoading } = usePosts();
  const { mutate: createComment } = useCreateComment();
  const {
    handleToggleUpdateModal,
    OpenUpdate,
    selectedPost,
    handleToggleDeleteModal,
    OpenDelete,
    OpenTask,
    handleToggleTaskModal
  } = useOpenPostModal();

  usePostEvents(programId);

  if (!programId || programId === "undefined") {
    return <div>Invalid program ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;



  return (
    <>
      <div className="w-full">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 items-start">
          {/* Main content - LEFT SIDE */}
          <div className="bg-white rounded-md overflow-hidden">
            {/* Post input area for beneficiary for bawal mag post si beneficiary*/}
            {/* {session?.user.role === 'BENEFICIARY' && (
              <div className="p-2 bg-gray-100 mt-2 rounded-md">
                <div
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full"
                  onClick={OpenPostModal}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300">
                    {session?.user.image && (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </div>
                  <p>Post something</p>
                </div>
              </div>
            )} */}

            {/* for Admin & instructor for post with file for TASK */}
            {session?.user.role === 'ADMIN' || session?.user.role === 'INSTRUCTOR' && (
              <div className="p-2 bg-gray-100 mt-2 rounded-md">
                <div
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full"
                  onClick={handleToggleTaskModal}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300">
                    {session?.user.image && (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </div>
                  <p>Post something</p>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-6 rounded-md shadow mt-3">
              {!posts?.length ? (
                <EmptyState message="no post yet."/>
              ) : (
                posts.map((post) =>
                  post.tag === "TASK" ? (
                    <TaskPostItem
                      key={post.id}
                      post={post}
                      session={session}
                      programId={programId}
                      handleToggleUpdateModal={handleToggleUpdateModal}
                      handleToggleDeleteModal={handleToggleDeleteModal}
                      createComment={createComment}
                    />
                  ) : post.tag === "ANNOUNCEMENT" ? (
                    <AnnouncePostItem
                      key={post.id}
                      post={post}
                      session={session}
                      programId={programId}
                      handleToggleUpdateModal={handleToggleUpdateModal}
                      handleToggleDeleteModal={handleToggleDeleteModal}
                      createComment={createComment}
                    />
                  ) : null // <- normal post or unknown type
                )
              )}
            </div>
          </div>
        </div>

        {/* post task modal */}
        {OpenTask && (
          <TaskPostModal programId={programId} onClose={handleToggleTaskModal} onSuccess={handleToggleTaskModal} />
        )}

        {/* post modal */}
        {openPost && (
          <PostModal
            onSuccess={ClosePostModal}
            onClose={ClosePostModal}
            programId={programId}
          />
        )}

        {/* post update modal */}
        {OpenUpdate && selectedPost && (
          <UpdatePostModal
            programId={programId}
            postId={selectedPost.id}
            title={selectedPost.title}
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
    </>
  );
}
