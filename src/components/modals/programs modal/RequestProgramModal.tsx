/* hooks */
import { useJoinRequests } from "@/hooks/program/useJoinRequests"
/* components */
import Loading from "@/components/Loading"
import EmptyState from "@/components/EmptyState"

interface RequestProps {
    userId: string
    programId: string
    onSuccess: () => void
    onClose: () => void
}

const RequestProgramModal = ({ userId, programId, onSuccess, onClose }: RequestProps) => {
    const { data: requests, isLoading } = useJoinRequests().useJoinRequests(programId)
    const { mutate: approveRequest } = useJoinRequests().useApproveJoinRequest(programId)

    if (isLoading) return <Loading />
    if (!requests?.length) return <EmptyState message="No join requests yet." />

  return (
     <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Join Requests</h1>
      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="shadow-sm border">
            <div className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">{req.user.name}</p>
                <p className="text-gray-500 text-sm">{req.user.email}</p>
              </div>
              <button
                onClick={() => approveRequest(req.user.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

export default RequestProgramModal