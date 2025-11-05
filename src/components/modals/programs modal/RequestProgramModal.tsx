/* components */
import Loading from "@/components/Loading"
import EmptyState from "@/components/EmptyState"
import { JoinRequest } from "@/types/joinManagetypes"
import { useJoinRequests } from "@/hooks/program/useJoinRequests"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface RequestProps {
    programId: string
    onClose: () => void
}

const RequestProgramModal = ({ programId, onClose }: RequestProps) => {
    useLockBodyScroll(true)
    const { data: requests, isLoading } = useJoinRequests().useRequestLists(programId)
    const { mutate: approveRequest } = useJoinRequests().useApproveJoinRequest(programId)
    const { mutate: rejectRequest } = useJoinRequests().useRejectJoinRequest(programId)
    const { mutate: approveAll } = useJoinRequests().useApproveAll(programId)
    const { mutate: rejectAll } = useJoinRequests().useRejectAll(programId)

    const pendingUserIds = requests?.filter(r => r.status === "PENDING").map(r => r.user.id) || []


    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-[#E7E7E7] p-4 rounded-lg shadow-lg max-w-lg w-full relative">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Pending Join Requests</h1>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Review and manage learners who wish to join this program.</h3>

                <div className="flex gap-2 mb-2">
                    <button
                        disabled={!pendingUserIds.length}
                        onClick={() => approveAll(pendingUserIds)}
                        className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-md disabled:opacity-50 transition-colors duration-200"
                    >
                        Approve All
                    </button>
                    <button
                        disabled={!pendingUserIds.length}
                        onClick={() => rejectAll(pendingUserIds)}
                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md disabled:opacity-50 transition-colors duration-200"
                    >
                        Reject All
                    </button>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <Loading />
                    ) : requests && requests.length > 0 ? (
                        requests.map((req) => (
                            <div key={req.id} className="shadow-sm bg-white border border-gray-300 p-2 max-h-[80vh] overflow-y-auto h-56 rounded-2xl">
                                <div className="flex justify-between items-center p-2 bg-[#D9D9D9] rounded-lg">
                                    <div>
                                        <p className="font-semibold">{req.user.name}</p>
                                        <p className="text-gray-500 text-sm">{req.user.email}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => rejectRequest(req.user.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md transition-colors duration-200">Reject</button>
                                        <button onClick={() => approveRequest(req.user.id)} className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-md transition-colors duration-200">Approve</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState message="No join requests yet." />
                    )}

                </div>
                <div className="flex justify-end items-center mt-2">
                    <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-colors duration-200">Close</button>
                </div>
            </div>
        </div>
    )
}

export default RequestProgramModal