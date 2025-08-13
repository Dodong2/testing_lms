"use client";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
/* components */
import Comments from '@/components/Comments';
import PostModal from '@/components/modals/post modal/PostModal';
/* hooks */
import { usePost } from '@/hooks/post/usePost';
import { usePostEvents } from '@/hooks/socket/usePostSocket';
import { usePostModal } from '@/hooks/post/usePostModal';
/* icons */
// import { FiDownload } from 'react-icons/fi';


export default function UpdatesContent({ programId }: { programId: string }) {
  const { data: session } = useSession()
  const { openPost, OpenPostModal, ClosePostModal } = usePostModal()
  const { usePosts, useCreateComment } = usePost(programId)
  const { data: posts, isLoading } = usePosts()
  const { mutate: createComment } = useCreateComment()

  usePostEvents(programId)

  if (!programId || programId === 'undefined') {
        return <div>Invalid program ID</div>
    }

  if(isLoading) return <div>Loading...</div>

  return (
  <>
    <div className="w-full">
  <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 items-start">
    {/* Main content - LEFT SIDE */}
    <div className="bg-white rounded-md overflow-hidden">
      {/* Post input area to pre tangina */}
      <div className="p-2 bg-gray-100 mt-2 rounded-md">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <button onClick={OpenPostModal}>Post something</button>
          {openPost && (
          <PostModal onSuccess={ClosePostModal} onClose={ClosePostModal} programId={programId} />
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className=" bg-gray-100 p-4 space-y-6 rounded-md shadow mt-3">
        {posts?.map(post => (
          <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-300">
                  {session?.user?.image && (
                    <Image src={session.user.image} alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full"/>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{post.author.name}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-gray-500 cursor-pointer">...</div>
            </div>

            {/* Post Content */}
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* File Attachments */}
            {/* {post.files && post.files.length > 0 && (
              <div className="space-y-2 mb-4">
                {post.files.map((file, fileIdx) => (
                  <div key={fileIdx} className="flex items-center justify-between bg-white p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-gray-300 text-xs text-gray-700 rounded">
                        {file.type}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="text-gray-600 hover:text-gray-800">{file.icon}</button>
                  </div>
                ))}
              </div>
            )} */}

            {/* Comments */}
            <Comments comments={post.comments} onAddComment={(content) => createComment({ postId: post.id, content })}/>

          </div>
        ))}
      </div>
    </div>

  </div>
</div>

  </>
  )
}