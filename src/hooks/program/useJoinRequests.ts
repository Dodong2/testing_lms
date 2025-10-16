import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
// services
import { joinProgram, getJoinRequests, approveJoinRequest, rejectJoinRequest, cancelJoinRequest } from "@/services/programServices"
// types
import { JoinRequestUser, JoinRequest } from '@/types/joinManagetypes'

export const useJoinRequests = () => {

    // for beneficiary join program
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

    // for instructor get join lists program
    const useRequestLists = (programId: string) => {
        return useQuery<JoinRequest[]>({
            queryKey: ["join-requests", programId],
            queryFn: () => getJoinRequests(programId),
        })
    }

    // for beneficiary join program
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

    // for instructor reject join
    const useRejectJoinRequest = (programId: string) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (userId: string) => rejectJoinRequest(programId, userId),
            onSuccess: () => {
                toast.success("Request rejected successfully")
                queryClient.invalidateQueries({ queryKey: ["join-requests", programId] })
            },
            onError: () => toast.error("Failed to reject request")
        })
    }

    // Approve all pending requests
    const useApproveAll = (programId: string) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: async (userIds: string[]) => {
                await Promise.all(userIds.map(id => approveJoinRequest(programId, id)))
            },
            onSuccess: () => {
                toast.success("All requests approved successfully"),
                queryClient.invalidateQueries({ queryKey: ["join-requests", programId] })
                queryClient.invalidateQueries({ queryKey: ["programs"] })
            },
            onError: () => toast.error("Failed to approve all requests"),
        })
    }

    // Reject all pending requests
    const useRejectAll = (programId: string) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: async (userIds: string[]) => {
                await Promise.all(userIds.map(id => rejectJoinRequest(programId, id)))
            },
            onSuccess: () => {
                toast.success("All requests rejected successfully")
                queryClient.invalidateQueries({ queryKey: ["join-requests", programId] })
            },
            onError: () => toast.error("Failed to reject all requests")
        })
    }

    // for beneficiary cancel request
    const useCancelJoin = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (programId: string) => cancelJoinRequest(programId),
            onSuccess: () => {
                toast.success('cancel join request')
                queryClient.invalidateQueries({ queryKey: ["programs"] })
            },
            onError: () => toast.error("Failed to cancel join request"),
        })
    }

    return { useJoinProgram, useRequestLists, useApproveJoinRequest, useRejectJoinRequest, useApproveAll, useRejectAll, useCancelJoin }
}
