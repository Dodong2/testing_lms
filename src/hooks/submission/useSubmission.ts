import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { submitWork, getSubmissions, gradeSubmission, getAllSubmissions } from "@/services/submissionServices";
import { SubmitWorkPayload, gradeSubmissionTypes, Submission } from "@/types/submissiontypes";

export const useSubmission = (programId: string, postId: string) => {

    const useGetSubmssions = (getAll: boolean = false) => {
        return useQuery({
            queryKey: ['submissions', programId, postId, getAll],
            queryFn: () => getSubmissions(programId, postId, getAll),
            enabled: !!programId && (getAll ? true : !!postId)
        })
    }

    //getting all submissions
    const useGetAllSubmissions = () => {
        return useQuery({
            queryKey: ['all-submissions', programId],
            queryFn: () => getAllSubmissions(programId),
            enabled: !!programId
        })
    }

    //
    const useSubmitWork = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (payload: SubmitWorkPayload) =>
                submitWork(programId, postId, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['submissions', programId, postId] })
                queryClient.invalidateQueries({ queryKey: ['all-submissions', programId] })
                toast.success("Submitted successfully!")
            },
            onError: () => toast.error("Failed to submit")
        })
    }

    const useGradeSubmission = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ submissionId, grade, feedback }: { submissionId: string, grade: number, feedback?: string }) =>
                gradeSubmission({programId, postId, submissionId, grade, feedback}),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["submissions", programId, postId] })
                queryClient.invalidateQueries({ queryKey: ["all-submissions", programId] })
                toast.success("Graded successfully!")
            },
            onError: () => toast.error("Failed to submit")
    })
}



return { useGetSubmssions, useSubmitWork, useGradeSubmission, useGetAllSubmissions }
}