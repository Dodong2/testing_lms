/* components */
import Loading from "@/components/Loading"
import EmptyState from "@/components/EmptyState"
import { JoinRequest } from "@/types/joinManagetypes"

interface RequestProps {
    programId: string
    onClose: () => void
    requests: JoinRequest[]
    isLoading: boolean
    approveRequest: (userId: string) => void
    rejectRequest: (userId: string) => void
    approveAll: (userIds: string[]) => void
    rejectAll: (userIds: string[]) => void
}

const RequestProgramModal = ({ programId, onClose, requests, approveRequest, rejectRequest, approveAll, rejectAll, isLoading }: RequestProps) => {

    const pendingUserIds = requests?.filter(r => r.status === "PENDING").map(r => r.user.id) || []

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Join Requests</h1>

                <div className="flex justify-end gap-2 mb-4">
                    <button
                        disabled={!pendingUserIds.length}
                        onClick={() => approveAll(pendingUserIds)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                        Approve All
                    </button>
                    <button
                        disabled={!pendingUserIds.length}
                        onClick={() => rejectAll(pendingUserIds)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                        Reject All
                    </button>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <Loading />
                    ) : requests && requests.length > 0 ? (
                        requests.map((req) => (
                            <div key={req.id} className="shadow-sm border">
                                <div className="flex justify-between items-center p-4">
                                    <div>
                                        <p className="font-semibold">{req.user.name}</p>
                                        <p className="text-gray-500 text-sm">{req.user.email}</p>
                                    </div>
                                    <button onClick={() => approveRequest(req.user.id)} className="bg-green-600 hover:bg-green-700 text-white">Approve</button>
                                    <button onClick={() => rejectRequest(req.user.id)} className="bg-green-600 hover:bg-green-700 text-white">Reject</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState message="No join requests yet." />
                    )}

                </div>
                <button onClick={onClose}>close</button>
            </div>
        </div>
    )
}

export default RequestProgramModal