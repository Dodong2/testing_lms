interface SubmissionPageProps {
  params: {
    id: string
    postId: string
  }
}

export default function SubmissionPage({ params }: SubmissionPageProps) {
  const { id: programId, postId } = params

  return (
    <div>
      Welcome to submission page for program {programId}, post {postId}
    </div>
  )
}
