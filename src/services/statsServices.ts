import { apiFetch } from "./apiClient";
import { UserRegisterStats, PostsPerMonth } from "@/types/statstypes";


export const getUserRegisterStats = (): Promise<UserRegisterStats[]> =>{
    return apiFetch<UserRegisterStats[]>("/api/stats/user-registrations")
}


export const getPostsPerMonth = async (): Promise<PostsPerMonth[]> => {
    return apiFetch<PostsPerMonth[]>("/api/stats/posts-per-month")
}