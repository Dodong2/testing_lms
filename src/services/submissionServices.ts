import { apiFetch } from "./apiClient";
import { SubmitWorkPayload, gradeSubmissionTypes } from "@/types/submissiontypes";


export const submitWork = async(programId: string, postId: string, payload: SubmitWorkPayload ) => {
    apiFetch(`/api/program/${programId}/posts/${postId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(payload),
        credentials: 'include'
    })
}

export const getSubmissions = async(programId: string, postId: string) => {
    apiFetch(`/api/program/${programId}/posts/${postId}/submissions`, {
        method: 'GET',
        credentials: 'include'
    })
}

export const gradeSubmission = async({ programId, postId, submissionId, grade, feedback }: gradeSubmissionTypes) => {
    apiFetch(`/api/program/${programId}/posts/${postId}/submissions/${submissionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ grade, feedback }),
        credentials: 'include'
    })
}