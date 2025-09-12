import { apiFetch } from "./apiClient";
import { Assignment, Submission } from "@/types/assignment"

// get all assignments sa programs
export const getAssignments = async(programId: string) => {
    return apiFetch<Assignment[]>(`/api/program/${programId}/assignments`, {
        method: "GET",
        credentials: 'include'
    })
}

// create a new assignment
export const createAssignment = async (programId: string, payload: { title: string; description?: string; dueDate?: string | null; attachments?: unknown }) => {
    return apiFetch<Assignment>(`/api/program/${programId}/assignments`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload)
    })
}

// submit an assignment
export const submitAssignment = async (programId: string, assignmentId: string, payload: { fileUrl: string, fileName: string }) => {
    return apiFetch<Submission>(`/api/program/${programId}/assignments/${assignmentId}/submissions/`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload)
    })
}

// Get all submissions for a specific assignment
export const getSubmissions = async (programId: string, assignmentId: string) => {
    return apiFetch<Submission[]>(`/api/program/${programId}/assignments/${assignmentId}/submissions/`, {
        method: 'GET',
        credentials: "include"
    })
}