import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAssignments, createAssignment, submitAssignment, getSubmissions } from "@/services/assignmentServices" 
import { Assignment, Submission } from "@/types/assignment"

export const useAssignment = () => {
    // get all assignments sa programs
    const useGetAssignment = (programId: string) => {
        return useQuery<Assignment[]>({
            queryKey: ["assignments", programId],
            queryFn: () => getAssignments(programId),
            enabled: !!programId
        })
    }

    // create a new assignment
    const useCreateAssignment = (programId: string) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (payload: { title: string, description?: string, dueDate?: string | null, attachments?: string[] }) =>
                createAssignment(programId, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["assignments", programId] })
            }
        })
    }

    // submit an assignment
    const useSubmitAssignment = (programId: string, assignmentId: string) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (payload: { fileUrl: string, fileName: string }) => 
                submitAssignment(programId, assignmentId, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["submissions", programId, assignmentId]
                })
            }
        })
    }

    // Get all submissions for a specific assignment
    const useSubmission = (programId: string, assignmentId: string) => {
        useQuery<Submission[]>({
            queryKey: ["Submissions", programId, assignmentId],
            queryFn: () => getSubmissions(programId, assignmentId),
            enabled: !!programId && !!assignmentId
        })
    }

  return { useGetAssignment, useCreateAssignment, useSubmitAssignment, useSubmission }
}

