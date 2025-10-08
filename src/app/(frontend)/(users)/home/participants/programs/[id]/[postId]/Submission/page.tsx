import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

interface SubmissionTask {
  params: Promise<{
    id: string
    postId: string
  }>
}

export default async function SubmissionPage ({ params }: SubmissionTask) {
  const { id: programId, postId } = await params
  const session = await getServerSession(authOptions)

  if(!session) redirect("/")

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      content: true,
      files: true, // assuming array of files or JSON[]
      createdAt: true,
    },
  });

   if (!post) return <div>Post not found</div>;
  
  // Dynamic imports (para hindi kasama sa initial bundle kung di kailangan)
  const SubmissionForm = dynamic(() => import("./pages/SubmissionForm"))
  const SubmissionList = dynamic(() => import("./pages/SubmissionList"))
  

  return (
    <div className="p-6">
       <h1 className="text-lg font-semibold mb-4">
        Submission for Post: {postId} 
      </h1>

      <p className="text-xs">{post.content}</p>

      {session?.user.role === 'BENEFICIARY' && (
        <SubmissionForm postId={postId} programId={programId}/>
      )}

      {session?.user.role === 'INSTRUCTOR' && (
        <SubmissionList postId={postId} programId={programId}/>
      )}

    </div>
  )
}

