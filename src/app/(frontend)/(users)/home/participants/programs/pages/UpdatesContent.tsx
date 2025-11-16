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
import { SkeletonGrid } from "@/components/SkeletonGrid";
/* hooks */
import { usePost } from "@/hooks/post/usePost";
import { usePostEvents } from "@/hooks/socket/usePostSocket";
import { usePostModal } from "@/hooks/post/usePostModal";
import { useOpenPostModal } from "@/hooks/post/useOpenPostModal";
// icons
import { FaPlus } from "react-icons/fa";


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

  if (isLoading) return <SkeletonGrid variant="post" count={2}/>



  return (
    <div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 items-start mt-2">
          {/* Main content - LEFT SIDE */}
          <div className="rounded-md overflow-hidden">
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
              <div className="relative mt-2 rounded-md">
                <div className="relative group grid grid-cols-[auto_1fr] items-center gap-3 w-full">
                  <div className="fixed z-10 bottom-10 right-3 bg-[#00306E] rounded-4xl p-2 active:scale-95 transition-all duration-150 border-2 border-transparent hover:border-white" onClick={handleToggleTaskModal}>
                    <FaPlus className="text-white" size={25} />
                  </div>
                  {/* Hover overlay div */}
                  <div className="fixed flex items-center gap-1.5 right-16 bottom-7 bg-white shadow-lg rounded-xl p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-10 ">
                  <div className="absolute top-6 -right-1 w-3 h-3 bg-white  rotate-45"></div>
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
                    <p className="text-md text-gray-700 font-medium italic">
                      Post something (e.g., Announcements or Tasks)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-3 rounded-md shadow mt-1">
              {!posts?.length ? (
                <EmptyState message="no post yet." />
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
  );
}
