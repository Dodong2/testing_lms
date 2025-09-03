import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createFeedback, FeedbackPayload, getFeedbacks } from "@/services/feedbackServices";

export const useFeedback = () => {

    // create feedback
    const useCreateFeedback = () => {
        const queryClient = useQueryClient()
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
    const useGetFeedbacks = (page: number, limit = 5) => {
        return useQuery({
            queryKey: ['feedbacks', page],
            queryFn: () => getFeedbacks(page, limit),
            placeholderData: keepPreviousData
        })
    }

    return { useCreateFeedback, useGetFeedbacks }
}