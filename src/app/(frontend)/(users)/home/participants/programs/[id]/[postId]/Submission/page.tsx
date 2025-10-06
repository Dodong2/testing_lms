
interface SubmissionTask {
    programId: string
    postId: string
}

const page = ({ programId, postId }: SubmissionTask) => {
  return (
    <div>
        welcome to submission page
    </div>
  )
}

export default page