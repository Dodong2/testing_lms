
interface SubmissionTask {
  params: {
    id: string
    postId: string
  }
}

export default function SubmissionPage ({ params }: SubmissionTask) {
  const { id: programId, postId } = params
  return (
    <div>
       Welcome to submission page for program {programId}, post {postId}
    </div>
  )
}

