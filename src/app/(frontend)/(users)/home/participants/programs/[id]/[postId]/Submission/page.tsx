
interface SubmissionTask {
  params: {
    programId: string
    postId: string
  }
}

export default function SubmissionPage ({ params }: SubmissionTask) {
  const { id: programId, postId } = params
  return (
    <div>
        welcome to submission page
    </div>
  )
}

