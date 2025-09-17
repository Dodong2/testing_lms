import { apiFetch } from "./apiClient";
import { Meeting, MeetingPayload } from '@/types/meetingManagetypes'

// get all meetings
export const getMeetingByProgram = async (programId: string): Promise<Meeting[]> => {
    return apiFetch(`/api/program/${programId}/meetings`)
}



// create meeting
export const createMeeting = async (programId: string, payload: MeetingPayload): Promise<Meeting> => {
    return apiFetch(`/api/program/${programId}/meetings`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
} 

