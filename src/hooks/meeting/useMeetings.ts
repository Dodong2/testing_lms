import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { getMeetingByProgram, createMeeting } from "@/services/meetingService"
import toast from "react-hot-toast"

export const useMeetings = (programId: string) => {

    // get all meetings
    const useGetMeetings = () => {
        return useQuery({
            queryKey: ["meetings", programId],
            queryFn: () => getMeetingByProgram(programId),
            enabled: !!programId
        })
    }

    // create meeting
    const useCreateMeeting = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (payload: { title: string, link: string, startTime: string, endTime: string }) => 
                createMeeting(programId, payload),
            onSuccess: () => {
                toast.success("Meeting created")
                queryClient.invalidateQueries({ queryKey: ["meetings", programId] })
            }
        })
    }

    return { useGetMeetings, useCreateMeeting }
}

