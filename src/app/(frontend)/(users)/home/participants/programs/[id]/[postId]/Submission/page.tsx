import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

import { FileMeta, PostGetTypes } from "@/types/postManagetypes";
interface SubmissionTask {
  params: Promise<{
    id: string
    postId: string
  }>
}

export default async function SubmissionPage({ params }: SubmissionTask) {
  const { id: programId, postId } = await params
  const session = await getServerSession(authOptions)

  if (!session) redirect("/")

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      programId: true,
      createdAt: true,
      tag: true,
      deadline: true,
      files: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!post) return <div>Post not found</div>;



  const files: FileMeta[] = Array.isArray(post.files)
    ? (post.files as unknown as FileMeta[])
    : [];

  const formattedPost: PostGetTypes = {
    id: post.id,
    content: post.content,
    files,
    createdAt: post.createdAt.toISOString(),
    title: post.title || "",
    authorId: post.authorId || "",
    programId: programId || "",
    author: {
      id: post.author?.id || "",
      name: post.author?.name || "Unknown",
      image: post.author?.image || ""
    },
    comments: []
  };

  // Dynamic imports (para hindi kasama sa initial bundle kung di kailangan)
  const SubmissionClient = dynamic(() => import("./pages/SubmissionClient"))


  return (
    <SubmissionClient
      session={session}
      programId={programId}
      postId={postId}
      post={formattedPost}
      files={files}
    />
  )
}

