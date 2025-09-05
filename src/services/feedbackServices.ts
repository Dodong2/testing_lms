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

interface FeedbackPagination {
    feedbacks: FeedbackResponse[]
    total: number
    page: number
    totalPages: number
}

// create feedback
export const createFeedback = async(data: FeedbackPayload): Promise<FeedbackResponse> => {
    return apiFetch<FeedbackResponse>("/api/feedback", {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(data)
    })
}

// get feedback for admin (paginated)
export const getFeedbacks = async(page = 1, limit = 5) => {
    return apiFetch<FeedbackPagination>(`/api/feedback?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include'
    })
}