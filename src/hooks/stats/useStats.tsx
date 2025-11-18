import { useQuery } from "@tanstack/react-query";
import { getUserRegisterStats, getPostsPerMonth, getFilesStats, getActivePrograms, getLatestProgram } from "@/services/statsServices";
import { UserRegisterStats, PostsPerMonth, FilesStatsResponse, ActiveProgramsResponse, LatestProgramResponse } from "@/types/statstypes";

export const useStats = () => {

    const userUserRegistrations = () => {
        return useQuery<UserRegisterStats[]>({
            queryKey: ["user-registration-stats"],
            queryFn: getUserRegisterStats,
        })
    }

    const usePostStats = () => {
        return useQuery<PostsPerMonth[]>({
            queryKey: ["posts-per-month"],
            queryFn: getPostsPerMonth
        })
    }

    const useFilesStats = () => {
        return useQuery<FilesStatsResponse>({
            queryKey: ["files-stats"],
            queryFn: getFilesStats,
        })
    }

    const useActivePrograms = (page: number = 1, limit: number = 5) => {
        return useQuery<ActiveProgramsResponse>({
            queryKey: ["active-programs", page, limit],
            queryFn: () => getActivePrograms(page, limit),
        })
    }

    const useLatestProgram = () => {
    return useQuery<LatestProgramResponse>({
        queryKey: ["latest-program"],
        queryFn: getLatestProgram,
    });
};

    return { userUserRegistrations, usePostStats, useFilesStats, useActivePrograms, useLatestProgram }
}