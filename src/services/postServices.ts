import { apiFetch } from "./apiClient"
import { PostGetTypes } from "@/types/postManagetypes"

//get posts
export const getPosts = async (programId: string) => {
    return apiFetch<PostGetTypes[]>(`/api/program/${programId}/posts`, {
        method: 'GET',
        credentials: 'include'
    })
}

//create posts
export const createPost = async (programId: string, content: string) => {
    return apiFetch(`/api/program/${programId}/posts`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ content })
    })
}

//create comment
export const createComment = async(programId: string, postId: string, content: string) => {
    return apiFetch(`/api/program/${programId}/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content })
    })
}