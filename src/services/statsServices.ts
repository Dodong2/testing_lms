import { apiFetch } from "./apiClient";
import { UserRegisterStats, PostsPerMonth, FilesStatsResponse, ActiveProgramsResponse, LatestProgramResponse } from "@/types/statstypes";

export const getUserRegisterStats = (): Promise<UserRegisterStats[]> => {
    return apiFetch<UserRegisterStats[]>("/api/stats/user-registrations")
}

export const getPostsPerMonth = async (): Promise<PostsPerMonth[]> => {
    return apiFetch<PostsPerMonth[]>("/api/stats/posts-per-month")
}

export const getFilesStats = async (): Promise<FilesStatsResponse> => {
    return apiFetch<FilesStatsResponse>(`/api/stats/files`)
}

export const getActivePrograms = async (page: number = 1, limit: number = 5): Promise<ActiveProgramsResponse> => {
    return apiFetch<ActiveProgramsResponse>(`/api/stats/active-programs?page=${page}&limit=${limit}`);
}

export const getLatestProgram = async (): Promise<LatestProgramResponse> => {
    return apiFetch<LatestProgramResponse>(`/api/stats/latest-program`);
}