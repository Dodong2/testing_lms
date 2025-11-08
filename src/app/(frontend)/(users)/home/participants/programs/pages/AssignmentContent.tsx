import { useState } from "react";
import { useSession } from "next-auth/react"
/* hooks */
import { usePost } from "@/hooks/post/usePost"
import { useProgram } from "@/hooks/program/useProgram";
import { useSubmission } from "@/hooks/submission/useSubmission";
import { usePostEvents } from "@/hooks/socket/usePostSocket";
/* components */
import Loading from "@/components/Loading";
/* pages */
import { AssignmentLists } from "./AssignmentLists";
import { AssignmentTable } from "./AssignmentTable";

export default function AssignmentContent({ programId, postId }: { programId: string, postId: string }) {
  const { data: session } = useSession()
  const { data: posts, isLoading: postsLoading } = usePost(programId).usePosts()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data: program, isLoading: programLoading } = useProgram().useProgramById(programId)
  const { data: submissions, isLoading: subsLoading } = useSubmission(programId, postId).useGetSubmssions()

  usePostEvents(programId)

  if (!programId || programId === "undefined") {
    return <div>Invalid program ID</div>;
  }

  if (postsLoading || programLoading || subsLoading) return <Loading size={45}/>;

  const beneficiaries = program?.members?.filter(m => m.user.role === 'BENEFICIARY')
  .map(m => ({
    id: m.user.id,
    name: m.user.name,
    image: m.user.image
  })) || []


  return (
   <div>
    {/* for instructor */}
    {session?.user.role === 'INSTRUCTOR' && (
      <AssignmentTable programId={programId} beneficiaries={beneficiaries} submissions={submissions || []}/>
    )}

    {session?.user.role === 'BENEFICIARY' && (
      <AssignmentLists programId={programId}/>
    )}
   </div>
  )
}
