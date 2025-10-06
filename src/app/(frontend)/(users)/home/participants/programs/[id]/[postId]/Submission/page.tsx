
interface SubmissionTask {
  params: Promise<{
    id: string
    postId: string
  }>
}

export default async function SubmissionPage ({ params }: SubmissionTask) {
  const { id: programId, postId } = await params
  return (
    <div>
       Welcome to submission page for program {programId}, post {postId}
    </div>
  )
}

