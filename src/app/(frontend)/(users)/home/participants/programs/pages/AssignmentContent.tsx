"use client"
import { useSession } from "next-auth/react"
/* hooks */
import { useAssignment } from "@/hooks/assignment/useAssignment"
import { useOpenAssignmentModal } from "@/hooks/assignment/useOpenAssignmentModal"
/* types */
import { Assignment } from "@/types/assignment"
/* utils */
import { formatCreatedAt } from "@/util/formatCreatedAt"
/* components */
import CreateAssignmentModal from "@/components/modals/assignments modal/CreateAssignmentModal"

interface AssignmentListProps {
    programId: string
    onSelect?: (assignment: Assignment) => void
}

export default function AssignmentPage({ programId, onSelect }: AssignmentListProps) {
    const { data: session, status } = useSession()
    const { data: assignments, isLoading, isError } = useAssignment().useGetAssignment(programId)
    const { openCreate, toggleOpenAssignment } = useOpenAssignmentModal()

    if (status === "loading") return <div>Loading...</div>
    if (!session) return null

    if (isLoading) return <p>Loading assignments...</p>
    if (isError) return <p>Failed to load assignments</p>

    return (
        <div>
            {(session.user.role === 'ADMIN' || session.user.role === 'INSTRUCTOR') && (
                <button onClick={toggleOpenAssignment}>Create Assignment</button>
            )}
            
            {/* List or empty state */}
            {(!assignments || assignments.length === 0) ? (
                <p>No assignments yet.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map((a) => (
                        <div
                            key={a.id}
                            className="rounded-lg border p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => onSelect?.(a)}
                        >
                            <h3 className="font-semibold">{a.title}</h3>
                            {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
                            {a.dueDate && (
                                <p className="text-xs text-red-500">
                                    {formatCreatedAt(a.createdAt)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {openCreate && (
                <CreateAssignmentModal programId={programId} onSuccess={toggleOpenAssignment} onClose={toggleOpenAssignment} />
            )}
        </div>
    )
}