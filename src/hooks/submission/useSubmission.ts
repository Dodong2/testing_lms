import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { submitWork, getSubmissions, gradeSubmission } from "@/services/submissionServices";
import { SubmitWorkPayload, gradeSubmissionTypes } from "@/types/submissiontypes";

export const useSubmission = (programId: string, postId: string) => {

    const useGetSubmssions = () => {
        return useQuery({
            queryKey: ['submissions', programId, postId],
            queryFn: () => getSubmissions(programId, postId),
            enabled: !!programId && !!postId
        })
    }

    const useSubmitWork = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (payload: SubmitWorkPayload) =>
                submitWork(programId, postId, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['submissions', programId, postId] })
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
                toast.success("Graded successfully!")
            },
            onError: () => toast.error("Failed to submit")
    })
}



return { useGetSubmssions, useSubmitWork }
}