import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createFeedback, FeedbackPayload, getFeedbacks } from "@/services/feedbackServices";

export const useFeedback = () => {
    const queryClient = useQueryClient()

    // create feedback
    const useCreateFeedback = () => {
        return useMutation({
            mutationFn: (payload: FeedbackPayload) => createFeedback(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
                toast.success("Feedback submitted!")
            },
            onError: () => {
                toast.error('Failed to submit feedback')
            }
        })
    }

    // get feedback for admin
    const useGetFeedbacks = () => {
        return useQuery({
            queryKey: ['feedbacks'],
            queryFn: getFeedbacks
        })
    }

    return { useCreateFeedback, useGetFeedbacks }
}