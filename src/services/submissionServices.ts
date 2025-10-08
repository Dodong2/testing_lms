import { apiFetch } from "./apiClient";
import { SubmitWorkPayload, gradeSubmissionTypes, Submission } from "@/types/submissiontypes";


export const submitWork = async (programId: string, postId: string, payload: SubmitWorkPayload) => {
    return apiFetch(`/api/program/${programId}/posts/${postId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(payload),
        credentials: 'include'
    })
}

export const getSubmissions = async (programId: string, postId: string): Promise<Submission[]> => {
    const data = await apiFetch<Submission[] | Submission | null>(`/api/program/${programId}/posts/${postId}/submissions`, {
        method: 'GET',
        credentials: 'include'
    })
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
}

export const gradeSubmission = async ({ programId, postId, submissionId, grade, feedback }: gradeSubmissionTypes) => {
    return apiFetch(`/api/program/${programId}/posts/${postId}/submissions/${submissionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ grade, feedback }),
        credentials: 'include'
    })
}