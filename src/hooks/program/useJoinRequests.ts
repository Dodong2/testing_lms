import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
// services
import { joinProgram, getJoinRequests, approveJoinRequest } from "@/services/programServices"
// types
import { JoinRequestUser, JoinRequest } from '@/types/joinManagetypes'


export const useJoinRequests = () => {

    const useJoinProgram = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (programId: string) => joinProgram(programId),
            onSuccess: () => {
                toast.success("Join request sent")
                queryClient.invalidateQueries({ queryKey: ["programs"] })
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to join program")
            }
        })
    }

    const useJoinRequests = (programId: string) => {
        return useQuery<JoinRequest[]>({
            queryKey: ["join-requests", programId],
            queryFn: () => getJoinRequests(programId),
        })
    }

    const useApproveJoinRequest = (programId: string) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (userId: string) => approveJoinRequest(programId, userId),
            onSuccess: () => {
                toast.success("Request approved successfully")
                queryClient.invalidateQueries({ queryKey: ["join-requests", programId] })
                queryClient.invalidateQueries({ queryKey: ["programs"] }) // refresh counts
            },
            onError: () => toast.error("Failed to approve request"),
        })
    }

    return { useJoinProgram, useJoinRequests, useApproveJoinRequest }
}
