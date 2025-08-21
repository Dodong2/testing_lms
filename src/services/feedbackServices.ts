import { apiFetch } from "./apiClient";

export interface FeedbackPayload {
    subject: string
    description: string
    type: string
    visibility: "Anonymous" | "Identified"
    programId: string
}

export interface FeedbackResponse {
    id: string
    subject: string
    description: string
    type: string
    visibility: string
    programId: string
    userId: string
    createdAt: string
    user: {
        id: string
        name: string | null
        role: "ADMIN" | "INSTRUCTOR" | "BENEFICIARY"
        image: string | null
    }
    program: {
        id: string
        title: string
    }
}

// create feedback
export const createFeedback = async(data: FeedbackPayload): Promise<FeedbackResponse> => {
    return apiFetch<FeedbackResponse>("/api/feedback", {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(data)
    })
}

// get feedback for admin
export const getFeedbacks = async (): Promise<FeedbackResponse[]> => {
    return apiFetch<FeedbackResponse[]>('/api/feedback', {
        method: 'GET',
        credentials: 'include',
    })
}