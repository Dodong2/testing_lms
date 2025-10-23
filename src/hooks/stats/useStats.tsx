import { useQuery } from "@tanstack/react-query";
import { getUserRegisterStats, getPostsPerMonth } from "@/services/statsServices";
import { UserRegisterStats, PostsPerMonth } from "@/types/statstypes";

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

    return { userUserRegistrations, usePostStats }
}